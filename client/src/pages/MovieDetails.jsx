import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SeatGrid from '../components/SeatGrid';
import api from '../lib/api';
import { Clock, ArrowLeft, Star, Calendar } from 'lucide-react';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const [movieRes, scheduleRes] = await Promise.all([
                    api.get(`/movies/${id}`),
                    api.get(`/movies/${id}/schedules`)
                ]);
                setMovie(movieRes.data);
                setSchedules(scheduleRes.data);
            } catch (err) {
                console.error('MovieDetails: Failed to fetch data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (selectedSchedule) {
            const fetchSeats = async () => {
                try {
                    const res = await api.get(`/bookings/schedule/${selectedSchedule.id}`);
                    setBookedSeats(res.data);
                    setSelectedSeats([]);
                } catch (err) {
                    console.error('MovieDetails: Failed to fetch booked seats', err);
                }
            };
            fetchSeats();
        }
    }, [selectedSchedule]);

    useEffect(() => {
        const restorePendingBooking = () => {
            const pending = localStorage.getItem('pendingBooking');
            if (pending) {
                const { movieId, schedule, seats } = JSON.parse(pending);
                if (movieId === id) {
                    setSelectedSchedule(schedule);
                    setSelectedSeats(seats);
                }
                localStorage.removeItem('pendingBooking');
            }
        };
        if (!loading && movie) {
            restorePendingBooking();
        }
    }, [loading, movie, id]);

    const handleSeatToggle = (row, number) => {
        setSelectedSeats(prev => {
            const exists = prev.find(s => s.row === row && s.number === number);
            if (exists) {
                return prev.filter(s => s.row !== row || s.number !== number);
            } else {
                return [...prev, { row, number }];
            }
        });
    };

    const handleBooking = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            const pendingBooking = {
                movieId: id,
                schedule: selectedSchedule,
                seats: selectedSeats
            };
            localStorage.setItem('pendingBooking', JSON.stringify(pendingBooking));
            alert('Please login to complete your booking. Your selection has been saved!');
            navigate('/login');
            return;
        }

        if (!selectedSchedule || selectedSeats.length === 0) return;

        try {
            const response = await api.post('/bookings', {
                schedule_id: selectedSchedule.id,
                seats: selectedSeats,
                total_price: (Number(selectedSchedule.price) * selectedSeats.length)
            });

            const { snapToken } = response.data;

            if (window.snap) {
                window.snap.pay(snapToken, {
                    onSuccess: function (result) {
                        console.log('Payment success:', result);
                        alert('Payment successful! Your ticket is confirmed.');
                        navigate('/tickets');
                    },
                    onPending: function (result) {
                        console.log('Payment pending:', result);
                        alert('Payment is pending. Please complete your payment.');
                        navigate('/tickets');
                    },
                    onError: function (result) {
                        console.log('Payment error:', result);
                        alert('Payment failed. Please try again.');
                    },
                    onClose: function () {
                        console.log('Customer closed the popup without finishing the payment');
                        alert('You closed the payment popup. Your booking is saved as "Pending" in My Tickets. Please complete payment there to confirm your seats.');
                        navigate('/tickets');
                    }
                });
            } else {
                alert('Midtrans Snap is not loaded yet. Please refresh the page.');
            }

        } catch (err) {
            console.error('Booking Error details:', err);
            const errorMsg = err.response?.data?.message || 'Booking failed. Please check your internet connection or server status.';
            alert(`Error: ${errorMsg}`);
        }
    };

    if (loading) return (
        <Layout>
            <div className="text-center py-20 text-white animate-pulse">Loading movie details...</div>
        </Layout>
    );

    if (!movie) return (
        <Layout>
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
                <button onClick={() => navigate('/')} className="btn-primary">Go Back Home</button>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="grid lg:grid-cols-4 gap-12 animate-fade-in pb-20">
                <div className="lg:col-span-1 space-y-8">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-white transition-colors group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Movies
                    </button>
                    <div className="relative group">
                        <img
                            src={movie.poster || movie.poster_url}
                            alt={movie.title}
                            className="w-full rounded-2xl shadow-2xl border border-white/10"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster'; }}
                        />
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 text-secondary">
                            <Star size={16} fill="currentColor" />
                            <span className="font-bold text-sm">{movie.rating || 'N/A'}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-tight">{movie.title}</h1>
                        <div className="flex flex-wrap gap-2">
                            {(movie.genre || '').split(',').map((g) => (
                                <span key={g} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold uppercase tracking-wider">
                                    {g.trim()}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 text-muted text-sm pt-2">
                            <span className="flex items-center gap-1.5"><Clock size={16} /> {movie.duration}</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                            <span>{movie.rating ? `${movie.rating}/10` : 'No rating'}</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm italic border-l-2 border-primary/30 pl-4">
                            {movie.description}
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-12">
                    <div className="bg-surface/30 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <Calendar size={24} className="text-primary" />
                            Select Showtime
                        </h2>

                        {!schedules || schedules.length === 0 ? (
                            <div className="p-12 text-center text-muted border border-dashed border-white/10 rounded-2xl">
                                No showtimes available for this movie yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {schedules.map(schedule => (
                                    <button
                                        key={schedule.id}
                                        onClick={() => setSelectedSchedule(schedule)}
                                        className={`
                                            p-4 rounded-2xl border transition-all text-left relative overflow-hidden group
                                            ${selectedSchedule?.id === schedule.id
                                                ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105'
                                                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        <div className="text-xs opacity-60 uppercase font-black tracking-widest mb-1">{schedule.theater_name}</div>
                                        <div className="text-2xl font-black mb-2">
                                            {new Date(schedule.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </div>
                                        <div className="text-sm font-bold opacity-80">Rp {Number(schedule.price).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                                        {selectedSchedule?.id === schedule.id && (
                                            <div className="absolute top-0 right-0 w-8 h-8 bg-white/20 flex items-center justify-center rounded-bl-xl">
                                                <Star size={12} fill="white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedSchedule ? (
                        <div className="animate-slide-up bg-surface/50 p-10 rounded-3xl border border-white/5 shadow-2xl">
                            <h3 className="text-2xl font-black mb-12 text-center flex items-center justify-center gap-4">
                                <span className="h-px w-12 bg-white/10"></span>
                                SEAT SELECTION
                                <span className="h-px w-12 bg-white/10"></span>
                            </h3>

                            <SeatGrid
                                rows={selectedSchedule.total_rows}
                                cols={selectedSchedule.seats_per_row}
                                bookedSeats={bookedSeats}
                                selectedSeats={selectedSeats}
                                onToggleSeat={handleSeatToggle}
                            />

                            <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/10 pt-10">
                                <div className="text-center md:text-left">
                                    <div className="text-xs text-muted uppercase tracking-[0.2em] font-black mb-2">Total Amount</div>
                                    <div className="text-5xl font-black text-white flex items-baseline gap-1">
                                        <span className="text-primary text-2xl">Rp</span>
                                        {(Number(selectedSchedule.price) * selectedSeats.length).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </div>
                                    <div className="text-sm text-primary font-bold mt-2 uppercase tracking-widest">
                                        {selectedSeats.length} Seats Selected
                                    </div>
                                </div>

                                <button
                                    onClick={handleBooking}
                                    disabled={selectedSeats.length === 0}
                                    className="btn-primary flex-grow md:flex-grow-0 px-16 py-4 text-xl uppercase tracking-tighter disabled:opacity-30 disabled:grayscale transition-all"
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-80 flex flex-col items-center justify-center text-muted border-2 border-dashed border-white/5 rounded-3xl bg-black/20">
                            <Calendar size={48} className="mb-4 opacity-10" />
                            <p className="text-lg font-bold tracking-tight opacity-30">Select a showtime to proceed with booking</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default MovieDetails;
