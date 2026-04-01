import { getAllInterviewReports, getInterviewReportById, generateInterviewReport, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { interviewContext } from "../interview.context"
import { useParams } from "react-router"

export const useInterview = () => {
    const context = useContext(interviewContext)
    const { interviewId } = useParams()
    const { loading, setLoading, report, setReport, reports, setReports } = context
    const generateReport = async ({ jobDescription, resumeFile }) => {
        setLoading(true)
        let response = null

        try {
            response = await generateInterviewReport({ jobDescription, resumeFile })

            if (response?.interviewReport) {
                setReport(response.interviewReport)
                return response.interviewReport
            }

            console.error('Unexpected response shape from generateInterviewReport', response)
            return null

        } catch (error) {
            console.error('generateReport error', {
                message: error.message,
                response: error.response?.data || null,
                stack: error.stack
            })
            return null
        } finally {
            setLoading(false)
        }
    }



    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReport
    }

    const getAllReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            const reportsPayload = response.interviewReports || response.interviews || []
            setReports(reportsPayload)
        } catch (error) {
            console.log(error)
            setReports([])
        } finally {
            setLoading(false)
        }

        return response ? (response.interviewReports || response.interviews || []) : []
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getInterviewReportById(interviewId)
        } else {
            getAllReports([])
        }
    }, [interviewId])

    return { loading, report, reports, generateReport, getReportById, getAllReports, getResumePdf }
}
