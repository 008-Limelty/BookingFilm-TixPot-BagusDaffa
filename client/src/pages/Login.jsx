import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../lib/api';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

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
            <div className="max-w-md mx-auto mt-20 p-8 rounded-2xl bg-surface border border-white/10 shadow-2xl animate-fade-in">
                <h1 className="text-3xl font-bold mb-8 text-center text-white">Welcome Back</h1>

                {error && (
                    <div className="p-3 mb-6 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-muted mb-2">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
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
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full py-4 text-lg hover:scale-105 transition-transform shadow-red-500/40">
                        Sign In
                    </button>

                    <div className="text-center text-sm text-muted pt-4">
                        New here? <Link to="/register" className="text-primary font-bold hover:underline">Create an account</Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Login;
