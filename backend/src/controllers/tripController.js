import prisma from '../config/db.js';
import crypto from 'crypto';
import { getExchangeRate } from '../services/exchangeApi.js';
import PDFDocument from 'pdfkit';
import weatherService from '../services/weatherApi.js';
import multer from 'multer';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import fs from 'fs';

const createNotification = async (userId, type, content) => {
    try {
        await prisma.notification.create({
            data: { userId, type, content }
        });
    } catch (error) {
        console.error("Error al crear notificación:", error);
    }
};

const isCollaborator = async (tripId, userId) => {
    const record = await prisma.tripCollaborator.findUnique({
        where: { tripId_userId: { tripId, userId } }
    });
    return !!record;
};

export const getUserTrips = async (req, res) => {
    try {
        const [ownTrips, collaborations] = await Promise.all([
            prisma.trip.findMany({
                where: { userId: req.userId },
                include: {
                    itineraries: true,
                    user: { select: { id: true, name: true, avatar: true } }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.tripCollaborator.findMany({
                where: { userId: req.userId },
                include: {
                    trip: {
                        include: {
                            itineraries: true,
                            user: { select: { id: true, name: true, avatar: true } }
                        }
                    }
                }
            })
        ]);

        const own = ownTrips.map(t => ({ ...t, isCollaborator: false }));
        const collab = collaborations.map(c => ({ ...c.trip, isCollaborator: true }));

        res.json({ trips: [...own, ...collab] });
    } catch (error) {
        console.error('Error al obtener viajes:', error);
        res.status(500).json({ error: 'Error al obtener viajes' });
    }
};

export const getTripById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id === 'undefined') {
            return res.status(400).json({ error: "ID de viaje no proporcionado" });
        }

        const tripId = parseInt(id);

        const trip = await prisma.trip.findUnique({
            where: { id: id },
            include: {
                itineraries: true,
                hotels: true,
                flights: true,
                user: { select: { id: true, name: true, avatar: true } }
            }
        });

        if (!trip) return res.status(404).json({ error: "Viaje no encontrado" });

        const isOwner = trip.userId === req.userId;
        if (!isOwner && !(await isCollaborator(id, req.userId))) {
            return res.status(403).json({ error: "No autorizado" });
        }

        let safetyAlert = null;
        try {
            const cityName = trip.destination.split(',')[0];
            const weather = await weatherService(cityName);
            
            const weatherId = weather.weather[0].id;
            const temp = weather.main.temp;

            if (weatherId >= 200 && weatherId < 300) {
                safetyAlert = `🚨 PELIGRO: Tormenta detectada en ${cityName}.`;
            } else if (temp > 40) {
                safetyAlert = `🔥 AVISO: Calor extremo (${temp}°C).`;
            }
        } catch (weatherError) {
            console.log("Clima no disponible.");
        }

        res.json({
            ...trip,
            isCollaborator: !isOwner,
            totalPrice: trip.totalPrice || trip.budget || 0,
            safetyAlert: safetyAlert
        });

    } catch (error) {
        console.error("Error en getTripById:", error);
        res.status(500).json({ error: "Error en el servidor al obtener el viaje" });
    }
};

export const saveTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        await prisma.savedTrip.create({
            data: { userId: req.userId, tripId }
        });
        res.json({ message: 'Viaje guardado' });
    } catch (error) {
        if (error.code === 'P2002') return res.status(400).json({ error: 'Ya guardado' });
        res.status(500).json({ error: 'Error al guardar' });
    }
};

export const unsaveTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        await prisma.savedTrip.delete({
            where: { userId_tripId: { userId: req.userId, tripId } }
        });
        res.json({ message: 'Viaje eliminado de guardados' });
    } catch {
        res.status(500).json({ error: 'Error al eliminar' });
    }
};

export const createTrip = async (req, res) => {
    try {
        const {
            origin, destination, startDate, endDate, 
            budget, currency, people, travelMode
        } = req.body;

        if (!destination || !destination.includes(',')) {
            return res.status(400).json({ 
                error: "Formato de destino incorrecto. Usa: 'Ciudad, País'" 
            });
        }

        const country = destination.includes(',') 
            ? destination.split(',')[1].trim() 
            : destination.trim();

        const trip = await prisma.trip.create({
            data: {
                user: { connect: { id: req.userId } },
                origin: origin || '',
                destination,
                country,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                budget: budget ? parseFloat(budget) : 0,
                currency: currency || 'EUR',
                travelersCount: people ? parseInt(people) : 1,
                travelStyle: travelMode || 'Aventura',
            }
        });

        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;

        const itineraryData = Array.from({ length: diffDays }, (_, i) => {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            return {
                tripId: trip.id,
                day: i + 1,
                date: date,
                activities: [] 
            };
        });

        await prisma.itinerary.createMany({ data: itineraryData });

        const { awardBadge } = await import('./userController.js');

        const totalTrips = await prisma.trip.count({ where: { userId: req.userId || req.user.id } });

        if (totalTrips === 1) await awardBadge(req.userId || req.user.id, 'FIRST_TRIP');
        if (totalTrips >= 5) await awardBadge(req.userId || req.user.id, 'EXPLORER');

        const countries = await prisma.trip.findMany({
            where: { userId: req.userId || req.user.id },
            select: { country: true }
        });
        const uniqueCountries = new Set(countries.map(t => t.country).filter(Boolean));
        if (uniqueCountries.size >= 10) await awardBadge(req.userId || req.user.id, 'NOMAD');

        const adventureTrips = await prisma.trip.count({
            where: { userId: req.userId || req.user.id, travelStyle: 'Aventura' }
        });
        if (adventureTrips >= 3) await awardBadge(req.userId || req.user.id, 'ADVENTURER');

        if (trip.budget && trip.budget < 500) await awardBadge(req.userId || req.user.id, 'BUDGET_MASTER');

        res.status(201).json({
            message: 'Viaje e itinerarios creados exitosamente',
            trip
        });

    } catch (error) {
        console.error('Error al crear viaje COMPLETO:', JSON.stringify(error, null, 2));
        console.error('Error mensaje:', error.message);
        console.error('Error código:', error.code);
        if (error.name === 'PrismaClientValidationError') {
            return res.status(400).json({ error: 'Error de validación: Revisa los campos de la base de datos.' });
        }
        res.status(500).json({ error: 'Error interno al procesar el viaje' });
    }
};

