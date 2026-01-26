import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../lib/api';
import { Clock, SearchX } from 'lucide-react';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await api.get('/movies');
                setMovies(res.data);
            } catch (err) {
                console.error('Home: Failed to fetch movies', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (movie.genre || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <Layout>
            <div className="text-center py-20 text-white animate-pulse text-lg">Loading amazing movies...</div>
        </Layout>
    );

    return (
        <Layout>
            <section className="mb-12 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <span className="bg-primary w-2 h-8 rounded-full"></span>
                        {searchQuery ? `Search Results for "${searchQuery}"` : 'Now Showing'}
                    </h1>
                    {searchQuery && (
                        <div className="text-muted text-sm px-4 py-1.5 bg-white/5 rounded-full border border-white/5">
                            Found {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'}
                        </div>
                    )}
                </div>

                {!movies || movies.length === 0 ? (
                    <div className="text-center py-20 text-muted border-2 border-dashed border-white/10 rounded-2xl">
                        No movies found in database. Check your Laragon connection.
                    </div>
                ) : filteredMovies.length === 0 ? (
                    <div className="text-center py-24 bg-surface/30 rounded-3xl border border-white/5 backdrop-blur-sm animate-fade-in">
                        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <SearchX size={40} className="text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No movies match your search</h2>
                        <p className="text-muted">Try using different keywords or check for typos.</p>
                        <button
                            onClick={() => window.history.back()}
                            className="mt-8 text-primary hover:underline font-medium"
                        >
                            Go back
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredMovies.map(movie => (
                            <Link
                                to={`/movie/${movie.id}`}
                                key={movie.id}
                                className="group relative bg-surface rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-2xl border border-white/5 hover:border-primary/30"
                            >
                                <div className="aspect-2/3 w-full relative overflow-hidden">
                                    <img
                                        src={movie.poster || movie.poster_url}
                                        alt={movie.title}
                                        className="w-full h-full object-cover group-hover:opacity-60 transition-opacity"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster'; }}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                        <div className="btn-primary w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center py-2.5 rounded-xl font-bold">
                                            Get Tickets
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-linear-to-b from-surface to-[#111]">
                                    <h3 className="text-xl font-bold truncate mb-2 group-hover:text-primary transition-colors">{movie.title}</h3>
                                    <div className="flex items-center justify-between text-sm text-muted">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-primary" /> {movie.duration || 'N/A'}
                                        </div>
                                        <span className="px-2.5 py-1 bg-white/5 rounded-lg text-xs font-medium border border-white/5">
                                            {(movie.genre || '').split(',')[0] || 'Movie'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </Layout>
    );
};

export default Home;
