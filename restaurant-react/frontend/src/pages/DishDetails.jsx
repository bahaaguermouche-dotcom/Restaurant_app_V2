import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dishesAPI, reviewsAPI, cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FaHeart, FaShoppingCart, FaStar, FaArrowLeft, FaUtensils, FaClock } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

const DishDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { success, error } = useNotification();

    const [dish, setDish] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [dishRes, reviewsRes] = await Promise.all([
                dishesAPI.getOne(id),
                reviewsAPI.getByDish(id)
            ]);
            setDish(dishRes.data);
            setReviews(reviewsRes.data);
        } catch (err) {
            error('Erreur lors du chargement du plat');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async () => {
        if (!isAuthenticated) {
            error('Veuillez vous connecter pour commander');
            navigate('/login');
            return;
        }

        try {
            await cartAPI.addToCart(dish.id, quantity);
            success(`${quantity}x ${dish.nom} ajouté au panier!`);
        } catch (err) {
            error('Erreur lors de l\'ajout au panier');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!dish) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
            >
                <FaArrowLeft className="mr-2" /> Retour
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Available Image */}
                <div className="rounded-3xl overflow-hidden shadow-xl h-[500px] relative group">
                    <img
                        src={dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                        alt={dish.nom}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'; }}
                    />
                    {dish.is_popular && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full font-bold shadow-lg">
                            Populaire
                        </div>
                    )}
                </div>

                {/* Dish Info */}
                <div className="flex flex-col justify-center">
                    <div className="mb-6">
                        <span className="text-secondary font-bold uppercase tracking-wider text-sm mb-2 block">
                            {dish.categorie}
                        </span>
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">{dish.nom}</h1>
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                                <FaStar className="text-yellow-400 mr-2" />
                                <span className="font-bold text-gray-800">{dish.average_rating || 0}</span>
                                <span className="text-gray-500 ml-1">({dish.review_count} avis)</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                                <FaClock className="mr-2" />
                                <span>20-30 min</span>
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-primary mb-8">
                            {(dish.prix || 0).toLocaleString()} DA
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {dish.description || "Aucune description disponible pour ce plat. Laissez-vous tenter par ses saveurs authentiques !"}
                        </p>
                    </div>

                    <div className="flex items-center space-x-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="px-4 py-3 text-gray-600 hover:text-primary transition-colors text-xl font-bold"
                            >
                                -
                            </button>
                            <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="px-4 py-3 text-gray-600 hover:text-primary transition-colors text-xl font-bold"
                            >
                                +
                            </button>
                        </div>
                        <button
                            onClick={addToCart}
                            className="btn-primary flex-1 py-4 text-xl shadow-lg hover:shadow-primary/30"
                        >
                            <FaShoppingCart className="mr-3" />
                            Ajouter au panier
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Avis des clients</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Stats Column */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center sticky top-24">
                            <div className="text-5xl font-bold text-gray-800 mb-2">
                                {dish.average_rating || 0}
                            </div>
                            <div className="flex justify-center text-yellow-400 mb-4 text-xl">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < Math.round(dish.average_rating || 0) ? "" : "text-gray-200"} />
                                ))}
                            </div>
                            <p className="text-gray-500 font-medium">
                                Basé sur {dish.review_count} avis
                            </p>
                        </div>
                    </div>

                    {/* Reviews Column */}
                    <div className="md:col-span-2">
                        {isAuthenticated ? (
                            <ReviewForm
                                dishId={dish.id}
                                onReviewAdded={fetchData}
                            />
                        ) : (
                            <div className="bg-blue-50 p-6 rounded-xl text-center mb-8 border border-blue-100">
                                <p className="text-blue-800 font-medium mb-3">Vous avez commandé ce plat ?</p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-primary font-bold hover:underline"
                                >
                                    Connectez-vous pour laisser un avis
                                </button>
                            </div>
                        )}

                        <ReviewList reviews={reviews} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DishDetails;
