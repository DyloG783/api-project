import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
    max: 1000,
    message: 'You have exceeded the 1000 requests in 24 hrs limit!',
    standardHeaders: true,
    legacyHeaders: false,
});

export default rateLimiter;