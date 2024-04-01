import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || "3000";

// Connect to mongoose
mongoose.connect(`${process.env.MONGOOSE_CLOUD_CONNECTION}`)
    .then(() => {
        console.log("Success connecting to db");
    })
    .catch((error) => {
        console.log("Failed connecting to db: ", error);
    });

// Start server 
const server = app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

export default server;