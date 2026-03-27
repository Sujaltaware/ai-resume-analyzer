const pdfParse = require("pdf-parse")
const generateInterviewReport  = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")



async function generateInterViewReportController(req, res) {
    const resumeFile = req.file;
    const resumeContent = await pdfParse(resumeFile.buffer);
    const { jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}




module.exports = { generateInterViewReportController }