import React from 'react';
import { Star, Trash2, User } from 'lucide-react';

const ReviewCard = ({ review, onDelete, currentUserId, isAdmin }) => {
    return (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl animate-fade-in group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20">
                        {review.user_avatar ? (
                            <img src={review.user_avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <User size={20} className="text-primary" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-white">{review.user_name}</h4>
                        <p className="text-[10px] text-muted uppercase tracking-widest">
                            {new Date(review.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-white/10'}
                            />
                        ))}
                    </div>

                    {(currentUserId === review.user_id || isAdmin) && (
                        <button
                            onClick={() => onDelete(review.id)}
                            className="p-2 hover:bg-red-500/20 text-muted hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Delete Review"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>
            <p className="text-gray-300 leading-relaxed italic mb-4">"{review.comment}"</p>

            <div className="flex justify-end">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    {review.movie_title}
                </span>
            </div>
        </div>
    );
};

export default ReviewCard;
