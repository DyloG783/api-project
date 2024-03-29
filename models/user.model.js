const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, default: 0 },
    refresh_token: { type: String, required: false },
    roles: { type: Array, default: [1] }
},
    {
        timestamps: true
    }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;