require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require("morgan");
const fs = require('fs');
const path = require('path');
const { appCors } = require('./middleware/security/cors.middleware.js');
const { rateLimiter } = require('./middleware/security/rateLimiter.middleware.js');

const productRoute = require('./routes/product.route.js');
const userRoute = require('./routes/user.route.js');
const authRoute = require('./routes/auth.route.js');

const app = express();

//logging to local file
const accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/access.log'), { flags: 'a' })

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

module.exports = { app };
