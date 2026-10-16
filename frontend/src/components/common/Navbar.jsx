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
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
                    <Building2 className="w-3 h-3 text-amber-700" /> TPO CELL
                </span>
            );
        }
        if (role === 'HR') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-[#DEF2F1] text-[#2B7A78] border border-[#3AAFA9]/30 shadow-2xs">
                    <Briefcase className="w-3 h-3 text-[#2B7A78]" /> HR RECRUITER
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-[#DEF2F1] text-[#2B7A78] border border-[#3AAFA9]/30 shadow-2xs">
                <GraduationCap className="w-3 h-3 text-[#2B7A78]" /> STUDENT
            </span>
        );
    };

    return (
        <nav className="sticky top-0 z-50 bg-[#FEFFFF]/90 backdrop-blur-md border-b border-[#2B7A78]/15 shadow-2xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Navigation */}
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-[#17252A] flex items-center justify-center text-[#3AAFA9] shadow-xs group-hover:scale-105 transition-transform">
                                <Brain className="w-5 h-5 text-[#3AAFA9]" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-[#17252A]">Hirenza</span>
                        </Link>

                        {user && (
                            <div className="hidden md:flex items-center gap-1.5 pl-4 border-l border-[#2B7A78]/20">
                                {role === 'STUDENT' && (
                                    <Link 
                                        to="/student/dashboard" 
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                            location.pathname === '/student/dashboard' 
                                                ? 'text-[#17252A] bg-[#DEF2F1] border border-[#3AAFA9]/30 shadow-2xs' 
                                                : 'text-[#2B7A78] hover:text-[#17252A] hover:bg-[#DEF2F1]/50'
                                        }`}
                                    >
                                        Eligible Drives
                                    </Link>
                                )}
                                {role === 'HR' && (
                                    <Link 
                                        to="/hr/dashboard" 
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                            location.pathname === '/hr/dashboard' 
                                                ? 'text-[#17252A] bg-[#DEF2F1] border border-[#3AAFA9]/30 shadow-2xs' 
                                                : 'text-[#2B7A78] hover:text-[#17252A] hover:bg-[#DEF2F1]/50'
                                        }`}
                                    >
                                        Recruitment Hub
                                    </Link>
                                )}
                                {role === 'TPO' && (
                                    <Link 
                                        to="/tpo/dashboard" 
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                            location.pathname === '/tpo/dashboard' 
                                                ? 'text-[#17252A] bg-[#DEF2F1] border border-[#3AAFA9]/30 shadow-2xs' 
                                                : 'text-[#2B7A78] hover:text-[#17252A] hover:bg-[#DEF2F1]/50'
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
                                <span className="text-xs font-semibold text-[#17252A] truncate max-w-[200px]">{user.email}</span>
                                <div className="mt-0.5">{getRoleBadge()}</div>
                            </div>
                            <div className="h-8 w-px bg-[#2B7A78]/20 mx-1 hidden sm:block"></div>
                            <button 
                                onClick={logout}
                                className="flex items-center justify-center w-8 h-8 rounded-lg text-[#2B7A78] hover:text-[#17252A] hover:bg-[#DEF2F1] border border-transparent hover:border-[#3AAFA9]/30 transition-all cursor-pointer"
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
