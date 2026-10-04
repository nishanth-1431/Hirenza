import React, { createContext, useContext, useState } from 'react';
import axiosInstance, { setAuthToken } from '../api/axiosConfig';
import { authEndpoints } from '../api/endpoints';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post(authEndpoints.login, { email, password });
            const token = response.data.token;
            setAuthToken(token);
            
            // In a real app, parse the JWT to get the user ID and role, or fetch profile.
            // For this MVP, we can simulate decoding or just assign defaults.
            // Note: The Spring Security JWT usually has claims or we assume from UI flow.
            
            // To simulate basic logic without 'jwt-decode' library:
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const decoded = JSON.parse(jsonPayload);
            setUser({ email: decoded.sub }); // subject is usually email
            
            // If the backend adds a "role" claim to JWT, extract it. Otherwise fallback.
            // For Hirenza MVP, we'll check if the role is TPO or STUDENT from claims
            // Assuming "roles" claim is an array like ["ROLE_STUDENT"] or ["ROLE_TPO"]
            if (decoded.roles && decoded.roles.includes("ROLE_TPO")) {
                setRole("TPO");
            } else {
                setRole("STUDENT");
                // Store student ID if present in JWT, else assume ID 1 for MVP local testing
                setUser(prev => ({ ...prev, id: decoded.studentId || 1 }));
            }
            
            return { success: true, role: role || "STUDENT" };
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, error: error.response?.data?.message || "Login failed" };
        }
    };

    const logout = () => {
        setAuthToken(null);
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
