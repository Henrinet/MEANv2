const express = require('express');
const router = express.Router();
const passport =require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        console.log('ok');
        if(err){
            res.json({success: false, msg:'Failed to register user'});
        } else {
            res.json({success: true, msg:'User register'});
        }
    });
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
    res.send('Authenticated');
});

//Profile
router.get('/profile', (req, res, next) => {
    res.send('Profile');
});

module.exports = router;