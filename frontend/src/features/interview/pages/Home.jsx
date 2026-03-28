import React, { useState, useRef } from 'react'
import "../style/home.scss"

const Home = () => {
    const [fileName, setFileName] = useState(null)
    const [jdText, setJdText] = useState('')
    const [dragging, setDragging] = useState(false)
    const fileRef = useRef()

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

    const wordCount = jdText.trim() ? jdText.trim().split(/\s+/).length : 0

    return (
        <main className='home'>

            <div className="home__bg">
                <div className="home__orb home__orb--1" />
                <div className="home__orb home__orb--2" />
                <div className="home__orb home__orb--3" />
                <div className="home__grid" />
            </div>

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

            <div className="home__card">

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
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <p className="home__file-name">{fileName}</p>
                                <p className="home__file-change">Click to change</p>
                            </div>
                        ) : (
                            <div className="home__upload-prompt">
                                <div className="home__upload-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <polyline points="17,8 12,3 7,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                </div>
                                <p className="home__upload-text">Drop your resume here</p>
                                <p className="home__upload-hint">or click to browse · PDF only</p>
                            </div>
                        )}
                    </div>

                    <button
                        className={`home__btn ${jdText.trim() && fileName ? 'home__btn--ready' : ''}`}
                        disabled={!jdText.trim() || !fileName}
                    >
                        <span>Generate Interview Report</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    <p className="home__disclaimer">
                        Powered by Gemini AI · Your data is never stored permanently
                    </p>
                </div>
            </div>

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