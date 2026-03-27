
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });


async function generateInterviewReport({ resume, jobDescription }) {
    const prompt = `
You are an expert interview coach. Analyze the resume and job description.
Return ONLY a valid JSON object with this EXACT structure, no extra text:

{
  "matchScore": 85,
  "title": "Job title here",
  "technicalQuestions": [
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "behavioralQuestions": [
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "skillsGap": [
    { "skill": "...", "severity": "Low | Medium | High" }
  ],
  "preparationTips": [
    { "day": 1, "focusArea": "...", "task": ["task1", "task2"] }
  ]
}

Resume:
${resume}

Job Description:
${jobDescription}
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" },
    });

    return JSON.parse(response.text);
}

module.exports = generateInterviewReport;