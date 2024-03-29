const cors = require('cors');

const corsOptions = {
    origin: "http:localhost:3000",
    methods: ["GET", "PUT", "POST"]
}

const appCors = cors(corsOptions);

module.exports = { appCors };