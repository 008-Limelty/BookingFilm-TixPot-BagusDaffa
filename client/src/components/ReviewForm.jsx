import React, { useReducer, useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import api from '../lib/api';

const formReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'RESET':
            return { movie_id: '', rating: 5, comment: '' };
        default:
            return state;
    }
};

const ReviewForm = ({ onReviewAdded }) => {
    const [state, dispatch] = useReducer(formReducer, {
        movie_id: '',
        rating: 5,
        comment: ''
    });
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await api.get('/movies');
                setMovies(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchMovies();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!state.movie_id) return setError('Please select a movie');
        if (!state.comment.trim()) return setError('Please enter a comment');
        if (state.comment.length < 5) return setError('Comment is too short');

        setLoading(true);
        setError('');

        try {
            const res = await api.post('/reviews', state);
            onReviewAdded(res.data);
            dispatch({ type: 'RESET' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-surface border border-white/10 p-8 rounded-[2rem] space-y-6 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="bg-primary w-2 h-6 rounded-full"></span>
                Write a Review
            </h3>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm animate-shake">
                    {error}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-muted mb-2">Select Movie</label>
                    <select
                        value={state.movie_id}
                        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'movie_id', value: e.target.value })}
                        className="input-field w-full appearance-none bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white"
                        required
                    >
                        <option value="" disabled className="bg-[#0d0d0d]">Choose a movie...</option>
                        {movies.map(movie => (
                            <option key={movie.id} value={movie.id} className="bg-[#0d0d0d]">{movie.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-muted mb-2">Rating</label>
                    <div className="flex flex-wrap items-center gap-1 min-h-[46px]">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => dispatch({ type: 'SET_FIELD', field: 'rating', value: star })}
                                className="p-1 hover:scale-125 transition-transform"
                            >
                                <Star
                                    size={20}
                                    className={`${state.rating >= star ? 'fill-yellow-500 text-yellow-500' : 'text-white/20'}`}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted mb-2">Your Experience</label>
                <textarea
                    value={state.comment}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'comment', value: e.target.value })}
                    className="input-field w-full min-h-[120px] bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-600 resize-none"
                    placeholder="Tell us what you thought about the movie..."
                    required
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 group hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
                {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <>
                        Post Review
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
};

export default ReviewForm;
