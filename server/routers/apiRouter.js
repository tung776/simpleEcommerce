import async from "async";
import faker from "faker";
import categoryModel from "../models/categoryModel";
import productModel from "../models/productModel"
const apiRouter = require('express').Router();
import cartModel from "../models/cartModel";

apiRouter.get('/autoGenProducts', function(req, res, next){
    async.waterfall([
        function(callback){
            categoryModel.find().then(
                categories=> {
                    callback(null, categories);
                }
            ).catch(err=> res.json(err));
        },
        function(categories, callback){
            console.log(categories.length);
            for(var i = 0; i < categories.length; i++){
                console.log(i);
                for(var j = 0; j < 50; j ++) {
                    console.log("go here");
                    let product = new productModel();
                    product.category = categories[i]._id;
                    console.log("faker: " + JSON.stringify(faker.commerce));
                    console.log("categories[i]._id; " + categories[i]._id);
                    product.name = faker.commerce.productName();
                    console.log("product.name" + product.name);
                    console.log("faker.ecommerce.productName()" + faker.commerce.productName())
                    product.price = faker.commerce.price();
                    product.image = faker.image.image();
                    console.log(product);
                    product.save().catch(err=> res.json(err));
                }
            }
        }
    ]);
    
    res.json({ message: "successful"});
});

apiRouter.get('/allProduct', function(req, res, next){
    productModel.find({}).then(
        products=> res.json({products: products})
        ).catch(err=>console.log(err));
    
});

apiRouter.post("/search", async function(req, res, next){
    console.log(req.body.productName);
    
    try {
        const search = req.body.productName;
        const regExp = new RegExp(search, "i");
        const query = {name: regExp}; 
        let perpage = 9;
        let page = req.query.page || 1;
        const foundProduct = await productModel.find(query)
                                            .limit(perpage )
                                            .populate("category");
        let count = await productModel.count(query);
        
        res.json({
            message: "success",
            isSuccess: true,
            products: foundProduct,
            pages: Math.floor(count/perpage)
        });
    
    }
    catch(err){
        console.log(err);
        res.json({message: "fail", isSuccess: false, err: err});
    }
});

apiRouter.post("/cartPay", async function(req, res, next) {
    let cart = await cartModel.findOne({owner: req.user._id});
    if(cart){
        let order = req.body.order;
        for(let i = 0; i < order.length; i++){
            cart.items.forEach(function(item){
                console.log("item " + item);
                console.log("order[i].id =" + order[i].id);
                if(item.item == order[i].id) {
                   if(order[i].quantity <= 0){
                       item.quantity =0;
                   }
                   else {
                        item.quantity = order[i].quantity;
                   }
                }
            });
        }
        cart.items = cart.items.filter(function(element){
            return element.quantity > 0;
        })
        let newCart = await cart.save();
        console.log("req.body.order " + JSON.stringify(req.body.order));
        console.log("cart " + newCart);
        res.json({isSuccess: true, newCart: newCart});
    }
    else {
        next();
    }
   
})
export default apiRouter;
