const express = require('express');
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");



const authRouter = express.Router();

authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.userLogin);
authRouter.post("/logout", authController.userLogout);
authRouter.get("/profile", authMiddleware.authUser, authController.getProfile);

module.exports = authRouter;