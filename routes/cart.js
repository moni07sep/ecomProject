let express= require("express");
const router=express.Router();
let Joi=require('@hapi/joi');
let model=require("../modeldb/cart");


router.post("/addToCart", async(req, res)=>{
    let{error} =  model.userCartValidation(req.body);
    if(error){res.status(403).send(error.details[0].message)};

    let addtocart  =new model.userCartItem({
        userEmail:req.body.userEmail,
        cartItem:req.body.cartItem
    })
    let data = await addtocart.save();
    res.send({message:"New product Added to cart",d:data})
})

router.put("/updateToCart/:id",async(req, res)=>{
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
    let cartByUser=await model.userCartItem({"userEmail":req.body.userEmail})
    if(!cartByUser){
        return res.status(403).send('data not found')
    }
    res.send({
        data:cartByUser
    })
})

router.get("/allUserCart", async (req,res)=>{
    let cart=await model.userCartItem.find();
    if (!cart){return res.status(404).send({ message: "no data" })}
    res.send(cart);

})


module.exports=router;
