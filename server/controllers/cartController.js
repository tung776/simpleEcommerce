const cartController = {};
import  cartModel from "../models/cartModel";
import  productModel from "../models/productModel";

cartController.addToCart = async function(req, res, next) {
    try {
        let productId = req.params.productId;
        if(req.user) {
            let cart = await cartModel.findOne({owner: req.user._id});
            let product = await productModel.findOne({_id: productId});
            
            cart.items.push({
                item: product._id,
                quantity: 1,
                price: product.price
            });
            await cart.save();
            req.flash('message', 'đã thêm '+product.name + 'vào giỏ hàng thành công');
            
            res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

cartController.getCart = async function(req, res, next) {
    try {
        if(req.user) {
            let cart = await cartModel.findOne({owner: req.user._id}).populate("items.item");
            console.log(cart.items[0].item);
            res.render("cart/cart", {cart: cart});
        }
    }
    catch(err) {
        console.log(err);
        res.redirect("back");
    }
}

export default cartController ;