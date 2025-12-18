import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';
import { reviewsAPI } from '../services/api';

const ReviewForm = ({ dishId, onReviewAdded }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { success, error } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            error('Veuillez sélectionner une note');
            return;
        }

        setSubmitting(true);
        try {
            await reviewsAPI.addReview(dishId, { rating, comment });
            success('Merci pour votre avis !');
            setRating(0);
            setComment('');
            if (onReviewAdded) onReviewAdded();
        } catch (err) {
            error(err.response?.data?.message || 'Erreur lors de l\'envoi de l\'avis');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <h3 className="text-xl font-bold mb-4">Donnez votre avis</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                    <div className="flex space-x-2">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <label key={index} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="rating"
                                        className="hidden"
                                        value={ratingValue}
                                        onClick={() => setRating(ratingValue)}
                                    />
                                    <FaStar
                                        className="transition-colors duration-200"
                                        size={32}
                                        color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(0)}
                                    />
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire (optionnel)</label>
                    <textarea
                        className="input-field w-full h-24 resize-none"
                        placeholder="Qu'avez-vous pensé de ce plat ?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                >
                    {submitting ? 'Envoi...' : 'Publier l\'avis'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
