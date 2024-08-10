const express = require('express');
const router = express.Router();
const db = require("../models");
const bcrypt = require('bcrypt');

const { User } = db;

// Handle user login or authentication
router.post('/', async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({
            where: { email: req.body.email }
        });

        // Check if user exists and if the password is correct
        if (!user || !await bcrypt.compare(req.body.password, user.passwordDigest)) {
            return res.status(404).json({ 
                message: 'Could not find a user with the provided email and password' 
            });
        }

        // Respond with user data if authentication is successful
        res.json({ user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Handle profile retrieval
router.get('/profile', async (req, res) => {
    console.log('made it to the profile page');
    try {
        // Extract userId from request (assuming it's passed as a query parameter or a header)
        const userId = req.query.userId || req.headers['user-id'];

        // Find user by userId
        const user = await User.findOne({
            where: { userId }
        });

        // Respond with user data if found, otherwise respond with a 404
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
