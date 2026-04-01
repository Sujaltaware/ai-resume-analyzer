const express = require('express');
const passport = require('passport')
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");



const authRouter = express.Router();

authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.userLogin);
authRouter.post("/logout", authController.userLogout);
authRouter.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)
authRouter.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
    authController.handle0AuthSuccess
)
authRouter.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
)
authRouter.get('/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
    authController.handle0AuthSuccess
)
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password/:token", authController.resetPassword);
authRouter.get("/profile", authMiddleware.authUser, authController.getProfile);

module.exports = authRouter;