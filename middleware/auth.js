let jwt =require("jsonwebtoken");
let config =require("config");

function Auth(req, res,next){
    let token =req.header("x-auth-token");
    if(!token){
        return res.status(402).send("Acsses denied! indvalid token")
    }
        try{
            let decoded=jwt.verify(token,config.get("ecomapi"));
            req.user=decoded;
            next();

        }catch(ex){
            return res.status(402).send({message:"Internal server error"})

        }
    
}
module.exports=Auth;