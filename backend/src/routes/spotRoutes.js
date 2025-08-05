const express = require('express');
const router = express.Router();
const spotController = require('../controllers/spotController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to share a new fishing spot
router.post('/share', authMiddleware.authenticateUser, spotController.shareSpot);

// Route to get all fishing spots with optional filtering
router.get('/', spotController.getAllSpots);

// Route to get a specific fishing spot by ID
router.get('/:id', spotController.getSpotById);

// Route to filter fishing spots by species or technique
router.get('/filter', spotController.filterSpots);

module.exports = router;