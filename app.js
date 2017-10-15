const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const cors = require('cors');
const passport = require('passport');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const config = require('./config/database');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const Commodity = require('./models/commodity');

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

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

//const routes = require('./routes/index');
const users = require('./routes/users');
const commodities = require('./routes/commodities');
const carts = require('./routes/carts');

// Port number
const port = 3000;

// Cors middleware
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());

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

require('./config/passport')(passport);

//app.use((req, res, next) =>{
//    res.locals.session = req.session;
//});

app.use('/users', users);
app.use('/commodities', commodities);
app.use('/carts', carts);

// Index route
//app.use('/', routes);
app.use('/', (req, res) => {
    var successMsg = req.flash('success')[0];
    Commodity.find(function (err, docs) {
        var commodityChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            commodityChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', {title: 'Shopping Cart', commodities: commodityChunks, successMsg: successMsg, noMessages: !successMsg});
    });
});

// all other requests redirect to 404
/*app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});*/

// Start server
app.listen(port, () => {
    console.log('Server started on port '+port)
});