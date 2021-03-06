let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");
let config = require("config");
let Joi = require("@hapi/joi");
let userSchema = new mongoose.Schema({
    firstName: { type: String, min: 4, max: 100, trim: true, required: true },
    lastName: { type: String, min: 4, max: 100, trim: true, required: true },
    newsLaterCheck:{type:Boolean},
    userLogin: {
        emailId: { type: String, required: true, unique: true },
        password: { type: String, required: true, min: 4, max: 150 }
    },
    termAcceptCheck:{type:Boolean },
    resetPasswordKey:{type: String},
    resetPasswordExpire:{type:String},
    isAdmin:{type:Boolean},
    recordDate:{type:Date , default:Date.now()},
    updateDate:{type:Date, default:Date.now()}
});

userSchema.methods.Tokenperson=function(){
    let token= jwt.sign({_id : this._id,isAdmin :this.isAdmin} , config.get("ecomapi"));
    return token;
}

function userValidationError(error){
    let schema=Joi.object({
    firstName: Joi.string().min(4).max(100).required(),
    lastName: Joi.string().min(4).max(100).required(),
    newsLaterCheck:Joi.boolean(),
    userLogin: {
        emailId:Joi.string().required().email() ,
        password: Joi.any().required()
    },
    termAcceptCheck:Joi.boolean(),
    resetPasswordKey:Joi.string(),
    resetPasswordExpire:Joi.string(),
    isAdmin:Joi.boolean(),
    recordDate:Joi.date(),
    updateDate:Joi.date()

    })
    return schema.validate(error);
}

let userModel=mongoose.model("users", userSchema);
module.exports={userModel,userValidationError};