export const updateTrip = async (req, res) => {
    try {
        const { id } = req.params;

        const existingTrip = await prisma.trip.findUnique({ where: { id } });
        if (!existingTrip) return res.status(404).json({ error: 'Viaje no encontrado' });
        if (existingTrip.userId !== req.userId && !(await isCollaborator(id, req.userId))) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { origin, destination, startDate, endDate, budget, people, travelMode, currency, isPublic, coverImage } = req.body;

        const trip = await prisma.trip.update({
            where: { id },
            data: {
                ...(origin !== undefined && { origin }),
                ...(destination !== undefined && { destination }),
                ...(startDate !== undefined && { startDate: new Date(startDate) }),
                ...(endDate !== undefined && { endDate: new Date(endDate) }),
                ...(budget !== undefined && { budget: parseFloat(budget) }),
                ...(people !== undefined && { travelersCount: parseInt(people) }),
                ...(travelMode !== undefined && { travelStyle: travelMode }),
                ...(currency !== undefined && { currency }),
                ...(isPublic !== undefined && { isPublic }),
                ...(coverImage !== undefined && { coverImage }),
            },
            include: { itineraries: true }
        });

        res.json({ message: 'Viaje actualizado', trip });
    } catch (error) {
        console.error('Error al actualizar viaje:', error.message);
        res.status(500).json({ error: 'Error al actualizar viaje' });
    }
};

export const deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const existingTrip = await prisma.trip.findUnique({ where: { id } });

        if (!existingTrip || existingTrip.userId !== req.userId) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        await prisma.trip.delete({ where: { id } });
        res.json({ message: 'Viaje eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar viaje' });
    }
};

