const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, "Username already taken"]
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email already exists"]
    },
    password: {
        type: String,
        required: true
    },
    // role: {
    //     type: String,
    //     enum: ["user", "admin"],
    //     default: "user"
    // }
})

const User = mongoose.model("User", userSchema);

module.exports = User;