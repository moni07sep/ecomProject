let mongoose =require('mongoose');
let jwt = require('jsonwebtoken');
let config=require('config');

let contactSchema=new mongoose.Schema({
    name:{type:String, required:true, minlength:3, maxlength:50},
    email:{type:String, required:true, minlength:3, maxlength:50},
    message:{type:String, required:true, minlength:20, maxlength:150}
})

let contacts=mongoose.model('contacts',contactSchema)

module.exports={contacts}