export const addActivity = async (req, res) => {
    try {
        const { itineraryId } = req.params;
        const { name, type, lat, lon, time, notes, amount } = req.body;

        const itinerary = await prisma.itinerary.findUnique({
            where: { id: itineraryId },
            include: { trip: true }
        });

        if (!itinerary) return res.status(404).json({ error: 'Día no encontrado' });
        if (itinerary.trip.userId !== req.userId && !(await isCollaborator(itinerary.tripId, req.userId))) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        let photoUrl = null;
        if (req.file) {
            photoUrl = await uploadToCloudinary(req.file.buffer, `users/${req.userId}/activities`);
        }

        const newActivity = {
            id: crypto.randomUUID(),
            name,
            type,
            location: { lat, lon },
            time: time || "00:00",
            notes: notes || "",
            amount: amount ? parseFloat(amount) : null,
            photos: photoUrl ? [photoUrl] : []
        };

        const updatedActivities = [...(itinerary.activities || []), newActivity];

        const updatedItinerary = await prisma.itinerary.update({
            where: { id: itineraryId },
            data: { activities: updatedActivities }
        });

        res.json({ message: 'Actividad añadida', updatedItinerary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al añadir actividad' });
    }
};

export const deleteActivity = async (req, res) => {
    try {
        const { itineraryId, activityId } = req.params;

        const itinerary = await prisma.itinerary.findUnique({
            where: { id: itineraryId },
            include: { trip: true }
        });

        if (!itinerary) return res.status(404).json({ error: 'Día no encontrado' });
        if (itinerary.trip.userId !== req.userId && !(await isCollaborator(itinerary.tripId, req.userId))) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const currentActivities = itinerary.activities || [];
        const updatedActivities = currentActivities.filter(act => act.id !== activityId);

        const updatedItinerary = await prisma.itinerary.update({
            where: { id: itineraryId },
            data: { activities: updatedActivities }
        });

        res.json({ message: 'Actividad eliminada', updatedItinerary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar actividad' });
    }
};

export const addPhotoToActivity = async (req, res) => {
    try {
        const { itineraryId, activityId } = req.params;

        const itinerary = await prisma.itinerary.findUnique({
            where: { id: itineraryId },
            include: { trip: true }
        });

        if (!itinerary) return res.status(404).json({ error: 'Día no encontrado' });
        if (itinerary.trip.userId !== req.userId && !(await isCollaborator(itinerary.tripId, req.userId))) {
            return res.status(403).json({ error: 'No autorizado' });
        }
        if (!req.file) return res.status(400).json({ error: 'No se subió ninguna foto' });

        const photoUrl = await uploadToCloudinary(req.file.buffer, `users/${req.userId}/activities`);

        const activities = itinerary.activities || [];
        const updated = activities.map((act) => {
            if (act.id === activityId) {
                return { ...act, photos: [...(act.photos || []), photoUrl] };
            }
            return act;
        });

        await prisma.itinerary.update({
            where: { id: itineraryId },
            data: { activities: updated }
        });

        res.json({ photoUrl });
    } catch (error) {
        res.status(500).json({ error: 'Error al añadir foto' });
    }
};

export const updateItineraryNotes = async (req, res) => {
    try {
        const { itineraryId } = req.params;
        const { notes, title } = req.body;

        const itinerary = await prisma.itinerary.findUnique({
            where: { id: itineraryId },
            include: { trip: true }
        });

        if (!itinerary) return res.status(404).json({ error: 'Día no encontrado' });
        if (itinerary.trip.userId !== req.userId && !(await isCollaborator(itinerary.tripId, req.userId))) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const updated = await prisma.itinerary.update({
            where: { id: itineraryId },
            data: { notes, title }
        });

        res.json({ message: 'Notas actualizadas', itinerary: updated });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar notas' });
    }
};

export const convertTripBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const { targetCurrency } = req.query;

        const trip = await prisma.trip.findUnique({ where: { id } });

        if (!trip) return res.status(404).json({ error: 'Viaje no encontrado' });

        const rate = await getExchangeRate(trip.currency, targetCurrency);

        if (!rate) {
            return res.status(400).json({ error: 'Moneda no soportada o error en la API' });
        }

        const convertedBudget = trip.budget * rate;

        res.json({
            originalBudget: trip.budget,
            originalCurrency: trip.currency,
            convertedBudget: parseFloat(convertedBudget.toFixed(2)),
            targetCurrency: targetCurrency.toUpperCase(),
            exchangeRate: rate
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al convertir moneda' });
    }
};

export const downloadTripPDF = async (req, res) => {
    try {
        const { id } = req.params;
        const trip = await prisma.trip.findUnique({
            where: { id },
            include: {
                itineraries: { orderBy: { day: 'asc' } },
                flights: true,
                hotels: true,
                expenses: true,
                transports: true,
                destinationInfo: true
            }
        });

        if (!trip) return res.status(404).json({ error: 'Viaje no encontrado' });
        if (trip.userId !== req.userId && !(await isCollaborator(id, req.userId))) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const pathMod = await import('path');
        const { fileURLToPath } = await import('url');
        const fsMod = await import('fs');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = pathMod.dirname(__filename);
        const assetsDir = pathMod.join(__dirname, '..', 'assets');

        const fontRegular = pathMod.join(assetsDir, 'Poppins-Regular.ttf');
        const fontBold = pathMod.join(assetsDir, 'Poppins-Bold.ttf');
        const fontMedium = pathMod.join(assetsDir, 'Poppins-Medium.ttf');
        const logoWhite = pathMod.join(assetsDir, 'logo_white.png');

        const hasFont = fsMod.existsSync(fontRegular) && fsMod.existsSync(fontBold);
        const hasLogoWhite = fsMod.existsSync(logoWhite);

        const doc = new PDFDocument({ margin: 0, size: 'A4' });

        if (hasFont) {
            doc.registerFont('Regular', fontRegular);
            doc.registerFont('Bold', fontBold);
            doc.registerFont('Medium', fsMod.existsSync(fontMedium) ? fontMedium : fontRegular);
        }

        const F = hasFont ? 'Regular' : 'Helvetica';
        const FB = hasFont ? 'Bold' : 'Helvetica-Bold';

        const filename = encodeURIComponent(`Itinerario_${trip.destination}.pdf`);
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);

        const W = 595.28;
        const H = 841.89;
        const M = 50;
        const PRIMARY = '#2563EB';
        const PRIMARY_LIGHT = '#EFF6FF';
        const DARK = '#111827';
        const GRAY = '#6b7280';
        const LIGHT_GRAY = '#9ca3af';
        const GREEN = '#059669';
        const RED = '#dc2626';
        const ARROW = '  >  ';
        const EUR = ' €';
        const destInfo = trip.destinationInfo?.data || null;

        const drawPageHeader = (title, color) => {
            doc.rect(0, 0, 596, 70).fill(color);
            doc.fillColor('#ffffff').fontSize(22).font(FB)
                .text(title, M, 22, { width: 300 });
            if (hasLogoWhite) {
                try { doc.image(logoWhite, W - M - 60, 4, { width: 62 }); } catch {}
            }
            doc.y = 90;
        };

        const checkSpace = (needed = 100) => {
            if (doc.y > H - needed) {
                doc.addPage({ margin: 0, size: 'A4' });
                doc.y = 30;
                return true;
            }
            return false;
        };

        doc.rect(0, 0, 596, H).fill(PRIMARY);
        doc.circle(W / 2, 240, 90).fillColor('rgba(255,255,255,0.06)').fill();
        doc.circle(W / 2, 240, 70).fillColor('rgba(255,255,255,0.04)').fill();

        if (hasLogoWhite) {
            try { doc.image(logoWhite, (W - 180) / 2, 90, { width: 180 }); } catch {}
        }

        doc.fillColor('#ffffff').fontSize(32).font(FB)
            .text(trip.destination.toUpperCase(), M, 310, { width: W - M * 2, align: 'center' });

        if (trip.country) {
            doc.fontSize(13).font(F).fillColor('rgba(255,255,255,0.7)')
                .text(trip.country, M, doc.y + 6, { width: W - M * 2, align: 'center' });
        }

        doc.moveDown(2);

        const startStr = new Date(trip.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
        const endStr = new Date(trip.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
        doc.fontSize(12).fillColor('#ffffff').font(F)
            .text(`${startStr}  -  ${endStr}`, M, doc.y + 10, { width: W - M * 2, align: 'center' });

        doc.moveDown(0.5);
        const viajeros = `${trip.travelersCount || 1} viajero${(trip.travelersCount || 1) > 1 ? 's' : ''}`;
        doc.fontSize(11).fillColor('rgba(255,255,255,0.7)').font(F)
            .text(`${viajeros}  |  ${trip.travelStyle || 'Aventura'}  |  Presupuesto: ${trip.budget || 0}${EUR}`, M, doc.y, { width: W - M * 2, align: 'center' });

        if (destInfo) {
            const infoY = 530;
            const boxW = 145;
            const gap = 15;
            const totalBoxW = boxW * 3 + gap * 2;
            const startX = (W - totalBoxW) / 2;
            const quickInfo = [
                { label: 'Idioma', value: destInfo.datos_practicos?.idioma || '-' },
                { label: 'Moneda', value: destInfo.moneda?.nombre ? `${destInfo.moneda.nombre} (${destInfo.moneda.simbolo || destInfo.moneda.codigo})` : '-' },
                { label: 'Enchufe', value: destInfo.datos_practicos?.enchufe || '-' },
            ];
            quickInfo.forEach((item, i) => {
                const x = startX + i * (boxW + gap);
                doc.roundedRect(x, infoY, boxW, 50, 8).fillColor('rgba(255,255,255,0.12)').fill();
                doc.fillColor('rgba(255,255,255,0.6)').fontSize(8).font(F).text(item.label, x + 12, infoY + 10, { width: boxW - 24 });
                doc.fillColor('#ffffff').fontSize(10).font(FB).text(item.value, x + 12, infoY + 26, { width: boxW - 24 });
            });
        }

        doc.fillColor('rgba(255,255,255,0.35)').fontSize(8).font(F)
            .text('Generado con Travel Planner', M, H - 35, { width: W - M * 2, align: 'center' });

        if (trip.flights?.length > 0) {
            doc.addPage({ margin: 0, size: 'A4' });
            drawPageHeader('Vuelos', '#3b82f6');
            trip.flights.forEach(f => {
                checkSpace(75);
                const y = doc.y;
                doc.roundedRect(M, y, W - M * 2, 58, 8).fillColor(PRIMARY_LIGHT).fill();
                doc.fillColor(DARK).fontSize(13).font(FB)
                    .text(`${f.originCity || '?'}${ARROW}${f.destCity || '?'}`, M + 15, y + 10, { width: 300 });
                if (f.price) {
                    doc.fillColor(PRIMARY).fontSize(14).font(FB)
                        .text(`${f.price}${EUR}`, W - M - 85, y + 10, { width: 70, align: 'right' });
                }
                const depTime = new Date(f.departure).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                const arrTime = new Date(f.arrival).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                const depDate = new Date(f.departure).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
                const stops = f.stops === 0 ? 'Directo' : `${f.stops} escala${f.stops > 1 ? 's' : ''}`;
                const airline = f.airline && f.airline !== 'ZZ' ? f.airline : '';
                doc.fillColor(GRAY).fontSize(9).font(F)
                    .text([depDate, `${depTime} - ${arrTime}`, stops, airline].filter(Boolean).join('  |  '), M + 15, y + 33, { width: W - M * 2 - 30 });
                doc.y = y + 68;
            });
        }

        if (trip.hotels?.length > 0) {
            doc.addPage({ margin: 0, size: 'A4' });
            drawPageHeader('Alojamiento', '#8b5cf6');
            trip.hotels.forEach(h => {
                checkSpace(80);
                const y = doc.y;
                doc.roundedRect(M, y, W - M * 2, 65, 8).fillColor('#f5f3ff').fill();
                doc.fillColor(DARK).fontSize(13).font(FB)
                    .text(h.name || 'Hotel', M + 15, y + 10, { width: 330 });
                if (h.address) {
                    doc.fillColor(GRAY).fontSize(9).font(F)
                        .text(h.address, M + 15, y + 28, { width: 330 });
                }
                const checkIn = new Date(h.checkIn).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
                const checkOut = new Date(h.checkOut).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
                doc.fillColor(GRAY).fontSize(9).font(F)
                    .text(`Check-in: ${checkIn}  |  Check-out: ${checkOut}`, M + 15, y + 44, { width: 300 });
                if (h.price) {
                    doc.fillColor('#7c3aed').fontSize(14).font(FB)
                        .text(`${h.price}${EUR}`, W - M - 85, y + 12, { width: 70, align: 'right' });
                }
                doc.y = y + 78;
            });
        }

        if (trip.transports?.length > 0) {
            doc.addPage({ margin: 0, size: 'A4' });
            drawPageHeader('Transporte', '#6366f1');
            trip.transports.forEach(t => {
                checkSpace(110);
                const y = doc.y;
                const isPublic = t.mode === 'publico';
                const bgColor = isPublic ? '#eff6ff' : '#fffbeb';
                const accentColor = isPublic ? '#2563eb' : '#d97706';
                const routeText = `${t.origin}${ARROW}${t.destination}`;
                const routeHeight = doc.fontSize(11).font(FB).heightOfString(routeText, { width: W - M * 2 - 50 });
                const detalles = [
                    t.tipoTransporte,
                    t.lineaRecomendada ? `Linea ${t.lineaRecomendada}` : null,
                    t.duration ? `${t.duration} min` : null,
                    t.price ? `${t.price}${EUR}` : null
                ].filter(Boolean).join('  |  ');
                const cardH = 30 + routeHeight + (detalles ? 25 : 10) + 15;
                doc.roundedRect(M, y, W - M * 2, cardH, 8).fillColor(bgColor).fill();
                doc.rect(M, y + 4, 4, cardH - 8).fillColor(accentColor).fill();
                const tipo = isPublic ? 'TRANSPORTE PUBLICO' : 'TAXI / VTC';
                doc.fillColor(accentColor).fontSize(8).font(FB).text(tipo, M + 18, y + 12);
                doc.fillColor(DARK).fontSize(11).font(FB)
                    .text(routeText, M + 18, y + 30, { width: W - M * 2 - 50 });
                if (detalles) {
                    const detailsY = y + 30 + routeHeight + 10;
                    doc.fillColor(GRAY).fontSize(9).font(F).text(detalles, M + 18, detailsY, { width: W - M * 2 - 50 });
                }
                doc.y = y + cardH + 10;
            });
        }

        doc.addPage({ margin: 0, size: 'A4' });
        drawPageHeader('Itinerario', '#10b981');
        trip.itineraries.forEach(day => {
            checkSpace(100);
            const dateStr = new Date(day.date).toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'short' });
            const y = doc.y;
            doc.roundedRect(M, y, W - M * 2, 28, 6).fillColor('#ecfdf5').fill();
            doc.fillColor('#065f46').fontSize(12).font(FB)
                .text(`Dia ${day.day}  -  ${dateStr}`, M + 12, y + 7);
            doc.y = y + 36;
            if (day.title) {
                doc.fillColor(DARK).fontSize(10).font(FB).text(day.title, M + 12, doc.y);
                doc.y += 16;
            }
            if (day.notes) {
                doc.fillColor(GRAY).fontSize(9).font(F).text(day.notes, M + 12, doc.y, { width: W - M * 2 - 24 });
                doc.y += 14;
            }
            const activities = Array.isArray(day.activities) ? day.activities : [];
            if (activities.length > 0) {
                activities.sort((a, b) => (a.time || '').localeCompare(b.time || '')).forEach(act => {
                    checkSpace(45);
                    const ay = doc.y;
                    if (act.time) {
                        doc.roundedRect(M + 12, ay, 44, 18, 4).fillColor(PRIMARY_LIGHT).fill();
                        doc.fillColor(PRIMARY).fontSize(8).font(FB)
                            .text(act.time, M + 14, ay + 4, { width: 40, align: 'center' });
                    }
                    doc.fillColor(DARK).fontSize(10).font(F)
                        .text(act.name, M + 64, ay + 2, { width: W - M - 64 - M - 60 });
                    let nextY = doc.y + 2;
                    if (act.type && act.type !== 'Actividad') {
                        doc.fillColor(LIGHT_GRAY).fontSize(7).font(F).text(act.type, M + 64, nextY);
                        nextY = doc.y + 2;
                    }
                    if (act.notes) {
                        doc.fillColor(LIGHT_GRAY).fontSize(7).font(F)
                            .text(act.notes, M + 64, nextY, { width: W - M - 64 - M - 60 });
                        nextY = doc.y + 2;
                    }
                    if (act.amount) {
                        doc.fillColor(GREEN).fontSize(9).font(FB)
                            .text(`${act.amount}${EUR}`, W - M - 55, ay + 2, { width: 40, align: 'right' });
                    }
                    doc.y = Math.max(nextY + 4, ay + 26);
                });
            } else {
                doc.fillColor(LIGHT_GRAY).fontSize(9).font(F)
                    .text('Sin actividades programadas', M + 12, doc.y);
                doc.y += 16;
            }
            doc.y += 10;
        });

        const flightsTotal = (trip.flights || []).reduce((acc, f) => acc + (f.price || 0), 0);
        const hotelsTotal = (trip.hotels || []).reduce((acc, h) => acc + (h.price || 0), 0);
        const manualExpenses = (trip.expenses || []).reduce((acc, e) => acc + (e.amount || 0), 0);
        let actExpTotal = 0;
        (trip.itineraries || []).forEach(day => {
            (Array.isArray(day.activities) ? day.activities : []).forEach(act => {
                if (act.amount) actExpTotal += parseFloat(act.amount) || 0;
            });
        });
        const totalSpent = flightsTotal + hotelsTotal + manualExpenses + actExpTotal;
        const remaining = (trip.budget || 0) - totalSpent;

        doc.addPage({ margin: 0, size: 'A4' });
        drawPageHeader('Presupuesto', '#f59e0b');
        const budgetY = doc.y + 10;
        doc.roundedRect(M, budgetY, W - M * 2, 105, 10).fillColor('#fffbeb').fill();
        doc.fillColor(DARK).fontSize(30).font(FB)
            .text(`${totalSpent.toFixed(0)}${EUR}`, M + 25, budgetY + 12, { width: 220 });
        doc.fillColor(GRAY).fontSize(10).font(F)
            .text(`de ${trip.budget || 0}${EUR} presupuestados`, M + 25, budgetY + 48);
        doc.fillColor(remaining >= 0 ? GREEN : RED).fontSize(18).font(FB)
            .text(`${remaining >= 0 ? '+' : ''}${remaining.toFixed(0)}${EUR}`, W - M - 140, budgetY + 18, { width: 120, align: 'right' });
        doc.fillColor(GRAY).fontSize(9).font(F)
            .text(remaining >= 0 ? 'disponible' : 'de exceso', W - M - 140, budgetY + 42, { width: 120, align: 'right' });

        const barY = budgetY + 75;
        const barW = W - M * 2 - 50;
        const barX = M + 25;
        doc.roundedRect(barX, barY, barW, 10, 5).fillColor('#e5e7eb').fill();
        const barCategories = [
            { amount: flightsTotal, color: '#3b82f6' },
            { amount: hotelsTotal, color: '#8b5cf6' },
            { amount: actExpTotal, color: '#10b981' },
            { amount: manualExpenses, color: '#f59e0b' },
        ].filter(c => c.amount > 0);
        if (totalSpent > 0 && trip.budget > 0) {
            let barOffset = 0;
            barCategories.forEach(cat => {
                const catW = Math.max((cat.amount / trip.budget) * barW, 2);
                doc.rect(barX + barOffset, barY, catW, 10).fillColor(cat.color).fill();
                barOffset += catW;
            });
        }

        doc.y = budgetY + 120;
        const displayCategories = [
            { label: 'Vuelos', amount: flightsTotal, color: '#3b82f6' },
            { label: 'Alojamiento', amount: hotelsTotal, color: '#8b5cf6' },
            { label: 'Actividades', amount: actExpTotal, color: '#10b981' },
            { label: 'Otros gastos', amount: manualExpenses, color: '#f59e0b' },
        ].filter(c => c.amount > 0);
        displayCategories.forEach(cat => {
            checkSpace(42);
            const cy = doc.y;
            doc.roundedRect(M, cy, W - M * 2, 35, 6).fillColor('#fefce8').fill();
            doc.circle(M + 20, cy + 17, 6).fillColor(cat.color).fill();
            doc.fillColor(DARK).fontSize(11).font(F).text(cat.label, M + 35, cy + 10);
            doc.fillColor(DARK).fontSize(12).font(FB)
                .text(`${cat.amount.toFixed(0)}${EUR}`, W - M - 85, cy + 9, { width: 70, align: 'right' });
            doc.y = cy + 42;
        });

        if (trip.expenses?.length > 0) {
            doc.y += 10;
            checkSpace(30);
            doc.fillColor(GRAY).fontSize(9).font(FB).text('DETALLE DE GASTOS', M, doc.y);
            doc.y += 18;
            trip.expenses.forEach(e => {
                checkSpace(22);
                const ey = doc.y;
                doc.fillColor(DARK).fontSize(9).font(F).text(e.name, M + 10, ey, { width: 280 });
                doc.fillColor(LIGHT_GRAY).fontSize(8).font(F).text(e.category, M + 300, ey);
                doc.fillColor(DARK).fontSize(9).font(FB)
                    .text(`${e.amount.toFixed(0)}${EUR}`, W - M - 55, ey, { width: 40, align: 'right' });
                doc.y = ey + 18;
            });
        }

        if (destInfo && destInfo.datos_practicos) {
            doc.addPage({ margin: 0, size: 'A4' });
            drawPageHeader('Informacion del destino', '#0ea5e9');
            const practicalItems = [
                { label: 'IDIOMA', value: destInfo.datos_practicos?.idioma },
                { label: 'ENCHUFE', value: destInfo.datos_practicos?.enchufe },
                { label: 'VOLTAJE', value: destInfo.datos_practicos?.voltaje },
                { label: 'PROPINAS', value: destInfo.datos_practicos?.propinas },
                { label: 'SEGURIDAD', value: destInfo.datos_practicos?.seguridad },
                { label: 'MEJOR EPOCA', value: destInfo.datos_practicos?.mejor_epoca },
                { label: 'TRANSPORTE LOCAL', value: destInfo.datos_practicos?.transporte_local },
            ].filter(i => i.value);
            practicalItems.forEach(item => {
                checkSpace(60);
                const iy = doc.y;
                const textH = doc.fontSize(9).font(F).heightOfString(item.value, { width: W - M * 2 - 30 });
                const cardH = Math.max(40, textH + 26);
                doc.roundedRect(M, iy, W - M * 2, cardH, 6).fillColor('#f0f9ff').fill();
                doc.fillColor('#0c4a6e').fontSize(8).font(FB).text(item.label, M + 12, iy + 8);
                doc.fillColor(DARK).fontSize(9).font(F).text(item.value, M + 12, iy + 22, { width: W - M * 2 - 30 });
                doc.y = iy + cardH + 6;
            });
            if (destInfo.moneda) {
                checkSpace(65);
                const my = doc.y + 3;
                doc.roundedRect(M, my, W - M * 2, 55, 8).fillColor('#f0f9ff').fill();
                doc.fillColor('#0c4a6e').fontSize(8).font(FB).text('MONEDA', M + 12, my + 8);
                doc.fillColor(DARK).fontSize(11).font(FB)
                    .text(`${destInfo.moneda.nombre} (${destInfo.moneda.simbolo || ''}) - ${destInfo.moneda.codigo}`, M + 12, my + 23);
                if (destInfo.moneda.cambio_aproximado) {
                    doc.fillColor(GRAY).fontSize(8).font(F).text(destInfo.moneda.cambio_aproximado, M + 12, my + 40, { width: W - M * 2 - 30 });
                }
                doc.y = my + 63;
            }
            if (destInfo.documentos?.visado) {
                checkSpace(55);
                const vy = doc.y + 3;
                const visaH = doc.fontSize(9).font(F).heightOfString(destInfo.documentos.visado, { width: W - M * 2 - 30 });
                const visaCardH = Math.max(40, visaH + 26);
                doc.roundedRect(M, vy, W - M * 2, visaCardH, 6).fillColor('#f0f9ff').fill();
                doc.fillColor('#0c4a6e').fontSize(8).font(FB).text('VISADO', M + 12, vy + 8);
                doc.fillColor(DARK).fontSize(9).font(F).text(destInfo.documentos.visado, M + 12, vy + 22, { width: W - M * 2 - 30 });
                doc.y = vy + visaCardH + 6;
            }
            if (destInfo.vacunas?.recomendadas?.length > 0) {
                checkSpace(50);
                const vaY = doc.y + 3;
                const vaH = 24 + destInfo.vacunas.recomendadas.length * 15;
                doc.roundedRect(M, vaY, W - M * 2, vaH, 6).fillColor('#f0f9ff').fill();
                doc.fillColor('#0c4a6e').fontSize(8).font(FB).text('VACUNAS RECOMENDADAS', M + 12, vaY + 8);
                let vOffset = vaY + 24;
                destInfo.vacunas.recomendadas.forEach(v => {
                    doc.fillColor(DARK).fontSize(9).font(F).text(`-  ${v}`, M + 12, vOffset);
                    vOffset += 15;
                });
                doc.y = vOffset + 5;
            }
        }

        doc.fillColor(LIGHT_GRAY).fontSize(7).font(F)
            .text('Travel Planner - Documento generado automaticamente', M, H - 28, { width: W - M * 2, align: 'center' });

        doc.end();

    } catch (error) {
        console.error('Error generando PDF:', error);
        res.status(500).json({ error: 'No se pudo generar el PDF' });
    }
};

export const getExploreFeed = async (req, res) => {
    try {
        const { search, style, maxBudget } = req.query;

        const trips = await prisma.trip.findMany({
            where: { 
                isPublic: true,
                NOT: { userId: req.userId },
                travelStyle: style ? style : undefined,
                budget: maxBudget ? { lte: parseFloat(maxBudget) } : undefined,
                OR: search ? [
                    { destination: { contains: search, mode: 'insensitive' } },
                    { country: { contains: search, mode: 'insensitive' } }
                ] : undefined
            },
            include: {
                user: { select: { name: true, avatar: true } },
                _count: { 
                    select: { 
                        reviews: true, 
                        savedBy: true,
                        likes: true
                    } 
                },
                reviews: {
                    select: {
                        rating: true 
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const tripsWithAverage = trips.map(trip => {
            const totalReviews = trip.reviews.length;
            const averageRating = totalReviews > 0 
                ? trip.reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews 
                : 0;

            const { reviews, ...tripData } = trip;

            return {
                ...tripData,
                averageRating: parseFloat(averageRating.toFixed(1)), 
                totalReviews,
                likes: tripData._count.likes
            };
        });

        res.json(tripsWithAverage);
    } catch (error) {
        console.error("Error en getExploreFeed:", error);
        res.status(500).json({ error: 'Error al cargar el feed de exploración' });
    }
};

export const rateTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { rating, comment } = req.body;

        const trip = await prisma.trip.findUnique({
            where: { id: tripId }
        });

        if (!trip) {
            return res.status(404).json({ error: "Viaje no encontrado" });
        }

        const review = await prisma.review.create({
            data: {
                rating: parseInt(rating),
                comment,
                userId: req.userId,
                tripId
            }
        });

        const reviewer = await prisma.user.findUnique({ 
            where: { id: req.userId },
            select: { name: true }
        });

        if (trip.userId !== req.userId) {
            await createNotification(
                trip.userId, 
                "RATE", 
                `${reviewer.name} ha puntuado tu viaje a ${trip.destination} con ${rating} estrellas.`
            );
        }

        res.status(201).json({ message: "Reseña publicada", review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al publicar reseña' });
    }
};

export const cloneTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.body;

        const original = await prisma.trip.findUnique({
            where: { id },
            include: { itineraries: true, hotels: true, places: true, tips: true }
        });

        if (!original || !original.isPublic) {
            return res.status(404).json({ error: 'Viaje no encontrado' });
        }

        const dayOffset = Math.round(
            (new Date(startDate) - new Date(original.startDate)) / (1000 * 60 * 60 * 24)
        );

        const cloned = await prisma.trip.create({
            data: {
                userId: req.userId,
                destination: original.destination,
                country: original.country,
                origin: original.origin,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                budget: original.budget,
                currency: original.currency,
                travelStyle: original.travelStyle,
                travelersCount: original.travelersCount,
                isPublic: false,
                clonedFromId: original.id,

                itineraries: {
                    create: original.itineraries.map(it => ({
                        day: it.day,
                        date: new Date(new Date(it.date).getTime() + dayOffset * 86400000),
                        title: it.title,
                        activities: it.activities,
                        notes: it.notes,
                    }))
                },
                hotels: {
                    create: original.hotels.map(h => ({
                        hotelId: h.hotelId,
                        name: h.name,
                        address: h.address,
                        checkIn: new Date(new Date(h.checkIn).getTime() + dayOffset * 86400000),
                        checkOut: new Date(new Date(h.checkOut).getTime() + dayOffset * 86400000),
                        price: h.price,
                        currency: h.currency,
                    }))
                },
                places: {
                    create: original.places.map(p => ({
                        name: p.name, type: p.type,
                        photo: p.photo, rating: p.rating,
                        review: p.review, address: p.address,
                        dish: p.dish,
                    }))
                },
                tips: {
                    create: original.tips.map(t => ({
                        category: t.category,
                        content: t.content,
                    }))
                },
            }
        });

        await prisma.trip.update({
            where: { id: original.id },
            data: { clonesCount: { increment: 1 } }
        });

        res.json({ trip: cloned });
    } catch (error) {
        console.error('Error al clonar viaje:', error);
        res.status(500).json({ error: 'Error al clonar viaje' });
    }
};

export const addComment = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: "El comentario no puede estar vacío" });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                tripId,
                userId: req.userId
            },
            include: {
                user: { select: { name: true, avatar: true } }
            }
        });

        const trip = await prisma.trip.findUnique({ where: { id: tripId } });
        if (trip.userId !== req.userId) {
            await createNotification(
                trip.userId,
                "COMMENT",
                `${comment.user.name} ha comentado en tu viaje a ${trip.destination}: "${content.substring(0, 20)}..."`
            );
        }

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: "Error al añadir el comentario" });
    }
};

