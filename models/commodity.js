const mongoose = require('mongoose');
const config = require('../config/database');

//Commodity Schema
const CommoditySchema = mongoose.Schema({
    sku: { type:String, required: true },
    type: { type:String },
    name: { type:String, required: true },
    price: { type:Number },
    img: { type:String },
    attributes: {
        size: { type: String },
        length: { type: String },
        color: { type: String },
        material: { type: String },
        description: { type: String, required: true }
    }
});

const Commodity = module.exports = mongoose.model('Commodity', CommoditySchema);

