import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';

const ProtectedRoute = ({ allowedRole }) => {
    const { user, role } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && role !== allowedRole) {
        // User is logged in but doesn't have the right role
        return <Navigate to={role === 'TPO' ? '/tpo' : '/student'} replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default ProtectedRoute;
