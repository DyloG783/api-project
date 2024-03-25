const app = require('./index.js');

const PORT = process.env.PORT || "3000";

const server = app.listen(PORT, () => {
    console.log("Running on port 3000")
});

module.exports = server;