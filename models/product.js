var mongoose = require('mongoose');
const config = require('../config/database');

const ProductSchema = mongoose.Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
});

const Product = module.exports = mongoose.model('Product', ProductSchema);