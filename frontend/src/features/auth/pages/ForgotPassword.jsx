import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import './auth.style.scss'

const ForgotPassword = () => {
    const { handleForgotPassword, loading } = useAuth()
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState(null) // 'success' | 'error'
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await handleForgotPassword({ email })
        setStatus(result.success ? 'success' : 'error')
        setMessage(result.message)
    }

    return (
        <main>
            <div className='form-container'>

                <div className="brand">
                    <div className="brand__mark">✦</div>
                    <span className="brand__name">PrepIQ</span>
                </div>

                <div className="form-header">
                    <h1>Forgot password?</h1>
                    <p className="form-subtitle">
                        Enter your email and we'll send you a reset link.
                    </p>
                </div>

                {/* Success state — show message, hide form */}
                {status === 'success' ? (
                    <div className='auth-feedback auth-feedback--success'>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <p>{message}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {status === 'error' && (
                            <p className='error-msg'>{message}</p>
                        )}

                        <button
                            type="submit"
                            className={`button primary-btn ${loading ? 'primary-btn--loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <><span className="btn-spinner"/><span>Sending…</span></>
                            ) : (
                                <span>Send reset link</span>
                            )}
                        </button>
                    </form>
                )}

                <p className="signup-text">
                    Remember it? <Link to="/login" className="signup-link">Back to login</Link>
                </p>
            </div>
        </main>
    )
}

export default ForgotPassword