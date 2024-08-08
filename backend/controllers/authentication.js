const express = require('express');
const router = express.Router();
const db = require('../models');
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

module.exports = router;
