import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../lib/api';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { name, email, password });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed. Check if email is already taken.');
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto mt-20 p-8 rounded-2xl bg-surface border border-white/10 shadow-2xl">
                <h1 className="text-3xl font-bold mb-8 text-center">Create Account</h1>

                {error && <div className="p-3 mb-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm text-muted mb-2">Full Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-muted mb-2">Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-muted mb-2">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full py-3 hover:scale-105 transition-transform">Register</button>

                    <div className="text-center text-sm text-muted">
                        Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Register;
