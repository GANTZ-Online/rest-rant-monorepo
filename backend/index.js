// Modules and Globals
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieSessions = require('cookie-session');
const app = express();
const defineCurrentUser = require('./middleware/defineCurrentUser');
const path = require ('path');

// Express Settings
app.use(cookieSessions({
    name: 'session',
    sameSite: 'strict',
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(defineCurrentUser);

// Controllers & Routes
app.use('/places', require('./controllers/places'));
app.use('/users', require('./controllers/users'));
app.use('/authentication', require('./controllers/authentication'));

// Listen for Connections
// serve static front end in production mode
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'client', 'build')));
}

app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`);
});
