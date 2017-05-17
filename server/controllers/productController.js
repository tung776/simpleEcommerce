const productController = {};
import  categoryModel from "../models/categoryModel";
import productmodel from "../models/productModel";

productController.postSearch = async function(req, res, next){
    try {
    const search = req.body.search;
    const regExp = new RegExp(req.body.search, "i");
    const query = {name: regExp}; 
     let perpage = 9;
        let page = req.query.page || 1;
    const foundProduct = await productmodel.find(query)
                                        .limit(perpage )
                                        
                                        .populate("category");
    let count = await productmodel.count(query);
    res.render("products/products", { 
        products: foundProduct,
        pages: Math.floor(count/perpage)
    });
    }
    catch(err){
        console.log(err);
        next(err);
    }
};


productController.getProducts = async function (req, res, next){
    try {
        let perpage = 9;
        let page = req.query.page || 1;
        let category = await categoryModel.findOne({});
        let products = await productmodel.find({category: category._id})
                                        .limit(perpage )
                                        .skip( perpage * page)
                                        .populate("category");
        let count = await productmodel.count({category: category._id});
        res.render("products/products", {
            products: products,
            pages: Math.floor(count/perpage)
        });
    }
    catch(err) {
        console.log(err);
        next(err);
    }

};

productController.getProductByCategoryId = async (req, res, next)=> {
    try {
        let perpage = 9;
        let page = req.query.page || 1;
        let categoryId = req.params.categoryId; 
        const products = await productmodel.find({category: categoryId})
                                            .limit(perpage )
                                            .skip( perpage * page)
                                            .populate("category");
        let count = await productmodel.count({category: category._id});
        res.render("products/products", {
            products: products,
            pages: Math.floor(count/perpage)
        });
    }
    catch(err){
        console.log(err);
        next(err);
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
        next(err);
    }
};
export default productController;