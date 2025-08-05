const express = require('express');
const { approveSpot, rejectSpot, getPendingSpots } = require('../controllers/adminController');
const { authorizeAdmin, authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get all pending fishing spots
router.get('/pending', authenticateUser, authorizeAdmin, getPendingSpots);

// Route to approve a fishing spot
router.post('/approve/:id', authenticateUser, authorizeAdmin, approveSpot);

// Route to reject a fishing spot
router.post('/reject/:id', authenticateUser, authorizeAdmin, rejectSpot);

module.exports = router;