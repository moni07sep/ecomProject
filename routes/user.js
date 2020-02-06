let express=require("express");
let Joi =require("@hapi/joi")
let router =express.Router();
let bcrypt=require("bcrypt");
let User = require("../modeldb/user.js")
let Auth = require("../middleware/auth")
let Admin =require("../middleware/admin")


//loggedin user details
router.get("/me",Auth , async(req,res)=>{
    let data=await User.userModel.findById(req.user._id);
    res.send(data);
})

router.post("/createnewuser",async(req,res)=>{
    
    let user = await User.userModel.findOne({ "userLogin.emailId": req.body.userLogin.emailId });
    if(user){return res.status(403).send({message:"already exist user"})}
    let {error}=User.userValidationError(req.body);
    if(error){return res.send(error.details[0].message)};
    let {firstName,lastName,newsLaterCheck,userLogin,termAcceptCheck,isAdmin,
    resetPasswordKey,resetPasswordExpire,recordDate,updateDate}=req.body;
    let newUser  =new User.userModel({
        firstName, 
        lastName,
        newsLaterCheck,
        userLogin,
        termAcceptCheck,
        isAdmin,
        resetPasswordKey,
        resetPasswordExpire,
        recordDate,
        updateDate
    })
    let salt= await bcrypt.genSalt(10);
    newUser.userLogin.password= await bcrypt.hash(newUser.userLogin.password,salt)
    let data = await newUser.save();
    res.send({message:"Thank you for the registration",d:data})
    

    
})

router.get("/fetchuserdata",Auth,async(req,res)=>{
    let user = await User.userModel.find();
    res.send({u:user});
})

router.delete("/removedata/:id",[Auth,Admin], async (req, res) => {
    let user  = await User.userModel.findByIdAndRemove(req.params.id);
     if (!user) { return res.status(404).send({ message: "Invalid user id" }) };
    res.send({ message: "Thank you ! come back again " });
});



module.exports = router;