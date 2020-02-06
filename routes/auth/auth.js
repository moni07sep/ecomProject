let express = require("express");
let router = express.Router();
let Joi = require("@hapi/joi");
let bcrypt =require("bcrypt");
let jwt =require("jsonwebtoken");
let config =require("config")
let User = require("../../modeldb/user.js");

router.post("/auth", async (req, res) => {    
    
    let user = await User.userModel.findOne({ "userLogin.emailId": req.body.userLogin.emailId });
    if (!user) { return res.status(403).send({ messsage: "Invalid email id" }) }
    let password= await bcrypt.compare(req.body.userLogin.password,user.userLogin.password)
    if (!password) { return res.status(403).send({ messsage: "Invalid password" }) };
    let { error } = ValidationError(req.body);
    if (error) { return res.send(error.details[0].message) };
    let token=user.Tokenperson();
    res.header("x-auth-token",token).send({token:token});
})
 
function ValidationError(error) {
    let schema = Joi.object({
        userLogin: {
            emailId: Joi.string().required(),
            password: Joi.string().required()
          }
    });
    return schema.validate(error);
}

module.exports = router;