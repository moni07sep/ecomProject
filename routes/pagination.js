let express=require("express");
let router=express.Router()
let model=require("../modeldb/product")

router.get("/:id", async(req ,res)=>{
    let perpage=10;
    let currentpage=req.params.id||1;
    let data =await model.product.find()
    .skip((perpage*currentpage)-perpage)
    .limit(perpage);

    let pagecount=await model.product.count();
    let totalpage=Math.ceil(pagecount/perpage);
    res.send({
        perpage:perpage,
        data:data,
        pagecount:pagecount,
        totalpage:totalpage
    });
});
module.exports=router;
