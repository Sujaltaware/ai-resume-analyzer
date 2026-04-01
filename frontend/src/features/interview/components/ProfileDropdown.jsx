import React, { useState, useRef, useEffect } from 'react'

const ProfileDropdown = ({ user, onLogout }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef()

    // closes dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // shows first 2 letters of name or email
    const getInitials = () => {
        if (user?.username) return user.username.slice(0, 2).toUpperCase()
        if (user?.email) return user.email.slice(0, 2).toUpperCase()
        return 'U'
    }

    return (
        <div className='profile' ref={ref}>
            {/* Circle avatar button */}
            <button
                className='profile__avatar'
                onClick={() => setOpen(o => !o)}
            >
                {getInitials()}
            </button>

            {/* Dropdown — only shows when open */}
            {open && (
                <div className='profile__dropdown'>
                    <div className='profile__arrow' />

                    {/* User info */}
                    <div className='profile__info'>
                        <div className='profile__avatar-lg'>
                            {getInitials()}
                        </div>
                        <div className='profile__details'>
                            <span className='profile__name'>
                                {user?.username || 'User'}
                            </span>
                            <span className='profile__email'>
                                {user?.email || ''}
                            </span>
                        </div>
                    </div>

                    <div className='profile__divider' />

                    {/* Logout button */}
                    <button
                        className='profile__logout'
                        onClick={() => { setOpen(false); onLogout() }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Log out</span>
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfileDropdown