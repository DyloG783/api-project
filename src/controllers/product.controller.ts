import { Request, Response } from "express";
import Product from '../models/product.model';
import { zProductSchema, zIdParamSchema } from '../zod/schema';

/**
 * Product controller handles standard CRUD operations against the db
 */

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
        const params = zIdParamSchema.safeParse(req.params.id);
        if (!params.success) return res.status(400).json({ "message": "Invalid product id" });


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

    // create product in db
    try {
        const product = await Product.create(req.body.data);
        res.status(200).json(product);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const updateProduct = async (req: Request, res: Response) => {

    // Validate request body
    const input = zProductSchema.safeParse(req.body);
    if (!input.success) return res.status(400).json({ "message": "Invalid product data" });

    // Validate request params
    const params = zIdParamSchema.safeParse(req.params.id);
    if (!params.success) {
        return res.status(400).json({ "message": "Invalid product id" });
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body);
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Updated product" });
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {

        // Validate request params
        const params = zIdParamSchema.safeParse(req.params.id);
        if (!params.success) return res.status(400).json({ "message": "Invalid product id" });

        // Delete product from db
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