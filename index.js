let  express = require("express");
let mongoose =require("mongoose");
let app=express();
let user= require("./routes/user.js")
let auth =require("./routes/auth/auth.js")
let config =require("config");
if(!config.get("ecomapi")){
    console.log("acsses denied");
    process.exit(1);
}

app.use(express.json());
let port = process.env.PORT || 4600;

mongoose.connect("mongodb://localhost/ecom",{ useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>console.log("connected to db"))
.catch(err=>console.log(`somthing went wrong ${err.message}`))


app.use("/api",user);
app.use("/api",auth);
app.listen(port,()=>console.log(`port is working on ${port}`))

