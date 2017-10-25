const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const cors = require('cors');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const mongoose = require('mongoose');
const config = require('./config/database');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const routes = require('./routes/index');
const userRoutes = require('./routes/user');

//Stripe setting
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require("stripe")(keySecret);

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
});
app.use(function (req,res,next) {
    console.log("app.usr local");
    res.locals.user = req.session.user;
    var err = req.flash('error');
    res.locals.error = err.length ? err: null;
    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();
});*/

// Start server
app.listen(port, () => {
    console.log('Server started on port '+port)
});