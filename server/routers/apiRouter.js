import async from "async";
import faker from "faker";
import categoryModel from "../models/categoryModel";
import productModel from "../models/productModel"
const apiRouter = require('express').Router();
import cartModel from "../models/cartModel";
import userModel from "../models/userModel";

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
                   
                    let product = new productModel();
                    product.category = categories[i]._id;
                    product.name = faker.commerce.productName();
                    product.price = faker.commerce.price();
                    product.image = faker.image.image();
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
    console.log("go here");
    let cart = await cartModel.findOne({owner: req.user._id});
    if(cart){
        let order = req.body.order;
        if(order) {
            for(let i = 0; i < order.length; i++){
                cart.items.forEach(function(item){
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
            res.json({isSuccess: true, newCart: newCart});
        }
        else {
            next();
        }
        
    }
    else {
        next();
    }
   
});
apiRouter.post("/checkout", async function(req, res, next){
    console.log("go to checkout");
    var stripe = require("stripe")(
      "sk_test_T7vBx12MSmyWvAtXAnTtADyZ"
    );
    let cart = await cartModel.findOne({owner: req.user._id});
    stripe.charges.create({
      amount: cart.getTotal() * 22000,
      currency: "vnd",
      source: req.body.stripeToken, // obtained with Stripe.js
      description: "Test Charge for soncattuong.com"
    }, async function(err, charge) {
      // asynchronously called
      if(err) {
          console.log("Đã có lỗi " + err);
           res.json({
               message: err,
               isSuccess: false
           });
      }
      else {
          try {
              let user = await userModel.findOne({_id: req.user._id});
              let object = {
                  items: cart.items,
                  paid: cart.getTotalPriceIncludeVat(),
                  date: Date.now()
              }
              user.history.push(object);
              console.log("user.history" + user.history);
              cart.total = 0;
              cart.items = [];
              await cart.save();
              await user.save();
              req.flash('message', "Bạn đã thanh toán thành công, Cám ơn bạn đã mua hàng của chúng tôi!");
              res.redirect("/users/profile");
          }
          catch(err){
              console.log(err);
              res.json({
                  message: err,
                  isSuccess: false
              });
          }
      }
    });
})
export default apiRouter;
