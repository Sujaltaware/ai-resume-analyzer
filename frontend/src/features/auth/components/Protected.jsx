import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'
import Loading from '../../interview/components/Loading'
import React from 'react'


const Protected = ({ children }) => {
    const { loading, user } = useAuth()

    if (loading) return <Loading variant='inline' /> 
     if (!user) return <Navigate to='/login' />

    return children
}

export default Protected
