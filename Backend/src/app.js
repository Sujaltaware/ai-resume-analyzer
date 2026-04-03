const express = require("express");
const passport = require("./config/passport.config");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));


app.use(express.json());
app.use(passport.initialize())
app.use(cookieParser());


const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");



app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);



module.exports = app;