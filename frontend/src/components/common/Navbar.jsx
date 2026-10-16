import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Brain, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const { user, role, logout } = useAuth();
    const location = useLocation();

    const getRoleBadge = () => {
        if (role === 'TPO') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium tracking-wide bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                    <Building2 className="w-3 h-3 text-amber-600" /> TPO CELL
                </span>
            );
        }
        if (role === 'HR') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium tracking-wide bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                    <Briefcase className="w-3 h-3 text-blue-600" /> HR RECRUITER
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <GraduationCap className="w-3 h-3 text-emerald-600" /> STUDENT
            </span>
        );
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Navigation */}
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">Hirenza</span>
                        </Link>

                        {user && (
                            <div className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-200">
                                {role === 'STUDENT' && (
                                    <Link 
                                        to="/student/dashboard" 
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                                            location.pathname === '/student/dashboard' 
                                                ? 'text-slate-900 bg-slate-100 shadow-2xs' 
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                    >
                                        Eligible Drives
                                    </Link>
                                )}
                                {role === 'HR' && (
                                    <Link 
                                        to="/hr/dashboard" 
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                                            location.pathname === '/hr/dashboard' 
                                                ? 'text-slate-900 bg-slate-100 shadow-2xs' 
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                    >
                                        Recruitment Hub
                                    </Link>
                                )}
                                {role === 'TPO' && (
                                    <Link 
                                        to="/tpo/dashboard" 
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                                            location.pathname === '/tpo/dashboard' 
                                                ? 'text-slate-900 bg-slate-100 shadow-2xs' 
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                    >
                                        Campus Analytics
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right side Profile & Logout */}
                    {user && (
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col text-right hidden sm:flex">
                                <span className="text-xs font-semibold text-slate-800 truncate max-w-[200px]">{user.email}</span>
                                <div className="mt-0.5">{getRoleBadge()}</div>
                            </div>
                            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
                            <button 
                                onClick={logout}
                                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
