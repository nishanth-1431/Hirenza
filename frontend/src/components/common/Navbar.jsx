import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, role, logout } = useAuth();

    return (
        <nav className="bg-gray-900 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-bold tracking-wider">HIRENZA</div>
                {user && (
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-medium">{user.email}</span>
                            <span className="text-xs text-gray-400 uppercase">{role}</span>
                        </div>
                        <button 
                            onClick={logout}
                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
