import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../lib/api';
import { Calendar, Clock, MapPin, QrCode } from 'lucide-react';

const Tickets = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings/user');
                setBookings(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

        try {
            await api.put(`/bookings/${bookingId}/cancel`);
            // Refresh bookings
            const res = await api.get('/bookings/user');
            setBookings(res.data);
            alert('Booking cancelled successfully.');
        } catch (err) {
            console.error('Cancel Error:', err);
            alert(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    if (loading) return (
        <Layout>
            <div className="text-center py-20 text-white animate-pulse">Loading your tickets...</div>
        </Layout>
    );

    return (
        <Layout>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">My Tickets</h1>
                <div className="text-sm text-muted bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                    Total {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-32 bg-surface/30 rounded-3xl border border-dashed border-white/10">
                    <QrCode size={64} className="mx-auto mb-6 text-white/10" />
                    <p className="text-xl font-medium text-muted mb-4">No tickets found.</p>
                    <button onClick={() => navigate('/')} className="text-primary hover:underline">Explore Movies</button>
                </div>
            ) : (
                <div className="grid gap-8">
                    {bookings.map(booking => (
                        <div key={booking.id} className={`bg-surface rounded-2xl overflow-hidden flex flex-col md:flex-row border shadow-xl group transition-all duration-300 ${booking.status === 'cancelled' ? 'opacity-60 border-white/5 grayscale-[0.5]' : 'hover:border-white/20 border-white/5 hover:scale-[1.01]'}`}>
                            <div className="w-full md:w-48 lg:w-64 aspect-2/3 md:aspect-auto relative shrink-0">
                                <img src={booking.poster_url} alt={booking.title} className="w-full h-full object-cover" />
                                {booking.status === 'cancelled' && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="px-4 py-2 border-2 border-red-500 text-red-500 font-black uppercase tracking-[0.2em] transform -rotate-12">Cancelled</div>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 grow flex flex-col justify-between relative overflow-hidden">
                                <div className="hidden md:block absolute right-[100px] top-0 bottom-0 w-px border-l border-dashed border-white/10 my-6"></div>

                                <div className="flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-3xl font-black mb-2 tracking-tight">{booking.title}</h3>
                                            <div className="flex items-center gap-2 mb-6">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${booking.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                                <span className="text-xs text-muted">ID: #{booking.id.toString().padStart(5, '0')}</span>
                                            </div>
                                        </div>

                                        {booking.status !== 'cancelled' && (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="text-muted hover:text-red-500 p-2 hover:bg-red-500/10 rounded-full transition-all group/btn"
                                                title="Cancel Booking"
                                            >
                                                <span className="sr-only">Cancel</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold opacity-0 group-hover/btn:opacity-100 transition-opacity">Cancel Ticket</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                </div>
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm mb-8">
                                        <div className="space-y-1">
                                            <div className="text-muted uppercase text-[10px] font-black tracking-widest flex items-center gap-1.5"><Calendar size={12} /> Date</div>
                                            <div className="font-bold">{new Date(booking.start_time).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-muted uppercase text-[10px] font-black tracking-widest flex items-center gap-1.5"><Clock size={12} /> Time</div>
                                            <div className="font-bold">{new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-muted uppercase text-[10px] font-black tracking-widest flex items-center gap-1.5"><MapPin size={12} /> Theater</div>
                                            <div className="font-bold">{booking.theater_name}</div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-[10px] uppercase tracking-widest text-muted font-black mb-2">Selected Seats</div>
                                        <div className="flex flex-wrap gap-2">
                                            {booking.seats.map((seat, i) => (
                                                <span key={i} className={`px-4 py-2 rounded-xl font-mono font-black text-sm border ${booking.status === 'cancelled' ? 'bg-white/5 border-white/5' : 'bg-primary/10 border-primary/20 text-primary'
                                                    }`}>
                                                    {seat.seat_row}{seat.seat_number}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between mt-auto">
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest text-muted font-black mb-1">Total Paid</div>
                                        <div className="text-3xl font-black text-white">${Number(booking.total_price).toFixed(2)}</div>
                                    </div>
                                    <div className={`${booking.status === 'cancelled' ? 'opacity-10' : 'opacity-30 group-hover:opacity-100'} transition-opacity p-2 bg-white rounded-lg`}>
                                        <QrCode size={48} className="text-black" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default Tickets;
