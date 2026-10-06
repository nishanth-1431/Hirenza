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
        return <Navigate to={role === 'TPO' ? '/tpo/dashboard' : '/student/dashboard'} replace />;
    }

    return (
        <div className="min-h-screen bg-zinc-950 font-sans text-zinc-50 selection:bg-zinc-800 selection:text-white relative overflow-x-hidden">
            {/* Subtle Grid Background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="fixed left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-zinc-500 opacity-[0.10] blur-[100px]" />

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
