const crypto = require('crypto')
const { sendPasswordResetEmail } = require('../services/email.service')
const userModel = require("../models/user.model");
const tokenBlackListModel = require("../models/tokenBlackList.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require('passport')

async function registerUser(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long"
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
            password: hash,
            provider: "local"
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

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        })
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }
    if (user.provider !== "local") {
        const providerName = user.provider.charAt(0).toUpperCase() + user.provider.slice(1)

        return res.status(400).json({
            message: `This account was created using ${providerName}. Please login with ${providerName}.`
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

async function forgotPassword(req, res) {
    try {
        const { email } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(200).json({
                message: 'If this email exists, a reset link has been sent.'
            })
        }

        // generate token
        const token = crypto.randomBytes(32).toString('hex')
        const expires = Date.now() + 60 * 60 * 1000  // 1 hour

        // save to user
        user.resetPasswordToken = token
        user.resetPasswordExpires = expires
        await user.save()
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`
        await sendPasswordResetEmail({ toEmail: email, resetLink })

        res.status(200).json({
            message: 'If this email exists, a reset link has been sent.'
        })

    } catch (error) {
        console.error('forgotPassword error:', error)
        res.status(500).json({ message: 'Something went wrong.' })
    }
}

async function resetPassword(req, res) {

    try {
        const { token } = req.params
        const { password } = req.body

        if (!password || password.length < 6) {
            return res.status(400).json({
                message: 'Password is required and must be at least 6 characters long.'
            })
        }

        // find user with valid token
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }  // not expired
        })

        if (!user) {
            return res.status(400).json({
                message: 'Reset link is invalid or has expired.'
            })
        }
        // hash new password
        const hashed = await bcrypt.hash(password, 10)
        user.password = hashed
        user.resetPasswordToken = null   // clear token
        user.resetPasswordExpires = null
        await user.save()

        res.status(200).json({ message: 'Password reset successful.' })

    } catch (error) {
        console.error('resetPassword error:', error)
        res.status(500).json({ message: 'Something went wrong.' })
    }

}

async function handle0AuthSuccess(req, res) {
    const user = req.user
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.redirect(`${process.env.CLIENT_URL}/`)
}

module.exports = { registerUser, userLogin, userLogout, getProfile, forgotPassword, resetPassword, handle0AuthSuccess };