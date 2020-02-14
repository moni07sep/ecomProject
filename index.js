let  express = require("express");
let mongoose =require("mongoose");
let cors = require("cors")
let app=express();

let user= require("./routes/user.js")
let product=require("./routes/product")
let cart =require("./routes/cart")
let auth =require("./routes/auth/auth.js")
let config =require("config");
let mailer=require("./routes/transaction/mailer");
let forgotpassword = require("./routes/transaction/forgotPassword");
let pagination=require("./routes/pagination")
if(!config.get("ecomapi")){
    console.log("acsses denied");
    process.exit(1);
}
app.use(cors());
app.use(express.json());
let port = process.env.PORT || 4600;

mongoose.connect("mongodb://localhost/ecom",{ useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>console.log("connected to db"))
.catch(err=>console.log(`somthing went wrong ${err.message}`))

app.use("/api",cart);
app.use("/api",user);
app.use("/api",auth);
app.use("/api/mail",mailer);
app.use("/api", forgotpassword);
app.use("/api/pagination", pagination);

app.use("/api",product);

app.listen(port,()=>console.log(`port is working on ${port}`))

