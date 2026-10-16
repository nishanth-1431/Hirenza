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
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-slate-200 selection:text-slate-900 relative overflow-x-hidden">
            {/* Subtle Enterprise Light Grid Background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            <div className="fixed left-0 right-0 top-0 -z-10 m-auto h-[350px] w-[350px] rounded-full bg-blue-500 opacity-[0.04] blur-[100px]" />

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
