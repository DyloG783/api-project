const mongoose = require('mongoose');
const { app } = require('./app.js');

const PORT = process.env.PORT || "3000";

//connect to mongoose
mongoose.connect(`${process.env.MONGOOSE}`)
    .then(() => {
        console.log("Success connecting to db");
    })
    .catch((error) => {
        console.log("Failed connecting to db: ", error);
    });

// start server 
const server = app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

module.exports = server;