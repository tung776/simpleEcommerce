import mongoose, {Schema} from 'mongoose';

const productSchema = new Schema ({
    category: {type: Schema.Types.ObjectId, ref: "Categories"},
    name: {type: String, required: true},
    price: {type: Number, required: true },
    image: {type: String, default: ""}
});

export default mongoose.model("Products", productSchema);