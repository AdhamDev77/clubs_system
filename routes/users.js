const express = require('express');
const { 
    createUser, 
    logUser, 
    getUsers, 
    getOneUser, 
    deleteUser, 
    updateUser, 
    changePassword 
} = require('../Controllers/usersController');

const router = express.Router();

// Retrieve all users
router.get('/', getUsers);

// Retrieve a single user by ID
router.get('/:id', getOneUser);

// Create a new user
router.post('/signup', createUser);

// User login
router.post('/login', logUser);

// Change a user's password
router.post('/change_password/:id', changePassword);

// Delete a user by ID
router.delete('/:id', deleteUser);

// Update a user by ID
router.patch('/:id', updateUser);

module.exports = router;
