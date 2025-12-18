import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FaStar, FaUserCircle } from 'react-icons/fa';

const ReviewList = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                Soyez le premier à donner votre avis sur ce plat !
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <FaUserCircle className="text-gray-400 text-4xl" />
                            <div>
                                <h4 className="font-bold text-gray-800">{review.user ? review.user.nom : 'Utilisateur'}</h4>
                                <p className="text-sm text-gray-500">
                                    {format(new Date(review.createdAt), 'd MMMM yyyy', { locale: fr })}
                                </p>
                            </div>
                        </div>
                        <div className="flex bg-yellow-50 px-3 py-1 rounded-full">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>
                    {review.comment && (
                        <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
