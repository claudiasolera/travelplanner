import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { addFlight, getFlights, deleteFlight, addHotel, getHotels, deleteHotel, updateFlight, updateHotel } from '../controllers/itineraryController.js';

const router = express.Router();

router.get('/:tripId/flights', authenticateToken, getFlights);
router.post('/:tripId/flights', authenticateToken, addFlight);
router.patch('/flights/:flightId', authenticateToken, updateFlight);
router.delete('/flights/:flightId', authenticateToken, deleteFlight);

router.get('/:tripId/hotels', authenticateToken, getHotels);
router.post('/:tripId/hotels', authenticateToken, addHotel);
router.patch('/hotels/:hotelId', authenticateToken, updateHotel);
router.delete('/hotels/:hotelId', authenticateToken, deleteHotel);

export default router;