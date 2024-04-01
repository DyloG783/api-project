import { Request, Response } from "express";
import Product from '../models/product.model';
import { zProductSchema, zIdParamSchema } from '../../zod/schema';

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

        // Authenticate user input
        const input = zIdParamSchema.safeParse(req.params);
        if (!input.success) return res.status(400).json({ "message": "Invalid product id" });

        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}

export const createProduct = async (req: Request, res: Response) => {

    // Authenticate user input
    const input = zProductSchema.safeParse(req.body.data);
    if (!input.success) {
        res.status(400).json({ "message": "Invalid product data" });
        return;
    }

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

        // Authenticate user input
        const input = zProductSchema.safeParse(req.body);
        if (!input.success) return res.status(400).json({ "message": "Invalid product data" });

        // Authenticate user input
        const params = zIdParamSchema.safeParse(req.params);
        if (!params.success) {
            return res.status(400).json({ "message": "Invalid product id" });
        }
        const product = await Product.findByIdAndUpdate(req.params.id, req.body);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updatedProduct = await Product.findById(req.params.id);
        res.status(200).json(updatedProduct);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {

        // Authenticate user input
        const input = zIdParamSchema.safeParse(req.params);
        if (!input.success) return res.status(400).json({ "message": "Invalid product id" });

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Success deleting product" });

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};