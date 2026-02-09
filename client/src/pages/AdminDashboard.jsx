import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../lib/api';
import {
    Users,
    Ticket,
    DollarSign,
    Clock,
    Search,
    Eye,
    X,
    TrendingUp,
    Calendar,
    MapPin
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, bookingsRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/bookings')
                ]);
                setStats(statsRes.data);
                setBookings(bookingsRes.data);
            } catch (err) {
                console.error('Failed to fetch admin data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredBookings = bookings.filter(b =>
        b.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.movie_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toString().includes(searchQuery)
    );

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-surface/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform ${color}`}></div>
            <div className="flex items-center gap-4 relative">
                <div className={`p-4 rounded-2xl ${color} bg-opacity-20`}>
                    <Icon className={color.replace('bg-', 'text-')} size={24} />
                </div>
                <div>
                    <p className="text-muted text-sm font-medium uppercase tracking-widest">{title}</p>
                    <h3 className="text-3xl font-bold mt-1">{value}</h3>
                </div>
            </div>
        </div>
    );

    if (loading) return (
        <Layout>
            <div className="text-center py-20 text-white animate-pulse">Loading Dashboard...</div>
        </Layout>
    );

    return (
        <Layout>
            <div className="mb-10 animate-fade-in">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <span className="bg-primary w-2 h-8 rounded-full"></span>
                    Admin Dashboard
                </h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        title="Total Revenue"
                        value={`Rp ${Number(stats?.totalRevenue || 0).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                        icon={DollarSign}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Total Bookings"
                        value={stats?.totalBookings || 0}
                        icon={Ticket}
                        color="bg-primary"
                    />
                    <StatCard
                        title="Pending"
                        value={stats?.pendingCount || 0}
                        icon={Clock}
                        color="bg-yellow-500"
                    />
                    <StatCard
                        title="Growth"
                        value="+12%"
                        icon={TrendingUp}
                        color="bg-purple-500"
                    />
                </div>

                <div className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h2 className="text-2xl font-bold">Recent Bookings</h2>
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search by user or movie..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-muted uppercase text-[10px] font-black tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Booking ID</th>
                                    <th className="px-8 py-4">User</th>
                                    <th className="px-8 py-4">Movie</th>
                                    <th className="px-8 py-4">Seats</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">Amount</th>
                                    <th className="px-8 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6 font-mono text-xs text-muted">#{booking.id.toString().padStart(5, '0')}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                                                    {booking.user_avatar ? (
                                                        <img src={booking.user_avatar} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-primary">
                                                            {booking.user_name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold">{booking.user_name}</div>
                                                    <div className="text-xs text-muted mt-0.5">{booking.user_email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                                                <img src={booking.poster_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="font-bold">{booking.movie_title}</div>
                                        </td>
                                        <td className="px-8 py-6 text-sm">
                                            <div className="flex flex-wrap gap-1">
                                                {booking.seats.map((s, i) => (
                                                    <span key={i} className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5 text-[10px] font-bold">
                                                        {s.seat_row}{s.seat_number}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                                                booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                    'bg-red-500/20 text-red-500'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-bold">Rp {Number(booking.total_price).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                        <td className="px-8 py-6 text-center">
                                            <button
                                                onClick={() => { setSelectedBooking(booking); setShowModal(true); }}
                                                className="p-2 hover:bg-primary/20 text-muted hover:text-primary rounded-xl transition-all"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Visualizer Modal */}
            {showModal && selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md animate-fade-in">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)}></div>
                    <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-2xl rounded-[2.5rem] relative overflow-hidden shadow-2xl animate-scale-up">
                        <div className="p-8 md:p-12 relative">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute right-8 top-8 p-2 hover:bg-white/5 rounded-full text-muted hover:text-white transition-all"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-8">
                                <h3 className="text-3xl font-black mb-2">{selectedBooking.movie_title}</h3>
                                <div className="flex flex-wrap gap-4 text-sm text-muted">
                                    <div className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {new Date(selectedBooking.start_time).toLocaleDateString()}</div>
                                    <div className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> {new Date(selectedBooking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    <div className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> {selectedBooking.theater_name}</div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-muted font-black block mb-3">Customer Details</label>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 border border-white/10">
                                                {selectedBooking.user_avatar ? (
                                                    <img src={selectedBooking.user_avatar} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-sm font-bold text-primary">
                                                        {selectedBooking.user_name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg">{selectedBooking.user_name}</div>
                                                <div className="text-muted text-sm">{selectedBooking.user_email}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-muted font-black block mb-3">Seat Position</label>
                                        <div className="flex flex-wrap gap-3">
                                            {selectedBooking.seats.map((s, i) => (
                                                <div key={i} className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center font-black text-primary shadow-lg shadow-primary/5">
                                                    {s.seat_row}{s.seat_number}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-muted font-black block mb-3">Transaction Info</label>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                                <span className="text-muted">Status</span>
                                                <span className="font-bold text-primary uppercase text-xs tracking-wider">{selectedBooking.status}</span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className="text-muted text-sm pb-1">Total Paid</span>
                                                <span className="text-4xl font-black">Rp {Number(selectedBooking.total_price).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <div className="w-full text-center py-4 border-2 border-dashed border-white/10 rounded-3xl text-muted text-xs font-black uppercase tracking-widest opacity-50">
                                            Electronic Ticket ID: #{selectedBooking.id}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AdminDashboard;
