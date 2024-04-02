import { z } from 'zod';

// this blocks characters used in scripts, urls, etc and provides good validation against malicious input
const inputSanitzationRegex = new RegExp(`(^[a-zA-Z 0-9\.\,\+\-]*$)`);

export const zLoginSchema = z.object({
    username: z.string().min(4).max(50).trim().regex(inputSanitzationRegex, { message: "Security sanitation failed. No special characters except ',.+-'" }),
    password: z.string().min(5).max(50),
});

export const zProductSchema = z.object({
    // name: z.string().min(5).max(100),
    name: z.string().min(5).max(100).trim().regex(inputSanitzationRegex, { message: "Security sanitation failed. No special characters except ',.+-'" }),
    quantity: z.number().min(0).nonnegative().safe(),
    price: z.number().min(0.1).nonnegative().safe(),
});

export const zIdParamSchema = z.object({
    id: z.string().min(5).max(1000),
});
