import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.user, res.data.token);

            const pending = localStorage.getItem('pendingBooking');
            if (pending) {
                const { movieId } = JSON.parse(pending);
                navigate(`/movie/${movieId}`);
            } else {
                navigate('/');
            }
            window.location.reload();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto mt-10 min-h-[600px] flex rounded-3xl overflow-hidden bg-surface border border-white/10 shadow-2xl animate-fade-in mb-20">
                <div
                    className="hidden lg:flex w-1/2 p-16 flex-col justify-center relative overflow-hidden text-white bg-center bg-cover"
                    style={{ backgroundImage: "url('/redbackground.png')" }}
                >
                    <div className="relative z-10">
                        <h2 className="text-5xl font-extrabold mb-8 leading-tight">Welcome to <span className="text-white underline decoration-black/20 text-6xl block mt-2">TixPot</span></h2>
                        <p className="text-xl text-white/90 leading-relaxed font-light mb-10 max-w-md">
                            Experience the magic of cinema with the most premium seat booking platform. Your journey to the movies starts here.
                        </p>
                        <div className="flex gap-4">
                            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex-1">
                                <span className="block text-2xl font-bold">100+</span>
                                <span className="text-xs uppercase tracking-widest opacity-70">Movies</span>
                            </div>
                            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex-1">
                                <span className="block text-2xl font-bold">50+</span>
                                <span className="text-xs uppercase tracking-widest opacity-70">Theaters</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/30 rounded-full blur-[100px]"></div>
                    <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
                </div>

                <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-surface/50 backdrop-blur-sm">
                    <div className="max-w-md mx-auto w-full">
                        <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>
                        <p className="text-muted mb-8 italic text-sm">Please enter your email and passowrd to access your account</p>

                        {error && (
                            <div className="p-3 mb-6 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-muted mb-2">Email Address</label>
                                <input
                                    type="email"
                                    className="input-field w-full"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-2">Password</label>
                                <input
                                    type="password"
                                    className="input-field w-full"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-primary w-full py-4 text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                                Sign In
                            </button>

                            <div className="text-center text-sm text-muted pt-6 border-t border-white/5 mt-6">
                                New here? <Link to="/register" className="text-primary font-bold hover:underline ml-1">Create an account</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
