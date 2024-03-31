import { Request, Response } from "express";
import Product from '../models/product.model';
// const Product = require('../models/product.model.js');

export const getProducts = async (req: Request, res: Response) => {
    try {

        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

export const getProduct = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {

        const product = await Product.create(req.body.data);
        res.status(200).json(product);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Success deleting product" });

    } catch (error: any) {
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