import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout, getProfile, forgotPassword, resetPassword} from "../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
        } catch (error) {
            console.error("Login failed:", error);

        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            const data = await logout();
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const data = await getProfile();
            setUser(data.user);
            console.log("Profile fetched successfully:", data.user);
        } catch (error) {
            console.error("Profile fetch failed:", error);
            if (error.response && error.response.status == 401) {
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleForgotPassword = async ({ email }) => {
        setLoading(true)
        try {
            const data = await forgotPassword({ email })
            return { success: true, message: data.message }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Something went wrong.' }
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async ({ token, password }) => {
        setLoading(true)
        try {
            const data = await resetPassword({ token, password })
            return { success: true, message: data.message }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Something went wrong.' }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!user) {
            fetchProfile();
        }
    }, []);

    return { user, loading, handleLogin, handleRegister, handleLogout, handleForgotPassword, handleResetPassword };
}   