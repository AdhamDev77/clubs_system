const express = require('express');
const {
    getEvents,
    getOneEvent,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../Controllers/eventController');

const router = express.Router();

// Retrieve all events
router.get('/', getEvents);

// Retrieve a specific event by ID
router.get('/:id', getOneEvent);

// Create a new event
router.post('/', createEvent);

// Update an event by ID
router.patch('/:id', updateEvent);

// Delete an event by ID
router.delete('/:id', deleteEvent);

module.exports = router;
