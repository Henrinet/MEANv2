const express = require('express');
const router = express.Router();
const config = require('../config/database');
const Commodity = require('../models/commodity');

//Insert commodity
router.post('/insert', (req, res, next) =>{
   let newCommodity = new Commodity({
       sku: req.body.sku,
       type: req.body.type,
       name: req.body.name,
       price: req.body.price,
       img: req.body.img,
       size: req.body.size,
       length: req.body.length,
       color: req.body.color,
       material: req.body.material,
       description: req.body.description
   });

   Commodity.addCommodity(newCommodity, (err, commodity) =>{
       console.log('ok');
       if(err){
           res.json({success:false, msg:'Failed to add commodity'});
       } else {
           res.json({success:true, msg: 'Commodity added'});
       }
   });
});

//Show all products
router.get('/allproducts', (req, res) =>{
    Commodity.find((err, commodities)=>{
      if(err){res.send(err)}
      res.json(commodities);
    });
});

module.exports = router;