export const getTripComments = async (req, res) => {
    try {
        const { tripId } = req.params;
        const comments = await prisma.comment.findMany({
            where: { tripId },
            include: {
                user: { select: { name: true, avatar: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener comentarios" });
    }
};

export const getTravelHistory = async (req, res) => {
    try {
        const now = new Date();

        const history = await prisma.trip.findMany({
            where: {
                userId: req.userId,
                endDate: {
                    lt: now
                }
            },
            orderBy: {
                endDate: 'desc'
            },
            include: {
                _count: {
                    select: { 
                        reviews: true,
                        savedBy: true
                    }
                }
            }
        });

        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el historial de viajes" });
    }
};

export const getUpcomingTrips = async (req, res) => {
    try {
        const upcoming = await prisma.trip.findMany({
            where: {
                userId: req.userId,
                endDate: { gte: new Date() }
            },
            orderBy: { startDate: 'asc' }
        });
        res.json(upcoming);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener próximos viajes" });
    }
};

export const likeTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        await prisma.tripLike.create({
            data: { userId: req.userId, tripId }
        });
        res.json({ message: 'Like añadido' });
    } catch (error) {
        if (error.code === 'P2002') return res.status(400).json({ error: 'Ya has dado like' });
        res.status(500).json({ error: 'Error al dar like' });
    }
};

export const unlikeTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        await prisma.tripLike.delete({
            where: { userId_tripId: { userId: req.userId, tripId } }
        });
        res.json({ message: 'Like eliminado' });
    } catch {
        res.status(500).json({ error: 'Error al quitar like' });
    }
};

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        cb(null, allowed.includes(file.mimetype));
    }
});

