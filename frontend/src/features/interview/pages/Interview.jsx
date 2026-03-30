import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/use.interview'
import { useParams } from 'react-router'
import '../style/interview.scss'


// ── Icons ─────────────────────────────────────────────────────────────────────
const IconCode = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
)
const IconChat = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
)
const IconMap = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
)
const IconChevron = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
)
const IconDownload = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
)

// ── Nav config ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { id: 'technical',  label: 'Technical',  sub: 'Questions', icon: <IconCode /> },
    { id: 'behavioral', label: 'Behavioral', sub: 'Questions', icon: <IconChat /> },
    { id: 'roadmap',    label: 'Road Map',   sub: 'Day plan',  icon: <IconMap />  },
]

// ── QuestionCard ───────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className={`q-card ${open ? 'q-card--open' : ''}`}>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <IconChevron />
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── RoadMapDay ─────────────────────────────────────────────────────────────────
const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__dot' />
        <div className='roadmap-day__card'>
            <div className='roadmap-day__header'>
                <span className='roadmap-day__badge'>Day {day.day}</span>
                <h3 className='roadmap-day__focus'>{day.focusArea}</h3>
            </div>
            <ul className='roadmap-day__tasks'>
                {(day.task || []).map((t, i) => (
                    <li key={i}>
                        <span className='roadmap-day__bullet' />
                        {t}
                    </li>
                ))}
            </ul>
        </div>
    </div>
)

// ── ScoreRing ──────────────────────────────────────────────────────────────────
const ScoreRing = ({ score }) => {
    const r = 42
    const circ = 2 * Math.PI * r
    const offset = circ - (score / 100) * circ
    const color = score >= 80 ? '#00d4aa' : score >= 60 ? '#f59e0b' : '#ff4d6d'
    const label = score >= 80 ? 'Strong match' : score >= 60 ? 'Good match' : 'Needs work'

    return (
        <div className='score-ring'>
            <p className='score-ring__label'>Match Score</p>
            <div className='score-ring__wrap'>
                <svg width="108" height="108" viewBox="0 0 108 108">
                    <circle cx="54" cy="54" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                        cx="54" cy="54" r={r}
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 54 54)"
                        style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                </svg>
                <div className='score-ring__inner'>
                    <span className='score-ring__value' style={{ color }}>{score}</span>
                    <span className='score-ring__pct'>%</span>
                </div>
            </div>
            <p className='score-ring__sub' style={{ color }}>{label}</p>
        </div>
    )
}

// ── Main Component ─────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, loading, getReportById } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (!report && interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId, report, getReportById])

    if (loading) {
        return <main className='iv-loading'><h2>Loading report...</h2></main>
    }

    if (!report) {
        return (
            <main className='iv-empty'>
                <h2>No report loaded</h2>
                <p>Please generate a report first and then visit this page.</p>
            </main>
        )
    }

    const data = report

    const counts = {
        technical:  data.technicalQuestions?.length || 0,
        behavioral: data.behavioralQuestions?.length || 0,
        roadmap:    data.preparationTips?.length || 0,
    }

    return (
        <div className='iv-page'>
            <div className='iv-bg-grid' />

            <div className='iv-layout'>

                {/* ── Left Nav ─────────────────────────────────────────── */}
                <nav className='iv-nav'>
                    <div className='iv-nav__top'>
                        <div className='iv-nav__brand'>
                            <span className='iv-nav__brand-dot' />
                            <span className='iv-nav__brand-name'>PrepIQ</span>
                        </div>

                        <p className='iv-nav__heading'>Sections</p>

                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`iv-nav__item ${activeNav === item.id ? 'iv-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='iv-nav__icon'>{item.icon}</span>
                                <span className='iv-nav__item-text'>
                                    <span className='iv-nav__item-label'>{item.label}</span>
                                    <span className='iv-nav__item-sub'>{counts[item.id]} {item.sub}</span>
                                </span>
                            </button>
                        ))}
                    </div>

                    <button className='iv-nav__download'>
                        <IconDownload />
                        <span>Download Resume</span>
                    </button>
                </nav>

                <div className='iv-divider' />

                {/* ── Center Content ───────────────────────────────────── */}
                <main className='iv-content'>

                    {activeNav === 'technical' && (
                        <section className='iv-section'>
                            <div className='iv-content-header'>
                                <h2>Technical Questions</h2>
                                <span className='iv-content-header__badge'>{counts.technical} questions</span>
                            </div>
                            <div className='q-list'>
                                {data.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section className='iv-section'>
                            <div className='iv-content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='iv-content-header__badge'>{counts.behavioral} questions</span>
                            </div>
                            <div className='q-list'>
                                {data.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section className='iv-section'>
                            <div className='iv-content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='iv-content-header__badge'>{counts.roadmap}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                <div className='roadmap-list__line' />
                                {data.preparationTips.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}

                </main>

                <div className='iv-divider' />

                {/* ── Right Sidebar ─────────────────────────────────────── */}
                <aside className='iv-sidebar'>

                    <ScoreRing score={data.matchScore} />

                    <div className='iv-sidebar__divider' />

                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {data.skillsGap.map((gap, i) => (
                                <span
                                    key={i}
                                    className={`skill-tag skill-tag--${gap.severity.toLowerCase()}`}
                                >
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className='iv-sidebar__divider' />

                    <div className='iv-sidebar__job'>
                        <p className='iv-sidebar__job-label'>Role</p>
                        <p className='iv-sidebar__job-title'>{data.title}</p>
                    </div>

                </aside>

            </div>
        </div>
    )
}

export default Interview