import React, { useState } from 'react';
import { Film, User, LogOut, Ticket, Search, MessageSquare } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        if (query) {
            setSearchParams({ search: query });
        } else {
            setSearchParams({});
        }
    };


    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 flex items-center justify-between px-6 md:px-12">
            <div className="flex items-center gap-8 flex-1">
                <Link to="/" className="flex items-center gap-2 text-primary hover:text-red-400 transition-colors shrink-0">
                    <Film size={28} />
                    <span className="text-xl font-bold tracking-wider uppercase hidden sm:inline">Tixpot</span>
                </Link>

                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6 ml-4">
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Movies</Link>
                    <Link to="/reviews" className="text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
                        <MessageSquare size={16} /> Community
                    </Link>
                    {user && (
                        <Link to="/tickets" className="text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
                            <Ticket size={16} /> My Tickets
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-primary hover:text-red-400 transition-colors text-sm font-bold uppercase tracking-wider">
                                    Dashboard
                                </Link>
                            )}
                            <span className="text-sm text-gray-300 hidden md:inline">Hi, {user.name}</span>

                            <Link to="/profile" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-primary/50 transition-all bg-white/5 flex items-center justify-center">
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-[10px] font-bold text-primary">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-primary text-sm px-4 py-1.5 rounded-full whitespace-nowrap">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