export const getTripPhotos = async (req, res) => {
    try {
        const photos = await prisma.tripPhoto.findMany({
            where: { tripId: req.params.tripId },
            orderBy: { createdAt: 'asc' }
        });
        res.json(photos);
    } catch {
        res.status(500).json({ error: 'Error al obtener fotos' });
    }
};

export const uploadTripPhoto = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No se subió ninguna foto' });
        const url = await uploadToCloudinary(req.file.buffer, `users/${req.userId}/trips`);
        const photo = await prisma.tripPhoto.create({
            data: { tripId: req.params.tripId, url }
        });
        res.status(201).json(photo);
    } catch {
        res.status(500).json({ error: 'Error al guardar foto' });
    }
};

export const deleteTripPhoto = async (req, res) => {
    try {
        const photo = await prisma.tripPhoto.findUnique({ where: { id: req.params.photoId } });
        if (!photo) return res.status(404).json({ error: 'Foto no encontrada' });
        await prisma.tripPhoto.delete({ where: { id: req.params.photoId } });
        res.json({ ok: true });
    } catch {
        res.status(500).json({ error: 'Error al eliminar foto' });
    }
};

export const getCollaborators = async (req, res) => {
    try {
        const { tripId } = req.params;
        const collaborators = await prisma.tripCollaborator.findMany({
            where: { tripId },
            include: {
                user: { select: { id: true, name: true, email: true, avatar: true } }
            }
        });
        res.json({ collaborators: collaborators.map(c => c.user) });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener colaboradores' });
    }
};

