const mongoose = require('mongoose');
const config = require('../config/database');

//Cart Schema
const CartSchema = mongoose.Schema({
    uId: { type:String },
    cId: { type:String },
    cName: { type:String },
    cPrice: { type:String },
    cImg: { type:String },
    cQuantity: { type:Number },
    cStatus: { type:Boolean, default:false }
});

const Cart = module.exports = mongoose.model('Cart', CartSchema);