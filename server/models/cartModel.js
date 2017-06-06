import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "Users"},
    total: {type: Number, default: 0},
    items: [{
        item: {type: mongoose.Schema.Types.ObjectId, ref: 'Products'},
        quantity: {type: Number, default: 1},
        price: {type: Number, default: 0},
    }]
});
cartSchema.methods.getTotal = function(){
    this.total = 0;
    for(let i = 0; i < this.items.length;i++){
        this.total += this.items[i].quantity;
    }
    return this.total;
}
cartSchema.methods.getTotalPrice = function(){
   let totalPrice = 0;
    for(let i = 0; i < this.items.length;i++){
        totalPrice += this.items[i].quantity * this.items[i].price;
    }
    return totalPrice;
}
export default mongoose.model('Carts', cartSchema);