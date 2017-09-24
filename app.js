const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect to database
mongoose.connect(config.database);

//On database
mongoose.connection.on('connected', () => {
    console.log('Connected to ' +config.database);
});

//On error
mongoose.connection.on('error', (err) => {
    console.log('error to ' +err);
});

const app = express();

const users = require('./routes/users');

// Port number
const port = 3000;

// Cors middleware
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

// Index route
app.get('/', (req, res) => {
    res.send('Here is Node js Backend!')
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

// Start server
app.listen(port, () => {
    console.log('Server started on port '+port)
});