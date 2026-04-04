const express = require("express");
const passport = require("./config/passport.config");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const app = express();
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)

        const allowed =
            origin === process.env.CLIENT_URL ||          
            origin.endsWith('.vercel.app') ||              
            origin === 'http://localhost:5173'

        if (allowed) {
            callback(null, true)
        } else {
            callback(new Error(`CORS blocked: ${origin}`))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));


app.use(express.json());
app.use(passport.initialize())
app.use(cookieParser());


const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");



app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);



module.exports = app;