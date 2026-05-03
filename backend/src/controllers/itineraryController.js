import prisma from '../config/db.js';

// --- VUELOS ---

export const addFlight = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { airline, origin, destination, originCity, destCity, departure, arrival, duration, stops, price, currency, bookingLink } = req.body;

        const trip = await prisma.trip.findUnique({ where: { id: tripId } });
        if (!trip) return res.status(404).json({ error: 'Viaje no encontrado' });
        if (trip.userId !== req.userId) return res.status(403).json({ error: 'No autorizado' });

        const flight = await prisma.tripFlight.create({
            data: { tripId, airline, origin, destination, originCity, destCity, departure: new Date(departure), arrival: new Date(arrival), duration, stops: stops || 0, price, currency: currency || 'EUR', bookingLink }
        });

        res.status(201).json({ flight });
    } catch (error) {
        console.error('Error añadiendo vuelo:', error);
        res.status(500).json({ error: 'Error al añadir vuelo' });
    }
};

export const getFlights = async (req, res) => {
    try {
        const { tripId } = req.params;
        const flights = await prisma.tripFlight.findMany({
            where: { tripId },
            orderBy: { departure: 'asc' }
        });
        res.json({ flights });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener vuelos' });
    }
};

export const updateFlight = async (req, res) => {
    try {
        const { flightId } = req.params;
        const flight = await prisma.tripFlight.update({
            where: { id: flightId },
            data: req.body
        });
        res.json({ flight });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar vuelo' });
    }
};

export const deleteFlight = async (req, res) => {
    try {
        const { flightId } = req.params;
        await prisma.tripFlight.delete({ where: { id: flightId } });
        res.json({ message: 'Vuelo eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar vuelo' });
    }
};

// --- HOTELES ---

export const addHotel = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { hotelId, name, address, checkIn, checkOut, price, currency, bookingLink, photo, rating, reviewScore } = req.body;

        const trip = await prisma.trip.findUnique({ where: { id: tripId } });
        if (!trip) return res.status(404).json({ error: 'Viaje no encontrado' });
        if (trip.userId !== req.userId) return res.status(403).json({ error: 'No autorizado' });

        const hotel = await prisma.tripHotel.create({
            data: {
                tripId, hotelId, name, address,
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                price: price || null,
                currency: currency || 'EUR',
                bookingLink,
                photo: photo || null,
                rating: rating || null,
                reviewScore: reviewScore || null
            }
        });

        res.status(201).json({ hotel });
    } catch (error) {
        console.error('Error añadiendo hotel:', error);
        res.status(500).json({ error: 'Error al añadir hotel' });
    }
};

export const getHotels = async (req, res) => {
    try {
        const { tripId } = req.params;
        const hotels = await prisma.tripHotel.findMany({
            where: { tripId },
            orderBy: { checkIn: 'asc' }
        });
        res.json({ hotels });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener hoteles' });
    }
};

export const updateHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const hotel = await prisma.tripHotel.update({
            where: { id: hotelId },
            data: req.body
        });
        res.json({ hotel });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar hotel' });
    }
};

export const deleteHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;
        await prisma.tripHotel.delete({ where: { id: hotelId } });
        res.json({ message: 'Hotel eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar hotel' });
    }
};
