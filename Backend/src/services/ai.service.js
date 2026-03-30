
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

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: { responseMimeType: "application/json" },
        });

        const text = response?.text || response?.output?.[0]?.content?.[0]?.text;
        if (!text) {
            throw new Error(`Empty AI response: ${JSON.stringify(response)}`);
        }

        try {
            return JSON.parse(text);
        } catch (parseError) {
            // Try to extract JSON from wrapped text (if model added markdown fences)
            const trimmed = text.trim();
            const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error(`Cannot parse AI response as JSON: ${parseError.message}; text=${text}`);
        }
    } catch (error) {
        console.error('generateInterviewReport error:', {
            message: error.message,
            stack: error.stack,
            response: error.response ? {
                status: error.response.status,
                data: error.response.data
            } : null
        });
        throw error;
    }
}

module.exports = generateInterviewReport;