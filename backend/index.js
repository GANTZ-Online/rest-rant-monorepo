// Modules and Globals
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Express Settings
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Controllers & Routes
app.use('/places', require('./controllers/places'));
app.use('/users', require('./controllers/users'));
app.use('/authentication', require('./controllers/authentication'));  // Fixed missing closing parenthesis

// Listen for Connections
const PORT = process.env.PORT || 3000;  // Fallback to port 3000 if environment variable is not set
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
