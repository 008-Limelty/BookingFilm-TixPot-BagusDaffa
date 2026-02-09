import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../lib/api';
import { User, Mail, Image as ImageIcon, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        avatar_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                avatar_url: user.avatar_url || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const res = await api.put('/auth/profile', formData);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    if (!user) return (
        <Layout>
            <div className="text-center py-20 text-white">Please login to view profile.</div>
        </Layout>
    );

    const selectAvatar = (url) => {
        setFormData({ ...formData, avatar_url: url });
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto py-12 animate-fade-in">
                <div className="bg-surface/50 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col items-center mb-10">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20 ring-offset-4 ring-offset-[#0d0d0d] bg-white/5 flex items-center justify-center text-4xl font-bold mb-4">
                                    {formData.avatar_url ? (
                                        <img
                                            src={formData.avatar_url}
                                            alt="Profile"
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                            onError={(e) => { e.target.src = ''; }}
                                        />
                                    ) : (
                                        <span className="text-primary">{getInitials(formData.name)}</span>
                                    )}
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">{formData.name || 'User Profile'}</h1>
                            <p className="text-muted text-sm uppercase tracking-widest font-medium">Account Settings</p>
                        </div>

                        {message && (
                            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-slide-up ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Avatar URL Section */}
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-gray-400 flex items-center gap-2 ml-1">
                                    <ImageIcon size={14} /> File Image
                                </label>
                                <input
                                    type="url"
                                    name="avatar_url"
                                    value={formData.avatar_url}
                                    onChange={handleChange}
                                    placeholder="Paste your image URL here (e.g., https://example.com/photo.jpg)"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-600"
                                />
                                <p className="text-[11px] text-muted ml-1 italic opacity-60">Please provide a direct link to a JPG, PNG, or WebP image.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2 ml-1">
                                        <User size={14} /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-600"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2 ml-1">
                                        <Mail size={14} /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-600"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save size={18} className="group-hover:scale-110 transition-transform" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
