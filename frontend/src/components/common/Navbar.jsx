import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user, role, logout } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center border border-zinc-300 group-hover:bg-zinc-200 transition-colors">
                                <Brain className="w-5 h-5 text-zinc-950" />
                            </div>
                            <span className="text-xl font-semibold tracking-tight text-zinc-50">Hirenza</span>
                        </Link>
                    </div>

                    {/* Right side Profile & Logout */}
                    {user && (
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col text-right hidden sm:flex">
                                <span className="text-sm font-medium text-zinc-300">{user.email}</span>
                                <span className="text-xs text-zinc-500 font-medium">{role === 'TPO' ? 'PLACEMENT OFFICER' : 'STUDENT'}</span>
                            </div>
                            <div className="h-8 w-px bg-zinc-800 mx-2 hidden sm:block"></div>
                            <button 
                                onClick={logout}
                                className="flex items-center justify-center w-9 h-9 rounded text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
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
