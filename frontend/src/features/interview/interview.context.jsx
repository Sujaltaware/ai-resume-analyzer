import { createContext, useState } from "react";

export const interviewContext = createContext()

// ✅ Fix 1: PascalCase — "interviewProvider" → "InterviewProvider"
export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState(null)

    return (
        // ✅ Fix 2: "InterviewContext" → "interviewContext" (match the export above)
        <interviewContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports }}>
            {/* ✅ Fix 3: ({children}) was wrapped in () making it a string — remove the parens */}
            {children}
        </interviewContext.Provider>
    )
}