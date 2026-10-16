import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance, { setAuthToken } from '../api/axiosConfig';
import { authEndpoints } from '../api/endpoints';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('hirenza_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [role, setRole] = useState(() => {
        return localStorage.getItem('hirenza_role') || null;
    });

    useEffect(() => {
        const token = localStorage.getItem('hirenza_token');
        if (token) {
            setAuthToken(token);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post(authEndpoints.login, { email, password });
            const token = response.data.token;
            setAuthToken(token);
            localStorage.setItem('hirenza_token', token);
            
            // Decode payload safely
            let decoded = {};
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join(''));
                decoded = JSON.parse(jsonPayload);
            } catch (e) {
                console.warn("Failed to decode JWT, using default values", e);
            }

            const subjectEmail = decoded.sub || email;
            let detectedRole = 'STUDENT';

            const claimRole = decoded.role || (decoded.roles && decoded.roles[0]);
            if (claimRole === 'ROLE_TPO' || claimRole === 'TPO') {
                detectedRole = 'TPO';
            } else if (claimRole === 'ROLE_HR' || claimRole === 'HR') {
                detectedRole = 'HR';
            } else {
                detectedRole = 'STUDENT';
            }

            const userData = {
                email: subjectEmail,
                id: decoded.studentId || 1,
                name: subjectEmail.split('@')[0]
            };

            setUser(userData);
            setRole(detectedRole);
            localStorage.setItem('hirenza_user', JSON.stringify(userData));
            localStorage.setItem('hirenza_role', detectedRole);
            
            return { success: true, role: detectedRole };
        } catch (error) {
            console.error("Login failed:", error);
            const msg = error.response?.data?.message || "Invalid credentials or login failed";
            throw new Error(msg);
        }
    };

    // Helper for dev testing or instant role switching
    const mockLoginAs = (targetRole, customEmail) => {
        const mockEmails = {
            STUDENT: 'student@college.edu',
            HR: 'recruiter@zoho.com',
            TPO: 'tpo@college.edu'
        };
        const email = customEmail || mockEmails[targetRole] || 'user@hirenza.com';
        const userData = {
            email,
            id: targetRole === 'HR' ? 201 : (targetRole === 'TPO' ? 301 : 1),
            name: targetRole === 'HR' ? 'Zoho Talent Acquisition' : (targetRole === 'TPO' ? 'Placement Cell Head' : 'Alex Johnson')
        };
        setUser(userData);
        setRole(targetRole);
        localStorage.setItem('hirenza_user', JSON.stringify(userData));
        localStorage.setItem('hirenza_role', targetRole);
        localStorage.setItem('hirenza_token', 'mock_jwt_token_hirenza_' + targetRole);
    };

    const logout = () => {
        setAuthToken(null);
        setUser(null);
        setRole(null);
        localStorage.removeItem('hirenza_token');
        localStorage.removeItem('hirenza_user');
        localStorage.removeItem('hirenza_role');
    };

    return (
        <AuthContext.Provider value={{ user, role, login, mockLoginAs, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
