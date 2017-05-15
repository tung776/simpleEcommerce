const productController = {};
import  categoryModel from "../models/categoryModel";
import productmodel from "../models/productModel";

// productmodel.createMapping(function(err, mapping){
//     if(err){
//         console.log("mapping has error");
//         console.log(err);
//     }
//     else{
//         console.log("mapping success");
//         //console.log(mapping);
//     }
// });

// const stream = productmodel.synchronize();
// let count = 0;
// stream.on("error", function(err){
//     console.log(err);
// });

// stream.on("data", function(data){
//     count ++;
// });

// stream.on("close", function(){
//     console.log("maps " + count + " documents");
// });

// productController.getSearch = function(req, res, next){
//     console.log("go here");
//     res.send("hello");
//     // if(req.query.q){
//     //     productmodel.search({
//     //         query_string: {query: req.query.q}
//     //     }, function(err, results){
//     //         if(err) return next(err);
            
//     //         const data = results.hits.hits.map(function(hit){
//     //             return hit;
//     //         });
//     //         res.render('products/search', {
//     //             query: req.query.q,
//     //             data: data
//     //         });
//     //     });
//     // }
// };

productController.postSearch = async function(req, res, next){
    const search = req.body.search;
    const regExp = new RegExp(req.body.search, "i");
    const query = {name: regExp}; 
    const foundProduct = await productmodel.find(query).populate("category");
    res.render("products/products", { products: foundProduct });
};

productController.getProducts = async function (req, res, next){
    try {
        let category = await categoryModel.findOne({});
        let products = await productmodel.find({category: category._id});
        res.render("products/products", {products: products});
    }
    catch(err) {
        console.log(err);
    }

};

productController.getProductByCategoryId = async (req, res, next)=> {
    try {
        let categoryId = req.params.categoryId; 
        const products = await productmodel.find({category: categoryId});
        res.render("products/products", {products: products});
    }
    catch(err){
        console.log(err);
    }
  
};

productController.getDetailProduct = async (req, res, next)=> {
    let productId = req.params.productId;
    try {
        const product = await productmodel.findOne({_id: productId})
                                            .populate("category");
        res.render('products/productDetail', {product: product});
    }
    catch(err){
        console.log(err);
    }
};
export default productController;