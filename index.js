require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
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


//connect to mongo
mongoose.connect('mongodb+srv://dylanmcdigby:8EE16cegupgZ6raH@cluster0.hzmppoq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log("Success connecting to db");
    })
    .catch(() => {
        console.log("Failed connecting to db");
    });

module.exports = app;
