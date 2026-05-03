import { Router } from 'express';
import {
  searchFlights,
  searchHotels,
  searchActivities,
  searchRestaurants,
  searchPlaces,
  searchEverything,
  searchAirports,
  getDiscoverData
} from '../controllers/searchController.js';

const router = Router();

router.post('/flights', searchFlights);
router.get('/airports', searchAirports);
router.post('/hotels', searchHotels);
router.post('/places', searchPlaces);
router.post('/activities', searchActivities);
router.post('/restaurants', searchRestaurants);
router.post('/everything', searchEverything);
router.post('/discover', getDiscoverData);

export default router;