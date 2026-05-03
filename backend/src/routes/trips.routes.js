import { Router } from 'express';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';
import {
  getUserTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  addActivity,
  deleteActivity,
  updateItineraryNotes,
  convertTripBudget,
  downloadTripPDF,
  getExploreFeed,
  rateTrip,
  cloneTrip,
  addComment,
  getTripComments,
  getTravelHistory,
  likeTrip,
  unlikeTrip,
  saveTrip,
  unsaveTrip,
  getTripPhotos,
  uploadTripPhoto,
  deleteTripPhoto,
  upload,
  getCollaborators,
  addCollaborator,
  removeCollaborator,
  getPublicTrip,
  getPlaces,
  addPlace,
  deletePlace,
  getTips,
  addTip,
  deleteTip,
  updateTripCover,
  addPhotoToActivity,
  getExpenses,
  addExpense,
  deleteExpense,
  getSavedTransports,
  saveTransport,
  deleteTransport,
} from '../controllers/tripController.js';

const router = Router();

router.get('/:id/public', optionalAuth, getPublicTrip);

router.use(authenticateToken);

router.get('/', getUserTrips);
router.post('/', createTrip);
router.get('/explore', getExploreFeed);
router.get('/:id', getTripById);
router.get('/history', authenticateToken, getTravelHistory);

router.patch('/itinerary/:itineraryId', upload.single('photo'), addActivity);
router.patch('/itinerary/:itineraryId/notes', updateItineraryNotes);
router.delete('/itinerary/:itineraryId/:activityId', deleteActivity);

router.get('/:id/pdf', downloadTripPDF);
router.get('/:id/convert', convertTripBudget);
router.post('/:id/clone', authenticateToken, cloneTrip);
router.post('/:tripId/rate', rateTrip);
router.post('/:tripId/comments', addComment);
router.post('/:tripId/like', likeTrip);
router.delete('/:tripId/like', unlikeTrip);
router.get('/:tripId/comments', getTripComments);
router.post('/:tripId/save', saveTrip);
router.delete('/:tripId/save', unsaveTrip);
router.get('/:tripId/photos', getTripPhotos);
router.post('/:tripId/photos', upload.single('photo'), uploadTripPhoto);
router.delete('/:tripId/photos/:photoId', deleteTripPhoto);
router.get('/:tripId/collaborators', getCollaborators);
router.post('/:tripId/collaborators', addCollaborator);
router.delete('/:tripId/collaborators/:userId', removeCollaborator);
router.get('/:tripId/transports', authenticateToken, getSavedTransports);
router.post('/:tripId/transports', authenticateToken, saveTransport);
router.delete('/:tripId/transports/:transportId', authenticateToken, deleteTransport);

router.put('/:id', updateTrip);
router.patch('/:id', updateTrip);
router.delete('/:id', deleteTrip);
router.get('/:tripId/places', getPlaces);
router.post('/:tripId/places', upload.array('photo', 5), addPlace);
router.delete('/:tripId/places/:placeId', deletePlace);
router.get('/:tripId/tips', getTips);
router.post('/:tripId/tips', addTip);
router.delete('/:tripId/tips/:tipId', deleteTip);
router.post('/:id/cover', upload.single('photo'), updateTripCover);
router.get('/:tripId/expenses', getExpenses);
router.post('/:tripId/expenses', addExpense);
router.delete('/:tripId/expenses/:expenseId', deleteExpense);



export default router;