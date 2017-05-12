import mongoose, {Schema} from 'mongoose';

const schema = new Schema({
    name: {type: String, unique: true, lowercase: true},
    image: {type: String}
});

export default mongoose.model("Categories", schema);