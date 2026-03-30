const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")



// async function generateInterViewReportController(req, res) {
//     const resumeFile = req.file;
//     const resumeContent = await pdfParse(resumeFile.buffer);
//     const { jobDescription } = req.body

//     const interViewReportByAi = await generateInterviewReport({
//         resume: resumeContent.text,
//         jobDescription
//     })

//     const interviewReport = await interviewReportModel.create({
//         user: req.user.id,
//         resume: resumeContent.text,
//         jobDescription,
//         ...interViewReportByAi
//     })

//     res.status(201).json({
//         message: "Interview report generated successfully.",
//         interviewReport
//     })

// }


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

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            jobDescription,
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



module.exports = { generateInterViewReportController, getInterviewReportById, getAllInterviewReports }