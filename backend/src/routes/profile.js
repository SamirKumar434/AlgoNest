const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const {
  getUserProfile,
  getUserSolvedProblems,
  getUserActivity,
  updateUserProfile
} = require('../controllers/profileController');

// All routes require authentication
router.get('/profile', userMiddleware, getUserProfile);
router.get('/solved-problems', userMiddleware, getUserSolvedProblems);
router.get('/activity', userMiddleware, getUserActivity);
router.put('/update', userMiddleware, updateUserProfile);

module.exports = router;