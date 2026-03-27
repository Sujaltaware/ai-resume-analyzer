const mongoose = require('mongoose');


const TechnicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },

}, { id: false });

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    }
}, { id: false });

const skillsGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: [true, "Severity is required"]
    },
}, { id: false });

const PreapreationTipsSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focusArea: {
        type: String,
        required: [true, "Focus is required"]
    },
    task: [{
        type: String,
        required: [true, "Task is required"]
    }]
}, { id: false });

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String,
        required: [true, "Resume is required"]
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [TechnicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillsGap: [skillsGapSchema],
    preparationTips: [PreapreationTipsSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true });



const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = InterviewReport;