import React, { useState, useEffect } from 'react';
import { Film, User, LogOut, Ticket, Search } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser && storedUser !== 'undefined') {
                    setUser(JSON.parse(storedUser));
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Navbar: Failed to parse user from localStorage', err);
                localStorage.removeItem('user');
            }
        };

        loadUser();

        // Listen for user updates from Profile page
        window.addEventListener('storage', loadUser);
        return () => window.removeEventListener('storage', loadUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
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
                    {user && (
                        <Link to="/tickets" className="text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
                            <Ticket size={16} /> My Tickets
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-300 hidden md:inline">Hi, {user.name}</span>

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
