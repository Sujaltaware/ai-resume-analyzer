import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import './auth.style.scss'

const ResetPassword = () => {
    const { token } = useParams()
    const { handleResetPassword, loading } = useAuth()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirm) {
            setError('Passwords do not match')
            return
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }
        const result = await handleResetPassword({ token, password })
        if (result.success) {
            navigate('/login')
        } else {
            setError(result.message)
        }
    }

    return (
        <main>
            <div className='form-container'>

                <div className="brand">
                    <div className="brand__mark">✦</div>
                    <span className="brand__name">PrepIQ</span>
                </div>

                <div className="form-header">
                    <h1>New password</h1>
                    <p className="form-subtitle">Must be at least 8 characters.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>New password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter new password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" className="toggle-password"
                                onClick={() => setShowPassword(s => !s)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Confirm password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Repeat new password"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && <p className='error-msg'>{error}</p>}

                    <button
                        type="submit"
                        className={`button primary-btn ${loading ? 'primary-btn--loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <><span className="btn-spinner"/><span>Resetting…</span></>
                        ) : (
                            <span>Reset password</span>
                        )}
                    </button>
                </form>
            </div>
        </main>
    )
}

export default ResetPassword