export const addCollaborator = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { userId } = req.body;

        const trip = await prisma.trip.findUnique({ where: { id: tripId } });
        if (!trip) return res.status(404).json({ error: 'Viaje no encontrado' });
        if (trip.userId !== req.userId) return res.status(403).json({ error: 'No autorizado' });

        await prisma.tripCollaborator.create({
            data: { tripId, userId }
        });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, avatar: true }
        });

        res.status(201).json({ message: 'Colaborador añadido', user });
    } catch (error) {
        if (error.code === 'P2002') return res.status(400).json({ error: 'Ya es colaborador' });
        res.status(500).json({ error: 'Error al añadir colaborador' });
    }
};

export const removeCollaborator = async (req, res) => {
    try {
        const { tripId, userId } = req.params;

        const trip = await prisma.trip.findUnique({ where: { id: tripId } });
        if (!trip) return res.status(404).json({ error: 'Viaje no encontrado' });
        if (trip.userId !== req.userId) return res.status(403).json({ error: 'No autorizado' });

        await prisma.tripCollaborator.delete({
            where: { tripId_userId: { tripId, userId } }
        });

        res.json({ message: 'Colaborador eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar colaborador' });
    }
};

export const getPublicTrip = async (req, res) => {
    try {
        const { id } = req.params;

        const trip = await prisma.trip.findUnique({
            where: { id, isPublic: true },
            include: {
                user: { select: { id: true, name: true, avatar: true } },
                itineraries: { orderBy: { day: 'asc' } },
                hotels: true,
                places: true,
                tips: true,
                expenses: true,
                photos: true,
                comments: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                _count: { select: { likes: true, clones: true } }
            }
        });

        if (!trip) {
            return res.status(404).json({ error: 'Viaje no encontrado o no es público' });
        }

        let isLiked = false;
        let isSaved = false;

        if (req.userId) {
            const like = await prisma.tripLike.findUnique({
                where: {
                    userId_tripId: {
                        userId: req.userId,
                        tripId: id
                    }
                }
            });
            isLiked = !!like;

            const save = await prisma.savedTrip.findUnique({
                where: {
                    userId_tripId: {
                        userId: req.userId,
                        tripId: id
                    }
                }
            });
            isSaved = !!save;
        }

        res.json({ ...trip, isLiked, isSaved });
    } catch (error) {
        console.error('Error en getPublicTrip:', error);
        res.status(500).json({ error: 'Error al obtener el viaje' });
    }
};

