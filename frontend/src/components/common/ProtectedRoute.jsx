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
        if (role === 'TPO') return <Navigate to="/tpo/dashboard" replace />;
        if (role === 'HR') return <Navigate to="/hr/dashboard" replace />;
        return <Navigate to="/student/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-[#DEF2F1]/30 font-sans text-[#17252A] selection:bg-[#3AAFA9]/20 selection:text-[#17252A] relative overflow-x-hidden">
            {/* Subtle Grid with Teal accents */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#2B7A780a_1px,transparent_1px),linear-gradient(to_bottom,#2B7A780a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            <div className="fixed left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-[#3AAFA9] opacity-[0.06] blur-[120px]" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProtectedRoute;
