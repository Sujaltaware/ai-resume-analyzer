import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { useInterview } from '../hooks/use.interview'
import { useNavigate } from 'react-router'
import Loading from '../components/Loading'
import ProfileDropdown from '../components/ProfileDropdown'
import "../style/home.scss"

// ── Home Component ─────────────────────────────────────────────────────────────
const Home = () => {
    // ── Hooks ──────────────────────────────────────────────────────────────────
    const { loading, generateReport, reports } = useInterview()
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()

    // ── State ──────────────────────────────────────────────────────────────────
    const [fileName, setFileName] = useState(null)
    const [jdText, setJdText] = useState('')
    const [dragging, setDragging] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    // ── Constants ──────────────────────────────────────────────────────────────
    const ITEMS_PER_PAGE = 6
    const fileRef = useRef()

    // ── Event Handlers ─────────────────────────────────────────────────────────
    const handleFile = (file) => {
        if (file && file.type === 'application/pdf') {
            setFileName(file.name)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        handleFile(file)
    }

    const handleGenerateReport = async () => {
        try {
            const resumeFile = fileRef.current.files[0]
            const report = await generateReport({ jobDescription: jdText, resumeFile })
            if (!report) {
                console.error('Report generation failed or returned null')
                return
            }
            navigate(`/interview/${report._id}`)
        } catch (error) {
            console.error('Report generation error:', error)
        }
    }

    const onLogout = async () => {
        await handleLogout()
        navigate('/login')
    }
    // ── Computed Values ────────────────────────────────────────────────────────
    const wordCount = jdText.trim() ? jdText.trim().split(/\s+/).length : 0
    const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE)
    const paginatedReports = reports.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    // ── Effects ────────────────────────────────────────────────────────────────
    useEffect(() => {
        setCurrentPage(1)
    }, [reports])

    // ── Loading State ──────────────────────────────────────────────────────────
    if (loading) return <Loading variant="report" />

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <main className='home'>
            {/* Background Elements */}
            <div className="home__bg">
                <div className="home__orb home__orb--1" />
                <div className="home__orb home__orb--2" />
                <div className="home__orb home__orb--3" />
                <div className="home__grid" />
            </div>

            {/* Profile Dropdown */}
            <ProfileDropdown user={user} onLogout={onLogout} />
            {/* Hero Section */}
            <div className="home__hero">
                <span className="home__badge">AI-Powered · Gen AI</span>
                <h1 className="home__title">
                    Land Your <em>Dream</em> Job
                </h1>
                <p className="home__subtitle">
                    Upload your resume + paste the job description. Get ATS score,
                    skill gaps, and AI-generated interview questions in seconds.
                </p>
            </div>

            {/* Main Card */}
            <div className="home__card">
                {/* Job Description Section */}
                <div className="home__left">
                    <div className="home__section-label">
                        <span className="home__step">01</span>
                        <span>Job Description</span>
                    </div>
                    <div className="home__textarea-wrap">
                        <textarea
                            className='home__textarea'
                            name='jobDescription'
                            id='jobDescription'
                            placeholder='Paste the job description here…'
                            value={jdText}
                            onChange={e => setJdText(e.target.value)}
                        />
                        <span className="home__word-count">{wordCount} words</span>
                    </div>
                </div>

                <div className="home__divider" />

                {/* Resume Upload Section */}
                <div className="home__right">
                    <div className="home__section-label">
                        <span className="home__step">02</span>
                        <span>Your Resume</span>
                    </div>

                    <div
                        className={`home__dropzone ${dragging ? 'home__dropzone--active' : ''} ${fileName ? 'home__dropzone--filled' : ''}`}
                        onClick={() => fileRef.current.click()}
                        onDragOver={e => { e.preventDefault(); setDragging(true) }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileRef}
                            type="file"
                            id="resume"
                            name="resume"
                            accept=".pdf"
                            style={{ display: 'none' }}
                            onChange={e => handleFile(e.target.files[0])}
                        />

                        {fileName ? (
                            <div className="home__file-info">
                                <div className="home__file-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="home__file-name">{fileName}</p>
                                <p className="home__file-change">Click to change</p>
                            </div>
                        ) : (
                            <div className="home__upload-prompt">
                                <div className="home__upload-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="17,8 12,3 7,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <p className="home__upload-text">Drop your resume here</p>
                                <p className="home__upload-hint">or click to browse · PDF only</p>
                            </div>
                        )}
                    </div>

                    {/* Generate Report Button */}
                    <button
                        className={`home__btn ${jdText.trim() && fileName ? 'home__btn--ready' : ''}`}
                        disabled={!jdText.trim() || !fileName}
                        onClick={handleGenerateReport}
                    >
                        <span>Generate Interview Report</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <p className="home__disclaimer">
                        Powered by Gemini AI · Your data is never stored permanently
                    </p>
                </div>
            </div>
            {/* Recent Reports Section */}
            {reports?.length > 0 && (
                <section className='recent-reports'>
                    <div className='recent-reports__header'>
                        <h2>My Recent Interview Plans</h2>
                        <span className='recent-reports__count'>
                            {reports.length} total
                        </span>
                    </div>

                    <ul className='reports-list'>
                        {paginatedReports.map(report => (
                            <li key={report._id} className='report-item'
                                onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || report.jobDescription?.split('\n')[0] || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                    Match Score: {report.matchScore}%
                                </p>
                            </li>
                        ))}
                    </ul>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className='pagination'>
                            <button
                                className='pagination__btn'
                                onClick={() => setCurrentPage(p => p - 1)}
                                disabled={currentPage === 1}
                            >
                                ← Prev
                            </button>

                            <div className='pagination__pages'>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`pagination__page ${currentPage === page ? 'pagination__page--active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                className='pagination__btn'
                                onClick={() => setCurrentPage(p => p + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </section>
            )}

            {/* Features Section */}
            <div className="home__features">
                {[
                    { icon: '⚡', label: 'ATS Score', desc: 'Know how your resume ranks' },
                    { icon: '🎯', label: 'Skill Gaps', desc: 'See exactly what you\'re missing' },
                    { icon: '💬', label: 'Interview Qs', desc: 'AI-generated questions & answers' },
                ].map(f => (
                    <div className="home__feature" key={f.label}>
                        <span className="home__feature-icon">{f.icon}</span>
                        <strong>{f.label}</strong>
                        <span>{f.desc}</span>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Home