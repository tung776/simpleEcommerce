import mongoose, {Schema} from 'mongoose';
// import mongoosastic from "mongoosastic";
const productSchema = new Schema ({
    category: {type: Schema.Types.ObjectId, ref: "Categories"},
    name: {type: String, required: true},
    price: {type: Number, required: true },
    image: {type: String, default: ""}
});

// productSchema.plugin(mongoosastic, {
//     hosts: [
//         "localhost:9200"
//     ]
// })

export default mongoose.model("Products", productSchema);