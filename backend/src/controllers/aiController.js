import redisClient from '../config/redis.js';
import { getDestinationInfo, getPublicTransportOptions, getTransportComparison } from '../services/aiService.js';

export const getRoute = async (req, res) => {
    try {
        const { fromLon, fromLat, toLon, toLat } = req.query;
        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener ruta' });
    }
};

export const getDestinationGuide = async (req, res) => {
    try {
        const { destination } = req.params;
        const { country, tripId } = req.query;
        if (!destination) return res.status(400).json({ error: 'Destino requerido' });

        const cleanDest = destination.split(',')[0].trim().toLowerCase();
        const cacheKey = `destination:${cleanDest}`;

        const cached = await redisClient.get(cacheKey);
        if (cached) {
            console.log(`📦 Guía de ${destination} desde caché`);
            const data = JSON.parse(cached);

            if (tripId) {
                const exists = await prisma.tripDestinationInfo.findUnique({ where: { tripId } });
                if (!exists) {
                    await prisma.tripDestinationInfo.create({ data: { tripId, data } }).catch(() => {});
                }
            }

            return res.json(data);
        }

        console.log(`🌍 Generando guía de ${destination}...`);
        const info = await getDestinationInfo(destination, country);

        await redisClient.setEx(cacheKey, 60 * 60 * 24 * 7, JSON.stringify(info));

        if (tripId && info) {
            await prisma.tripDestinationInfo.upsert({
                where: { tripId },
                update: { data: info },
                create: { tripId, data: info }
            }).catch(() => {});
        }

        res.json(info);
    } catch (error) {
        console.error('❌ Error en getDestinationGuide:', error.message);
        res.status(500).json({ error: 'Error al obtener información del destino' });
    }
};

export const getTransportOptions = async (req, res) => {
    try {
        const { origin, destination } = req.query;
        if (!origin || !destination) return res.status(400).json({ error: 'Origen y destino requeridos' });

        const cacheKey = `transport:${origin.toLowerCase()}:${destination.toLowerCase()}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            console.log(`📦 Transporte ${origin}→${destination} desde caché`);
            return res.json(JSON.parse(cached));
        }

        console.log(`🚆 Generando opciones de transporte ${origin}→${destination}...`);
        const data = await getPublicTransportOptions(origin, destination);
        if (!data) return res.status(500).json({ error: 'No se pudo generar la comparativa' });

        await redisClient.setEx(cacheKey, 60 * 60 * 24, JSON.stringify(data));
        res.json(data);
    } catch (error) {
        console.error('❌ Error en getTransportOptions:', error.message);
        res.status(500).json({ error: 'Error al obtener opciones de transporte' });
    }
};

export const getFullTransportComparison = async (req, res) => {
    try {
        const { origin, destination } = req.query;
        if (!origin || !destination) return res.status(400).json({ error: 'Origen y destino requeridos' });

        const cacheKey = `transport:full:${origin.toLowerCase()}:${destination.toLowerCase()}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            console.log(`📦 Transporte ${origin}→${destination} desde caché`);
            return res.json(JSON.parse(cached));
        }

        console.log(`🚆 Generando comparativa de transporte ${origin}→${destination}...`);
        const data = await getTransportComparison(origin, destination);
        if (!data) return res.status(500).json({ error: 'No se pudo generar la comparativa' });

        await redisClient.setEx(cacheKey, 60 * 60 * 24, JSON.stringify(data));
        res.json(data);
    } catch (error) {
        console.error('❌ Error en getFullTransportComparison:', error.message);
        res.status(500).json({ error: 'Error al obtener comparativa de transporte' });
    }
};