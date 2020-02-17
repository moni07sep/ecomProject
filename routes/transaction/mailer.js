let express=require("express");
let router=express.Router();
let nodemailer=require("nodemailer");
let User =require("../../modeldb/user");
let Joi=require("@hapi/joi");
let crypto = require("crypto");

router.post("/nodemailer", async(req, res)=>{
    let user = await User.userModel.findOne({ "userLogin.emailId": req.body.userLogin.emailId })
    if(!user){return res.status(403).send({message: "Invalid Email Id"})};
    //let {error} =validationError(req.body);
    //if(error){return res.send(error.details[0].message)};
    let token=crypto.randomBytes(35).toString("hex");
    user.resetPasswordKey=token;
    user.resetPasswordExpire=Date.now() + 3600000 // 1 hour
    await user.save();

    let transpoter =nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        secure:true,    
        auth:{
            user:"",//need user name and password
            pass:""
        }
    })
    if(!transpoter){res.status(401).send({
        message:"Somthing went wrong"
    })}

    mailOptions={
        from:'"PasswordReset"<ABC@GMAIL.COM>',// add sender email id
        to: user.userLogin.emailId,
        subject:'reset password',
        text:'http://localhost:4200/resetpassword/'+token
    }
    transpoter.sendMail(mailOptions,(error,info)=>{
        if(error){
            return console.log(error);
        }
        console.log('Message sent :%s',info.messageId);
    })
    res.send({message:"Please check your email",u:user})
})

function validationError(error){
    let schema=Joi.object({
        userLogin:{
            password:Joi.string().required()
        }
    })
    return schema.validate(error);
}
module.exports=router;


