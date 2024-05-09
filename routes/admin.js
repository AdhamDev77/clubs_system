const express = require('express');
const { createAdmin, logAdmin, getAdmins, getOneAdmin, changePassword } = require('../Controllers/adminsController');

const router = express.Router();

// Retrieve all users
router.get('/', getAdmins);

// Retrieve a single user by ID
router.get('/:id', getOneAdmin);

// Create a new user
router.post('/signup', createAdmin);

// User login
router.post('/login', logAdmin);

// Change a user's password
router.post('/change_password/:id', changePassword);


module.exports = router;
