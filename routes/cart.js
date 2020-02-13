let express= require("express");
let router=express.Router();
let Joi=require('@hapi/joi');
let model=require("../modeldb/cart");


router.get("/addToCart", async(req, res)=>{
    let {name,image,prodId,price,quantity,totalprice}=req.body;
    let addtocart  =new model.cartItemRecord({
        prodId,
        name,
        image,
        price,
        quantity,
        totalprice,
        recordDate:Date.now(),
        updateDate:Date.now()        
    })
    let data = await addtocart.save();
    res.send({message:"New product Added to cart",d:data})
})
