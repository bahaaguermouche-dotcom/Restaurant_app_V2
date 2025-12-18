import { useState, useEffect } from 'react';
import { favoritesAPI, cartAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { FaHeart, FaTrash, FaShoppingCart, FaCartPlus } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error, info } = useNotification();

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await favoritesAPI.getFavorites();
            setFavorites(response.data);
        } catch (err) {
            error('Erreur lors du chargement des favoris');
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (dishId) => {
        try {
            await favoritesAPI.removeFavorite(dishId);
            setFavorites(favorites.filter(fav => fav.dish.id !== dishId)); // Filter by fav.dish.id as the original filter was by fav.id which is the favorite item's ID, not the dish ID.
            info('Retiré des favoris');
        } catch (err) {
            error('Erreur');
        }
    };

    const addToCart = async (dishId, dishName) => {
        try {
            await cartAPI.addToCart(dishId, 1);
            success(`${dishName} ajouté au panier!`);
        } catch (err) {
            error('Erreur');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">
                <FaHeart className="inline mr-3 text-red-500" />
                Mes Favoris
            </h1>

            {favorites.length === 0 ? (
                <div className="card p-12 text-center">
                    <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">Aucun favori</h2>
                    <p className="text-gray-500 mb-6">Ajoutez des plats à vos favoris depuis le menu</p>
                    <a href="/menu" className="btn-primary inline-block">
                        Voir le Menu
                    </a>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((fav) => (
                        <div key={fav.id} className="card card-hover overflow-hidden">
                            <div className="relative">
                                <img
                                    src={fav.dish.image}
                                    alt={fav.dish.nom}
                                    className="w-full h-48 object-cover"
                                />
                                <button
                                    onClick={() => removeFavorite(fav.dish.id)}
                                    className="absolute top-4 right-4 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">{fav.dish.nom}</h3>
                                <p className="text-gray-600 mb-4">{fav.dish.categorie}</p>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-bold text-primary">
                                        {(fav.dish.prix || 0).toLocaleString()} DA
                                    </span>
                                </div>
                                <button
                                    onClick={() => addToCart(fav.dish.id, fav.dish.nom)}
                                    className="btn-primary w-full"
                                >
                                    <FaCartPlus className="inline mr-2" />
                                    Ajouter au panier
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
