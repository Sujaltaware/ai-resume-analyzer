const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const interviewController = require("../controller/interview.controller");
const upload = require("../middleware/file.middleware");



 
const interviewRouter = express.Router();



interviewRouter.post("/generate-report", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController);
 
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportById)

interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReports)

module.exports = interviewRouter;