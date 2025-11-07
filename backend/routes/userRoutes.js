const express = require('express');
const router = express.Router();
const {
  createOrUpdateUser,
  getUserByClerkId,
  getUserStats,
  updateUserAddress,
  deleteUser,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} = require('../controllers/userController');

// User profile routes
router.post('/profile', createOrUpdateUser);
router.get('/profile/:clerkId', getUserByClerkId);
router.get('/stats/:clerkId', getUserStats);
router.put('/address/:clerkId', updateUserAddress);
router.delete('/profile/:clerkId', deleteUser);

// Notification routes
router.get('/notifications/:clerkId', getUserNotifications);
router.put('/notifications/:clerkId/:notificationId/read', markNotificationAsRead);
router.put('/notifications/:clerkId/read-all', markAllNotificationsAsRead);

module.exports = router;
