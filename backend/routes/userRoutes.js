const express = require('express');
const router = express.Router();
const {
  createOrUpdateUser,
  getUserByClerkId,
  getUserStats,
  updateUserAddress,
  deleteUser
} = require('../controllers/userController');

// User profile routes
router.post('/profile', createOrUpdateUser);
router.get('/profile/:clerkId', getUserByClerkId);
router.get('/stats/:clerkId', getUserStats);
router.put('/address/:clerkId', updateUserAddress);
router.delete('/profile/:clerkId', deleteUser);

module.exports = router;
