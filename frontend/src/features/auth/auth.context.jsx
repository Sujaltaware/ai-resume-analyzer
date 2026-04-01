import { createContext, useState, useMemo } from "react";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const value = useMemo(() => ({
        user,
        setUser,
        loading,
        setLoading
    }), [user, loading])  // only re-creates when user or loading actually changes


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

