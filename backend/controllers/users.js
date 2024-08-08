const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');

const { User } = db;

// Create a new user with hashed password
router.post('/', async (req, res) => {
    try {
        let { password, ...rest } = req.body;
        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            ...rest,
            passwordDigest: hashedPassword
        });
        res.status(201).json(user);  // Status code 201 for successful resource creation
    } catch (error) {
        res.status(400).json({ error: error.message });  // Return error message if something goes wrong
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });  // Return error message for internal server errors
    }
});

module.exports = router;
