const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
//var Product = require('../models/product');
const Order = require('../models/order');
const Commodity = require('../models/commodity');

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


module.exports = router;

