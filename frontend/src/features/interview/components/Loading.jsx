import React from 'react'
import '../style/loading.scss'


const Loading = ({ variant = 'page', message }) => {

    const defaults = {
        page:     'Just a moment…',
        report:   'Generating your interview report…',
        inline:   'Loading…',
        download: 'Building your resume PDF…',
    }

    const text = message || defaults[variant]

    // ── Inline (smallest — just a spinner + text in one line) ────────────────
    if (variant === 'inline') {
        return (
            <div className='ld ld--inline'>
                <span className='ld__spinner ld__spinner--sm' />
                <span className='ld__text ld__text--sm'>{text}</span>
            </div>
        )
    }

    // ── Download (overlay-style — shown on top of current page) ──────────────
    if (variant === 'download') {
        return (
            <div className='ld-overlay'>
                <div className='ld-overlay__card'>
                    <div className='ld-overlay__icon'>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                    </div>
                    <span className='ld__spinner' />
                    <p className='ld-overlay__title'>{text}</p>
                    <p className='ld-overlay__sub'>This may take a few seconds</p>
                    <div className='ld-overlay__bar'>
                        <div className='ld-overlay__bar-fill' />
                    </div>
                </div>
            </div>
        )
    }

    // ── Report (full page — used after form submit while AI generates) ────────
    if (variant === 'report') {
        return (
            <main className='ld ld--page'>
                <div className='ld__bg-orb ld__bg-orb--1' />
                <div className='ld__bg-orb ld__bg-orb--2' />
                <div className='ld__body'>
                    <div className='ld__ring'>
                        <svg width="72" height="72" viewBox="0 0 72 72">
                            <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(108,99,255,0.1)" strokeWidth="5"/>
                            <circle cx="36" cy="36" r="28" fill="none" stroke="#6c63ff" strokeWidth="5"
                                strokeDasharray="175" strokeDashoffset="175"
                                strokeLinecap="round" transform="rotate(-90 36 36)"
                                className='ld__ring-arc'
                            />
                        </svg>
                        <span className='ld__ring-icon'>✦</span>
                    </div>
                    <h2 className='ld__title'>{text}</h2>
                    <p className='ld__sub'>Our AI is analyzing your resume and job description</p>
                    <div className='ld__steps'>
                        {['Parsing resume', 'Matching job description', 'Generating questions', 'Building prep plan'].map((step, i) => (
                            <div key={i} className='ld__step' style={{ animationDelay: `${i * 0.6}s` }}>
                                <span className='ld__step-dot' style={{ animationDelay: `${i * 0.6}s` }} />
                                <span className='ld__step-label'>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        )
    }

    // ── Page (default — used after login redirect, generic page loads) ────────
    return (
        <main className='ld ld--page'>
            <div className='ld__bg-orb ld__bg-orb--1' />
            <div className='ld__bg-orb ld__bg-orb--2' />
            <div className='ld__body'>
                <span className='ld__spinner ld__spinner--lg' />
                <p className='ld__text'>{text}</p>
            </div>
        </main>
    )
}

export default Loading