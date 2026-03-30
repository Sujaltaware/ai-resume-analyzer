const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")



async function generateInterViewReportController(req, res) {
    try {
        const resumeFile = req.file;

        if (!resumeFile) {
            return res.status(400).json({
                message: "Resume file is required"
            });
        }

        const resumeContent = await pdfParse(resumeFile.buffer);
        const { jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required"
            });
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            jobDescription
        });

        if (!interViewReportByAi || typeof interViewReportByAi !== 'object') {
            console.error('Invalid AI payload:', interViewReportByAi);
            return res.status(500).json({
                message: 'Invalid interview report payload from AI',
                error: interViewReportByAi
            });
        }

        const titleFromAI = interViewReportByAi.title && interViewReportByAi.title.trim()
        const titleFromJD = jobDescription.split('\n')[0]?.trim()
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            jobDescription,
            title: titleFromAI || titleFromJD || 'Untitled Role',
            ...interViewReportByAi
        });

        console.log('AI output:', interViewReportByAi);
        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

async function getInterviewReportById(req, res) {
    const { interviewId } = req.params
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"

        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


async function getAllInterviewReports(req, res) {

    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -jobDescription -_v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfuly.",
        interviewReports
    })
}

async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            })
        }

        const { resume, jobDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (error) {
        console.error("generateResumePdfController error:", error);
        res.status(500).json({
            message: "Error generating resume PDF",
            error: error.message
        })
    }

}


module.exports = { generateInterViewReportController, getInterviewReportById, getAllInterviewReports, generateResumePdfController }