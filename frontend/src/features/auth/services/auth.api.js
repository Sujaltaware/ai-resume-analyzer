import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true  
});


export async function register({ username, email, password }) {
    try {
        const response = await api.post("/api/auth/register", {
            username, email, password
        }, {
            withCredentials: true
        });

        return response.data;

    } catch (error) {
        console.error("Registration error:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        }, {
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error("Login error:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export async function logout() {
    try {
        const response = await api.post("/api/auth/logout", {}, {
            withCredentials: true
        });
        
        return response.data;

    } catch (error) {
        console.error("Logout error:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export async function getProfile() {
    try {
        const response = await api.get("/api/auth/profile", {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Profile fetch error:", error.response ? error.response.data : error.message);
        throw error;
    }
}

