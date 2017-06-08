import cartModel from "../models/cartModel";

export default async function(req, res, next){
    
    try {
        if(req.user) {
        
            let total = 0;
            let cart = await cartModel.findOne({owner: req.user._id});
            if(cart){
                
                for(let i = 0; i < cart.items.length; i ++) {
                    total += cart.items[i].quantity;
                }
                res.locals.cartQuantity = total;
            }
            else {
                cart = new cartModel({
                    total: 0,
                    owner: req.user._id
                });
                await cart.save();
                res.locals.cartQuantity = 0;
                console.log("no cart" );
            }
            next();
        }
        else {
            res.locals.cartQuantity = null;
            next();
        }
    }
    catch(err){
        console.log(err);
        next(err);
    }
};