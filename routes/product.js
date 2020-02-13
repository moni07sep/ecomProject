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

router.get("/productsearch/:id", async(req,res)=>{
    let product=await model.product.findById(req.params.id);
    if (!product){return res.status(404).send({ message: "Invalid user id" })}
    res.send({product:product});
})

//-------------------------------------------------------------------------

router.get("/category/:category/page/:pageIdx", async(req,res)=>{
    let perpage=3;
    let page=(req.params.pageIdx) ||1;
    if(page<0|| page===0){
        return res.status(403).send('invalid page number,shouldstart with 1')
    }
    let filterproduct= await model.product.find({catagory:req.params.category});
    let productcount= filterproduct.length;
    let product = await model.product.find({catagory:req.params.category}).skip((perpage*page)-perpage).limit(perpage);
    if(!product){
        return res.status(403).send("data not found")
    }
    res.send({
        message:'success',
        data:product,
        page:page,
        productcount:productcount
    })
})

router.get("/category/:category/subCategory/:subCategory/page/:pageIdx", async(req,res)=>{
    let perpage=3;
    let page=(req.params.pageIdx) ||1;
    if(page<0|| page===0){
        return res.status(403).send('invalid page number,shouldstart with 1')
    }
    let filterproduct= await model.product.find({catagory:req.params.category,subCatagory:req.params.subCategory});
    let productcount= filterproduct.length;
    let product = await model.product.find({catagory:req.params.category,subCatagory:req.params.subCategory}).skip((perpage*page)-perpage).limit(perpage);
    if(!product){
        return res.status(403).send("data not found")
    }
    res.send({
        message:'success',
        data:product,
        page:page,
        productcount:productcount
    })
})

router.get("/latestproduct",async(req,res)=>{
let product= await model.product.find().limit(5);
if(!product){
    return res.status(403).send("data not found")
}
res.send({message:'success',data:product})
})

router.get("/offerproduct",async(req,res)=>{
    let product= await model.product.find({isTodayOffer:true})
    if(!product){
        return res.status(403).send("data not found")
    }
    res.send({message:'success',data:product})
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
    // let subcate = await model.subcategory.findById(req.body.subcate);
    // if (!subcate) { return res.status(403).send({ message: "Invalid subcate id" }) };
    // let data = new model.category({
    //     catname: req.body.catname,   
    //     subcate: {
    //         _id: subcate._id,
    //         name: subcate.name
    //     }
    // });
    let data = new model.category(req.body);
    //---------POSTMANCHECK--------
    //     {
    //         "catname":"liquid",
    //         "subcate" : [{
    //                "name": "category1"
    //         },
    //         {
    //                "name": "category2"
    //         }]}
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