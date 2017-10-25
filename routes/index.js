const express = require('express');
const router = express.Router();

//csrf import
const csrf = require('csurf');
const csrfProtection = csrf();
router.use(csrfProtection);

//Model import
const Cart = require('../models/cart');
const Commodity = require('../models/commodity');
const Order = require('../models/order');

//Stripe setting
const keyPublishable = 'pk_test_TJkK7bgCjxIwqEnYA6xXxYEV';
const keySecret = 'sk_test_zCGgVYnMCEo5xGxxmvjXAGqA';
const stripe = require("stripe")(keySecret);

/* GET home page. */
router.get('/', function (req, res, next) {
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

router.get('/add-to-cart/:id', function(req, res, next) {
    let commodityId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    Commodity.findById(commodityId, function(err, commodity) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(commodity, commodity.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

router.get('/reduce/:id', function(req, res, next) {
    var commodityId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(commodityId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
   if (!req.session.cart) {
       return res.render('shop/shopping-cart', {commodities: null});
   } 
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {commodities: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var stripeTotal = cart.totalPrice *100;
    var errMsg = req.flash('error')[0];
    var fillName = req.body.name;
    res.render('shop/checkout', {csrfToken: req.csrfToken(), total: cart.totalPrice, stripeTotal: stripeTotal, errMsg: errMsg, noError: !errMsg, keyPublishable: keyPublishable, fillName: fillName});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {

    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    if (!req.body.name) {
        req.flash('error', 'Please fill your name first!');
        return res.redirect('/checkout');
    }
    if (!req.body.address) {
        req.flash('error', 'Please fill your address first!');
        return res.redirect('/checkout');
    }
    var cart = new Cart(req.session.cart);

    //Create a Customer:
        stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        }).then(function(customer) {
            // YOUR CODE: Save the customer ID and other info in a database for later.
            var order = new Order({
                user: req.user,
                cart: cart,
                address: req.body.address,
                name: req.body.name,
                paymentId: customer.id
            });
            order.save((err) =>{
                if (err) {
                    console.log(err.message);
                    return res.redirect('/checkout');
                }
            });
            return stripe.charges.create({
                amount: 1000,
                currency: "hkd",
                customer: customer.id,
            });
        }).then(function(charge) {
            // Use and save the charge info.
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            return res.redirect('/');
            });

});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
