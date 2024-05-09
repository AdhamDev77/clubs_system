const express = require('express');
const {
    getClubs,
    getOneClub,
    createClub,
    updateClub,
    deleteClub
} = require('../Controllers/clubsController');

const router = express.Router();

// Retrieve all clubs
router.get('/', getClubs);

// Retrieve a specific club by ID
router.get('/:id', getOneClub);

// Create a new club
router.post('/', createClub);

// Update a club by ID
router.patch('/:id', updateClub);

// Delete a club by ID
router.delete('/:id', deleteClub);

module.exports = router;
