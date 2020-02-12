const mongoose= require("mongoose");
let Joi =require("@hapi/joi")

let subcategorySchema=new mongoose.Schema({
    name:{type:String, required:true, minlength:3, maxlength:100}
})
let subcategory=mongoose.model('subcategory',subcategorySchema);

let categorySchema=new mongoose.Schema({
    catname:{type:String, required:true, minlength:3, maxlength:100},
    subcate:[subcategorySchema]
})
let category =mongoose.model('category',categorySchema);

let productSchema=new mongoose.Schema({
    name:{type:String, required:true, minlength:3, maxlength:100},
    image:{type:String, required:true, minlength:3, maxlength:100},
    description:{type:String, required:true, minlength:3, maxlength:1000},
    price:{type:Number, required:true, minlength:1},
    offerPrice:{type:Number, required:true, minlength:1},
    isAvailable:{type:Boolean ,required:true},
    isTodayOffer:{type:Boolean ,required:true},
    catagory:{type:String, required:true, minlength:3, maxlength:100},
    subCatagory:{type:String, required:true, minlength:3, maxlength:100},
    isAdmin:{type:Boolean},
    recordDate:{type:Date, default:Date.now},
    updateDate:{type:Date, default:Date.now}
})

let product= new mongoose.model("product",productSchema);

function subcategoryValidation(error){
    let schema=Joi.object({
        name:Joi.string().required()
    })
    return schema.validate(error)
}
function categoryValidation(error){
    let schema=Joi.object({
        catname:Joi.string().required(),
        subcate:Joi.required()
    })
    return schema.validate(error)
}
function productvalidation(error){
    let schema=Joi.object({
        name:Joi.string().max(100).min(3).required(),
        image:Joi.string().max(100).min(3).required(),
        description:Joi.string().max(1000).min(10).required(),
        price:Joi.number().min(1).required(),
        offerPrice:Joi.number().min(1).required(),
        isAvailable:Joi.boolean().required(),
        isTodayOffer:Joi.boolean().required(),
        catagory:Joi.string().max(100).min(3).required(),
        subCatagory:Joi.string().max(100).min(3).required(),
        isAdmin:Joi.boolean(),
        recordDate:Joi.date(),
        updateDate:Joi.date()
    })
    return schema.validate(error)
}


module.exports={productvalidation,product,subcategory,category,categoryValidation,subcategoryValidation}