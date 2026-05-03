import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { checkAndAwardBadges, followUser, getMyFollowers, getMyFollowing, getMyFollowingList, getMyLikes, getMyProfile, getNotifications, getPublicProfile, getSavedTrips, getTripHistory, getUserStats, markNotificationsRead, searchUsers, unfollowUser, updateProfile, uploadAvatar } from '../controllers/userController.js';

const router = Router();

router.get('/:userId/profile', getPublicProfile);

router.use(authenticateToken);

router.get('/me', getMyProfile);
router.patch('/me', uploadAvatar.single('avatar'), updateProfile);
router.get('/followers', getMyFollowers);
router.get('/following/list', getMyFollowingList);
router.get('/notifications', getNotifications);
router.put('/notifications/read', markNotificationsRead);
router.post('/follow/:userIdToFollow', followUser);
router.post('/unfollow/:userIdToUnfollow', unfollowUser);
router.get('/following', getMyFollowing);
router.get('/stats', getUserStats);
router.get('/trips/history', getTripHistory);
router.get('/trips/saved', getSavedTrips);
router.get('/likes', getMyLikes);
router.post('/badges/check', checkAndAwardBadges);
router.get('/search', searchUsers);

export default router;