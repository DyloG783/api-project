const express = require('express')
const mongoose = require('mongoose')
const productRoute = require('./routes/product.route.js')

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api/products", productRoute);


// connect to mongo and start server
mongoose.connect('mongodb+srv://dylanmcdigby:8EE16cegupgZ6raH@cluster0.hzmppoq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {

        console.log("Success connecting to db");
        app.listen(3000, () => {
            console.log("Running on port 3000")
        });
    })
    .catch(() => {
        console.log("Failed connecting to db");
    });

