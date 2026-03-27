const userModel = require("../models/user.model");
const tokenBlackListModel = require("../models/tokenBlackList.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are requires"
        })
    }

    const existingUser = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        return res.status(400).json({
            message: "Username or email already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10);

    try {
        const user = await userModel.create({
            username,
            email,
            password: hash
        });

        const token = jwt.sign({
            id: user._id,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("token", token);

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
}

async function userLogin(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }

    const PasswordMatch = await bcrypt.compare(password, user.password);

    if (!PasswordMatch) {
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

    const token = jwt.sign({
        id: user._id,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token);

    return res.status(200).json({
        message: "Login successful",
        user: {
            username: user.username,
            email: user.email
        }
    })

}

async function userLogout(req, res) {
    const token = req.cookies.token;

    if (token) {
        await tokenBlackListModel.create({ token });
        res.clearCookie("token");
        return res.status(200).json({
            message: "Logged out successfully"
        })
    }

    return res.status(400).json({
        message: "No token found"
    })

}

async function getProfile(req, res) {
    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = { registerUser, userLogin, userLogout, getProfile };