let mongoose =require("mongoose");
let Joi=require('@hapi/joi');
 
let cartItemSchema=new mongoose.Schema({
    prodId:{type:String,required:true,minlength:1,maxlength:100},
    name:{type:String,required:true,minlength:3,maxlength:100},
    image:{type:String,required:true,minlength:3,maxlength:100},
    price:{type:Number,required:true,minlength:1,maxlength:10},
    quantity:{type:Number,required:true,minlength:1,maxlength:10},
    totalprice:{type:Number,required:true,minlength:1,maxlength:10},
    recorDate:{type:Date,default:Date.now},
    updateDate:{type:Date,default:Date.now}
});
let cartItemRecord=mongoose.model('cartItemRecord',cartItemSchema);

let userCartSchema=new mongoose.Schema({
    userEmail:{type:String,required:true,minlength:5,maxlength:50},
    cartItem:[cartItemSchema]
})
let userCartItem=mongoose.model('usercart',userCartSchema);

function userCartValidation(error){
    let schema=Joi.object({
        userEmail:Joi.string().required(),
        cartItem:Joi.array()
    })
    return schema.validate(error)
}

module.exports={cartItemRecord,userCartItem,userCartValidation}