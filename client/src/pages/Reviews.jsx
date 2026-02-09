import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import ReviewForm from '../components/ReviewForm';
import ReviewCard from '../components/ReviewCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Search, MessageSquare, Filter } from 'lucide-react';

const Reviews = () => {
    const { user, isAdmin } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMovieId, setSelectedMovieId] = useState('all');
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [moviesRes, reviewsRes] = await Promise.all([
                api.get('/movies'),
                api.get('/reviews')
            ]);
            setMovies(moviesRes.data);
            setReviews(reviewsRes.data);
        } catch (err) {
            console.error('Failed to fetch reviews', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewAdded = (newReview) => {
        setReviews([newReview, ...reviews]);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this review?')) return;
        try {
            await api.delete(`/reviews/${id}`);
            setReviews(reviews.filter(r => r.id !== id));
        } catch (err) {
            alert('Failed to delete review');
        }
    };

    const filteredReviews = useMemo(() => {
        return reviews.filter(review => {
            const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (review.movie_title && review.movie_title.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesMovie = selectedMovieId === 'all' || review.movie_id === parseInt(selectedMovieId);

            return matchesSearch && matchesMovie;
        });
    }, [reviews, searchTerm, selectedMovieId]);

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-10 animate-fade-in">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                            <span className="bg-primary w-2 h-10 rounded-full"></span>
                            Movie Reviews
                        </h1>
                        <p className="text-muted">Share your cinematic experiences with the community.</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search reviews..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm w-full md:w-64"
                            />
                        </div>

                        <div className="relative flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
                            <Filter size={16} className="text-muted" />
                            <select
                                value={selectedMovieId}
                                onChange={(e) => setSelectedMovieId(e.target.value)}
                                className="bg-transparent text-sm focus:outline-none text-white cursor-pointer"
                            >
                                <option value="all" className="bg-[#0f0f0f]">All Movies</option>
                                {movies.map(movie => (
                                    <option key={movie.id} value={movie.id} className="bg-[#0f0f0f]">{movie.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-1">
                        {user ? (
                            <div className="sticky top-24">
                                <ReviewForm onReviewAdded={handleReviewAdded} />
                            </div>
                        ) : (
                            <div className="bg-surface border border-white/10 p-8 rounded-[2rem] text-center shadow-xl">
                                <MessageSquare size={48} className="mx-auto mb-4 text-white/10" />
                                <h3 className="text-xl font-bold mb-2">Want to review?</h3>
                                <p className="text-muted text-sm mb-6">You must be logged in to share your thoughts.</p>
                                <a href="/login" className="btn-primary inline-block px-8 py-3 rounded-xl font-bold">Login Now</a>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        {loading ? (
                            <LoadingSpinner message="Fetching reviews from community..." />
                        ) : filteredReviews.length > 0 ? (
                            <>
                                <div className="text-xs font-black uppercase tracking-[0.2em] text-muted mb-4 px-2">
                                    Found {filteredReviews.length} Reviews
                                </div>
                                {filteredReviews.map(review => (
                                    <ReviewCard
                                        key={review.id}
                                        review={review}
                                        onDelete={handleDelete}
                                        currentUserId={user?.id}
                                        isAdmin={isAdmin}
                                    />
                                ))}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[2rem]">
                                <MessageSquare size={64} className="mx-auto mb-4 text-white/5" />
                                <p className="text-muted">No reviews found for your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Reviews;
