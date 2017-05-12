const productController = {};
import  categoryModel from "../models/categoryModel";
import productmodel from "../models/productModel";

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