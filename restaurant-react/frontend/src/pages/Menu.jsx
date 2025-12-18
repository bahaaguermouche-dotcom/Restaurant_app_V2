import { useState, useEffect } from 'react';
import { dishesAPI, cartAPI, favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FaSearch, FaFilter, FaHeart, FaRegHeart, FaShoppingCart, FaUtensils, FaCartPlus, FaSignInAlt } from 'react-icons/fa';
import { CardSkeleton } from '../components/Skeleton';

const Menu = () => {
    const { isAuthenticated } = useAuth();
    const { success, error, info } = useNotification();

    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Tous');
    const [favorites, setFavorites] = useState([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const categories = ['Tous', 'Entrées', 'Plats principaux', 'Desserts', 'Boissons'];

    useEffect(() => {
        fetchData();
    }, [isAuthenticated]); // Added isAuthenticated to dependencies to refetch favorites if auth state changes

    const fetchData = async () => {
        try {
            console.log('Menu: Fetching data...');
            const dishesRes = await dishesAPI.getAll();
            console.log('Menu: Dishes fetched', dishesRes.data);

            // Safety check: ensure we have an array
            const dishesData = Array.isArray(dishesRes.data) ? dishesRes.data : [];
            setDishes(dishesData);

            if (isAuthenticated) {
                const favRes = await favoritesAPI.getFavorites();
                setFavorites(Array.isArray(favRes.data) ? favRes.data.map(fav => fav.id) : []);
            } else {
                setFavorites([]);
            }
        } catch (err) {
            console.error('Menu: Fetch error', err);
            error('Erreur lors du chargement des plats');
            setDishes([]); // Fallback to empty array
        } finally {
            setLoading(false);
        }
    };

    // Filter dishes safe check
    const filteredDishes = Array.isArray(dishes) ? dishes.filter(dish => {
        if (!dish) return false;
        const matchesCategory = activeCategory === 'Tous' || dish.categorie === activeCategory;
        const matchesSearch = (dish.nom || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFavorite = !showFavoritesOnly || favorites.includes(dish.id);
        return matchesCategory && matchesSearch && matchesFavorite;
    }) : [];

    const addToCart = async (e, dish) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            error('Veuillez vous connecter pour ajouter des articles au panier.');
            return;
        }

        try {
            await cartAPI.addToCart(dish.id, 1);
            success(`${dish.nom} ajouté au panier!`);
        } catch (err) {
            error('Erreur lors de l\'ajout au panier');
        }
    };

    const toggleFavorite = async (e, dish) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            error('Veuillez vous connecter pour gérer vos favoris.');
            return;
        }

        try {
            if (favorites.includes(dish.id)) {
                await favoritesAPI.removeFavorite(dish.id);
                setFavorites(favorites.filter(id => id !== dish.id));
                info('Retiré des favoris');
            } else {
                await favoritesAPI.addFavorite(dish.id);
                setFavorites([...favorites, dish.id]);
                success('Ajouté aux favoris');
            }
        } catch (err) {
            error('Erreur');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-800 mb-4">
                    🍽️ Notre Menu
                </h1>
                <p className="text-xl text-gray-600">Découvrez nos délicieux plats préparés avec passion</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="card p-6 sticky top-20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold flex items-center">
                                <FaFilter className="mr-2" />
                                Catégories
                            </h3>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-sm text-primary hover:underline"
                            >
                                <FaSearch />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Rechercher un plat..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        {/* Favorites Filter */}
                        {isAuthenticated && (
                            <button
                                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                                className={`w-full mb-6 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${showFavoritesOnly
                                    ? 'bg-red-500 text-white'
                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                    }`}
                            >
                                <FaHeart />
                                <span>{showFavoritesOnly ? 'Tous les plats' : 'Mes Favoris'}</span>
                                <span className="badge badge-danger ml-2">{favorites.length}</span>
                            </button>
                        )}

                        {/* Categories */}
                        <div className="space-y-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`w-full text-left py-3 px-4 rounded-xl font-medium transition-all ${activeCategory === cat
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <FaUtensils className="inline mr-2" />
                                    {cat === 'all' ? 'Tous les plats' : cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dishes Grid */}
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
                        </div>
                    ) : filteredDishes.length === 0 ? (
                        <div className="text-center py-16">
                            <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun plat trouvé</h3>
                            <p className="text-gray-500">Essayez avec d'autres termes de recherche</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setActiveCategory('Tous');
                                    setShowFavoritesOnly(false);
                                }}
                                className="btn-primary mt-4"
                            >
                                Voir tous les plats
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredDishes.map((dish) => (
                                <div key={dish.id} className="card card-hover overflow-hidden relative fade-in-up">
                                    {/* Favorite Button */}
                                    {isAuthenticated && (
                                        <button
                                            onClick={(e) => toggleFavorite(e, dish)}
                                            className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${favorites.includes(dish.id)
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white text-red-500 hover:bg-red-50'
                                                }`}
                                        >
                                            <FaHeart />
                                        </button>
                                    )}

                                    <img
                                        src={dish.image}
                                        alt={dish.nom}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'; }}
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2 text-center">{dish.nom}</h3>
                                        <p className="text-gray-600 text-center mb-4">
                                            <FaUtensils className="inline mr-2" />
                                            {dish.categorie}
                                        </p>
                                        <div className="text-center mb-4">
                                            <span className="text-3xl font-bold text-primary">
                                                {(dish.prix || 0).toLocaleString()} DA
                                            </span>
                                        </div>
                                        {isAuthenticated ? (
                                            <button
                                                onClick={(e) => addToCart(e, dish)}
                                                className="btn-primary w-full"
                                            >
                                                <FaCartPlus className="inline mr-2" />
                                                Ajouter
                                            </button>
                                        ) : (
                                            <a href="/login" className="btn-outline-primary w-full block text-center">
                                                <FaSignInAlt className="inline mr-2" />
                                                Connectez-vous
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;
