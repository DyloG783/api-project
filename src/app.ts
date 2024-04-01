require('dotenv').config();

import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from "morgan";
import fs from 'fs';
import path from 'path';
import appCors from './middleware/security/cors.middleware';
import rateLimiter from './middleware/security/rateLimiter.middleware';
import productRoute from './routes/product.route';
import userRoute from './routes/user.route';
import authRoute from './routes/auth.route';

const app = express();

//logging to local file
const accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' });

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined', { stream: accessLogStream }));

//security
app.use(appCors);
app.use(rateLimiter);

//routes
app.use("/api/products", productRoute);
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

export default app;
