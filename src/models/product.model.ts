import mongoose from 'mongoose';

/**
 * Mongoose schema and model used in controller functions to interact with the database
 */

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please enter product name"], unique: true, index: true },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
},
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;