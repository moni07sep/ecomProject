let express= require("express");
let router= express.Router();
let bcrypt=require("bcrypt");
let User =require("../../modeldb/user");


router.post("/forgotpassword/:token" ,async(req,res)=>
{
    let user = await User.userModel.findOne({
        "resetPasswordKey": req.params.token,
        "resetPasswordExpire":{$gt:Date.now() }
    })

    if (!user) { return res.status(403).send({ message: "invalid token or token got expires" }) };
    let oldpassword = await bcrypt.compare(req.body.userLogin.password, user.userLogin.password);
    if (oldpassword) { return res.status(404).send({ message: "old password, please try to create new password" }) };
    user.userLogin.password = req.body.userLogin.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordKey    = undefined;
    let salt = await bcrypt.genSalt(10);
    user.userLogin.password = await bcrypt.hash(user.userLogin.password, salt);
    await user.save();
    res.send({ message: "Password updated" });

})

module.exports = router;