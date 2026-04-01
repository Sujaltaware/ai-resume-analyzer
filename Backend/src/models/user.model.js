const mongoose = require("mongoose");
const { _enum } = require("zod/v4/core");

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
        default: null
    },
    googleId: {
        type: String,
        default: null
    },
    githubId: {
        type: String,
        default: null
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    provider: {
        type: String,
        enum: ["local", "google", "github"],
        default: "local"
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;