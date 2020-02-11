const express=require('express');
const router=express.Router();
const Joi=require('@hapi/joi');
let model=require('../modeldb/product');


router.post("/createnewproduct",async(req,res)=>{
    
    let {error}=model.productvalidation(req.body);
    if(error){return res.send(error.details[0].message)};
    let {name,image,description,price,offerPrice,isAvailable,
        isTodayOffer,catagory,subCatagory}=req.body;
    let newProduct  =new model.product({
        name,
        image,
        description,
        price,
        offerPrice,
        isAvailable,
        isTodayOffer,
        catagory,
        subCatagory,
        isAdmin:false,
        recordDate:Date.now(),
        updateDate:Date.now()
        
    })
    
    let data = await newProduct.save();
    res.send({message:"New product Added",d:data})
       
})

router.get("/fetchallproduct", async(req,res)=>{
    let product = await model.product.find();
    res.send({u:product});
})

router.delete("/productdelete/:id",async(req,res)=>{
    let product =await model.product.findByIdAndRemove(req.params.id);
    if(!product) {return res.status(403).send({message:"invalid id"})}
    res.send({ message: "Thank you ! come back again " });
})

router.put("/productupdate/:id", async (req,res)=>{

    let product=await model.product.findById(req.params.id);
    if (!product){return res.status(404).send({ message: "Invalid user id" })}
    let{error}=model.productvalidation(req.body);
    if (error) { return res.send(error.details[0].message) };
   
    product.name=req.body.name,
    product.image=req.body.image,
    product.description=req.body.description,
    product.price=req.body.price,
    product.offerPrice=req.body.offerPrice,
    product.isAvailable=req.body.isAvailable,
    product.isTodayOffer=req.body.isTodayOffer,
    product.catagory=req.body.catagory,
    product.subCatagory=req.body.subCatagory,
    product.isAdmin=req.body.isAdmin,
    product.recordDate=req.body.recordDate,
    product.updateDate=Date.now()
    
    let data=await  product.save();
    res.send({ d: data });
    
    })
//-------------------------------------------------------------------------
router.post("/addsubcategory", async (req, res) => {
    let { error } =model.subcategoryValidation(req.body);
    if (error) { return res.send(error.details[0].message) };
    let item = new model.subcategory({
        name: req.body.name
    });
    let data = await item.save();
    res.send(data);
});

router.post('/addcategory',async(req,res)=>{
    let { error } = model.categoryValidation(req.body);
    if (error) { return res.send(error.details[0].message) };
    let subcate = await model.subcategory.findById(req.body.subcateId);
    if (!subcate) { return res.status(403).send({ message: "Invalid subcate id" }) };
    let data = new model.category({
        catname: req.body.catname,   
        subcate: {
            _id: subcate._id,
            name: subcate.name
        }
    });
    //let data= await newcategory.subcate.push({ name: 'req.body.name' }).save();
    let item = await data.save();
    res.send({ i: item });

});

router.get("/fetchallcategory", async(req,res)=>{
    let category = await model.category.find();
    res.send({u:category});
})
router.get("/findcategory/:id", async (req,res)=>{

    let user=await model.category.findById(req.params.id);
    if (!user){return res.status(404).send({ message: "Invalid user id" })}
    res.send({u:user});
})
router.delete("/categorydelete/:id",async(req,res)=>{
    let user =await model.category.findByIdAndRemove(req.params.id);
    if(!user) {return res.status(403).send({message:"invalid id"})}
    res.send({ message: "Thank you ! come back again " });
})

module.exports = router;