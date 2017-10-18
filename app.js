const express = require('express');
const path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const cors = require('cors');
const passport = require('passport');
const flash = require('connect-flash');
var validator = require('express-validator');
const mongoose = require('mongoose');
const config = require('./config/database');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var userRoutes = require('./routes/user');

// Connect to database
mongoose.connect(config.database);

//Config Passport
require('./config/passport');

//On database
mongoose.connection.on('connected', () => {
    console.log('Connected to ' +config.database);
});

//On error
mongoose.connection.on('error', (err) => {
    console.log('error to ' +err);
});

const app = express();

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

//const routes = require('./routes/index');
//const users = require('./routes/users');
//const commodities = require('./routes/commodities');
//const carts = require('./routes/carts');

// Port number
const port = 3000;

// Cors middleware
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'abc',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 2*24*60*60 }),
    unset: 'destroy',
    name: 'session cookie name',
    cookie: { maxAge: 1800*60*1000 }
}));

app.use(flash());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

//app.use('/users', users);
//app.use('/commodities', commodities);
//app.use('/carts', carts);
app.use('/user', userRoutes);

// Index route
app.use('/', routes);

// all other requests redirect to 404
/*app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});*/

// Start server
app.listen(port, () => {
    console.log('Server started on port '+port)
});