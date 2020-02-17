let express= require("express");
const router=express.Router();
let Joi=require('@hapi/joi');
let Auth = require("../middleware/auth")
let model=require("../modeldb/cart");


router.post("/addToCart" ,async(req, res)=>{

    let cartItem= await model.cartItemRecord.findById(req.body.cartItemId);
    console.log(cartItem);
    if (!cartItem) { return res.status(403).send({ message: "Invalid cartItem id" }) };
    //let{error} =  model.userCartValidation(req.body);
    //if(error){res.status(403).send(error.details[0].message)};

    let addtocart  =new model.userCartItem({
        userEmail:req.body.userEmail,
        cartItem:{
                _id:cartItem._id,
                prodId:cartItem.prodId,
                name:cartItem.name,
                image:cartItem.image,
                price:cartItem.price,
                quantity:cartItem.quantity,
                totalprice:cartItem.totalprice,
                recorDate:cartItem.recorDate,
                updateDate:cartItem.updateDate

                }
    })
    let data = await addtocart.save();
    res.send({message:"New product Added to cart",d:data})
})

router.post("/addcartitem", async(req, res)=>{
   
    let {prodId,
        name,
        image,
        price,
        quantity,
        totalprice,
        recorDate,
        updateDate}=req.body
    let addtocartitem  =new model.cartItemRecord ({
        prodId,
        name,
        image,
        price,
        quantity,
        totalprice,
        recorDate,
        updateDate
    })
    let data = await addtocartitem.save();
    res.send({message:"New product Added to cartitem",d:data})
})

router.put("/updateToCart/:id",Auth ,async(req, res)=>{
    let cart=await model.userCartItem.findById(req.params.id);
    if (!cart){return res.status(404).send({ message: "Invalid user id" })}
    let{error}=model.userCartValidation(req.body);
    if (error) { return res.send(error.details[0].message) };

    cart.userEmail=req.body.userEmail,
    cart.cartItem=req.body.cartItem;
    // cart.cartItem.prodId=req.body.cartItem.prodId,
    // cart.cartItem.name=req.body.cartItem.name,
    // cart.cartItem.image=req.body.cartItem.image,
    // cart.cartItem.price=req.body.cartItem.price,
    // cart.cartItem.quantity=req.body.cartItem.quantity,
    // cart.cartItem.totalprice=req.body.cartItem.totalprice,
    // cart.cartItem.recorDate=req.body.cartItem.recorDate,
    // cart.cartItem.updateDate=req.body.cartItem.updateDate

    let data =await cart.save();
    res.send({ d: data });

})

router.delete("/removecartitem/:emailId", async (req, res) => {
    let cart  = await model.userCartItem.findOneAndDelete({"userEmail":req.params.emailId});
    if (!cart) { return res.status(404).send({ message: "Invalid user id" }) };
    res.send({ message: "Thank you ! come back again " });
});

router.post("/cartByUser",async(req,res)=>{
    let cartByUser=await model.userCartItem.findOne({"userEmail":req.body.userEmail})
    // let cartItemID= await model.userCartItem({"userEmail":req.body.userEmail})
    if(!cartByUser){
        return res.status(403).send('data not found')
    };
    console.log(cartByUser);
    res.send({
        data:cartByUser
    })
})

router.get("/allUserCart",async (req,res)=>{
    let cart=await model.userCartItem.find();
    if (!cart){return res.status(404).send({ message: "no data" })}
    res.send(cart);

})


module.exports=router;