export const getPlaces = async (req, res) => {
    try {
        const places = await prisma.tripPlace.findMany({
            where: { tripId: req.params.tripId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(places);
    } catch {
        res.status(500).json({ error: 'Error al obtener lugares' });
    }
};

export const addPlace = async (req, res) => {
    try {
        const { name, type, rating, review, address, dish, activityPhotos } = req.body;
        let photo = null;
        let photos = [];

        if (req.files && req.files.length > 0) {
            photos = await Promise.all(
                req.files.map(f => uploadToCloudinary(f.buffer, `users/${req.userId}/places`))
            );
            photo = photos[0] || null;
        } else if (activityPhotos) {
            photos = Array.isArray(activityPhotos) ? activityPhotos : [activityPhotos];
            photo = photos[0] || null;
        }

        const place = await prisma.tripPlace.create({
            data: {
                tripId: req.params.tripId,
                name, type: type || 'Actividad', photo, photos,
                rating: rating ? parseInt(rating) : null,
                review: review || null,
                address: address || null,
                dish: dish || null,
            }
        });
        res.status(201).json(place);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al añadir lugar' });
    }
};

export const deletePlace = async (req, res) => {
    try {
        const place = await prisma.tripPlace.findUnique({ where: { id: req.params.placeId } });
        if (!place) return res.status(404).json({ error: 'Lugar no encontrado' });
        await prisma.tripPlace.delete({ where: { id: req.params.placeId } });
        res.json({ ok: true });
    } catch {
        res.status(500).json({ error: 'Error al eliminar lugar' });
    }
};

export const getTips = async (req, res) => {
    try {
        const tips = await prisma.tripTip.findMany({
            where: { tripId: req.params.tripId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(tips);
    } catch {
        res.status(500).json({ error: 'Error al obtener consejos' });
    }
};

export const addTip = async (req, res) => {
    try {
        const { category, content } = req.body;
        if (!content) return res.status(400).json({ error: 'El consejo no puede estar vacío' });

        const tip = await prisma.tripTip.create({
            data: {
                tripId: req.params.tripId,
                category: category || 'cultura',
                content,
            }
        });
        res.status(201).json(tip);
    } catch {
        res.status(500).json({ error: 'Error al añadir consejo' });
    }
};

export const deleteTip = async (req, res) => {
    try {
        await prisma.tripTip.delete({ where: { id: req.params.tipId } });
        res.json({ ok: true });
    } catch {
        res.status(500).json({ error: 'Error al eliminar consejo' });
    }
};

export const updateTripCover = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No se subió ninguna foto' });
        const { id } = req.params;
        const existing = await prisma.trip.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Viaje no encontrado' });
        if (existing.userId !== req.userId && !(await isCollaborator(id, req.userId))) {
            return res.status(403).json({ error: 'No autorizado' });
        }
        const url = await uploadToCloudinary(req.file.buffer, `users/${req.userId}/covers`);
        const trip = await prisma.trip.update({
            where: { id },
            data: { coverImage: url }
        });
        res.json({ coverImage: trip.coverImage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar portada' });
    }
};

export const getExpenses = async (req, res) => {
    try {
        const expenses = await prisma.tripExpense.findMany({
            where: { tripId: req.params.tripId },
            orderBy: { createdAt: 'asc' }
        });
        res.json(expenses);
    } catch {
        res.status(500).json({ error: 'Error al obtener gastos' });
    }
};

export const addExpense = async (req, res) => {
    try {
        const { category, name, amount, currency, date } = req.body;
        if (!name || !amount) return res.status(400).json({ error: 'Nombre e importe son obligatorios' });

        const trip = await prisma.trip.findUnique({ where: { id: req.params.tripId } });
        if (!trip) return res.status(404).json({ error: 'Viaje no encontrado' });
        if (trip.userId !== req.userId && !(await isCollaborator(req.params.tripId, req.userId))) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const expense = await prisma.tripExpense.create({
            data: {
                tripId: req.params.tripId,
                category: category || 'Otros',
                name,
                amount: parseFloat(amount),
                currency: currency || 'EUR',
                date: date ? new Date(date) : null,
            }
        });
        res.status(201).json(expense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al añadir gasto' });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const expense = await prisma.tripExpense.findUnique({ where: { id: req.params.expenseId } });
        if (!expense) return res.status(404).json({ error: 'Gasto no encontrado' });

        const trip = await prisma.trip.findUnique({ where: { id: expense.tripId } });
        if (!trip) return res.status(404).json({ error: 'Viaje no encontrado' });
        if (trip.userId !== req.userId && !(await isCollaborator(expense.tripId, req.userId))) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        await prisma.tripExpense.delete({ where: { id: req.params.expenseId } });
        res.json({ ok: true });
    } catch {
        res.status(500).json({ error: 'Error al eliminar gasto' });
    }
};

export const getSavedTransports = async (req, res) => {
    try {
        const transports = await prisma.tripTransport.findMany({
            where: { tripId: req.params.tripId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(transports);
    } catch {
        res.status(500).json({ error: 'Error al obtener transportes' });
    }
};

export const saveTransport = async (req, res) => {
    try {
        const { mode, origin, destination, duration, price, lineaRecomendada, tipoTransporte, operador, notas } = req.body;

        const trip = await prisma.trip.findUnique({ where: { id: req.params.tripId } });
        if (!trip) return res.status(404).json({ error: 'Viaje no encontrado' });
        if (trip.userId !== req.userId && !(await isCollaborator(req.params.tripId, req.userId))) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const transport = await prisma.tripTransport.create({
            data: {
                tripId: req.params.tripId,
                mode: mode || 'publico',
                origin,
                destination,
                duration: duration ? parseInt(duration) : null,
                price: price ? parseFloat(price) : null,
                lineaRecomendada: lineaRecomendada || null,
                tipoTransporte: tipoTransporte || null,
                operador: operador || null,
                notas: notas || null,
            }
        });
        res.status(201).json(transport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar transporte' });
    }
};

export const deleteTransport = async (req, res) => {
    try {
        const transport = await prisma.tripTransport.findUnique({ where: { id: req.params.transportId } });
        if (!transport) return res.status(404).json({ error: 'Transporte no encontrado' });
        await prisma.tripTransport.delete({ where: { id: req.params.transportId } });
        res.json({ ok: true });
    } catch {
        res.status(500).json({ error: 'Error al eliminar transporte' });
    }
};