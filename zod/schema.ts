import { z } from 'zod';

export const zLoginSchema = z.object({
    username: z.string().min(4).max(50),
    password: z.string().min(6).max(50),
});

export const zProductSchema = z.object({
    name: z.string().min(5).max(100),
    quantity: z.number().min(0).max(1000000),
    price: z.number().min(0.1).max(1000000),
});

export const zIdParamSchema = z.object({
    id: z.string().min(5).max(1000),
});