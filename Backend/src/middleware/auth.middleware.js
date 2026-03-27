const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/tokenBlackList.model");

async function authUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized User"
        })
    }

    const tokenInBlackList = await tokenBlackListModel.findOne({ token});

    if (tokenInBlackList) {
        return res.status(401).json({
            message: "Token is blacklisted. please login again"
        })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized User"
            })
        }
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized User"
        })
        console.log(err);
    }

    next();
}

module.exports = { authUser };