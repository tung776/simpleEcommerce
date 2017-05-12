import async from "async";
import faker from "faker";
import categoryModel from "../models/categoryModel";
import productModel from "../models/productModel"
const apiRouter = require('express').Router();

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
    
})

export default apiRouter;
