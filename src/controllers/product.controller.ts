import express from 'express';
import Product from '../models/product.model';

export const getProducts = async (req: express.Request, res: express.Response) => {
    try {

        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

export const getProduct = async (req: express.Request, res: express.Response) => {
    try {

        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

export const createProduct = async (req: express.Request, res: express.Response) => {
    try {

        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

export const updateProduct = async (req: express.Request, res: express.Response) => {
    try {

        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const deleteProduct = async (req: express.Request, res: express.Response) => {
    try {

        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        res.status(200).json({ message: "Success deleting product" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


// module.exports = {
//     getProducts,
//     getProduct,
//     createProduct,
//     updateProduct,
//     deleteProduct
// }