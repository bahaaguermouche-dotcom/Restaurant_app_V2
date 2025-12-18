import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUtensils, FaShoppingCart, FaHeart, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaBell, FaTachometerAlt } from 'react-icons/fa';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
    const { user, isAuthenticated, logout, isAdmin } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="bg-gradient-primary text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" onClick={closeMenu} className="flex items-center space-x-2 text-xl font-bold hover:text-yellow-300 transition-colors">
                        <FaUtensils className="text-2xl" />
                        <span>Restaurant<span className="text-yellow-300">App</span></span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/menu" className="hover:text-yellow-300 transition-colors font-medium">
                            Platts
                        </Link>
                        {isAdmin && (
                            <Link to="/admin/dashboard" className="hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1">
                                <FaTachometerAlt />
                                <span>Dashboard</span>
                            </Link>
                        )}
                        {isAuthenticated && (
                            <>
                                <Link to="/favorites" className="hover:text-yellow-300 transition-colors font-medium flex items-center space-x-1">
                                    <FaHeart />
                                    <span>Favoris</span>
                                </Link>
                                <Link to="/orders" className="hover:text-yellow-300 transition-colors font-medium">
                                    Mes Commandes
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Right Side - Cart & User (Desktop) */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-4">
                            {isAuthenticated && (
                                <>
                                    <NotificationCenter />
                                    <Link to="/cart" className="hover:text-yellow-300 transition-colors">
                                        <FaShoppingCart className="text-2xl" />
                                    </Link>
                                </>
                            )}

                            {isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <Link to="/profile" className="flex items-center space-x-2 hover:text-yellow-300 transition-colors">
                                        <FaUser />
                                        <span className="font-medium">{user?.nom}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 hover:text-yellow-300 transition-colors"
                                    >
                                        <FaSignOutAlt />
                                        <span>Déconnexion</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link to="/login" className="flex items-center space-x-1 hover:text-yellow-300 transition-colors">
                                        <FaSignInAlt />
                                        <span>Connexion</span>
                                    </Link>
                                    <Link to="/register" className="btn-warning text-sm py-2 px-4 flex items-center space-x-1">
                                        <FaUserPlus />
                                        <span>S'inscrire</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden flex items-center space-x-4">
                            {isAuthenticated && (
                                <>
                                    <NotificationCenter />
                                    <Link to="/cart" onClick={closeMenu} className="hover:text-yellow-300 transition-colors">
                                        <FaShoppingCart className="text-2xl" />
                                    </Link>
                                </>
                            )}
                            <button
                                onClick={toggleMenu}
                                className="text-2xl focus:outline-none hover:text-yellow-300 transition-colors"
                            >
                                {isMenuOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar/Drawer Menu */}
            <div className={`md:hidden fixed inset-0 z-40 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMenu}></div>

                {/* Sidebar */}
                <div className="absolute top-0 left-0 w-64 h-full bg-white text-gray-800 shadow-2xl p-6">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-xl font-bold text-primary">Menu</span>
                        <button onClick={closeMenu} className="text-2xl text-gray-500 hover:text-primary">
                            <FaTimes />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <Link to="/menu" onClick={closeMenu} className="block text-lg font-medium hover:text-primary transition-colors py-2 border-b border-gray-100">
                            Platts
                        </Link>
                        {isAdmin && (
                            <Link to="/admin/dashboard" onClick={closeMenu} className="block text-lg font-medium hover:text-primary transition-colors py-2 border-b border-gray-100 flex items-center">
                                <FaTachometerAlt className="mr-2" />
                                Dashboard
                            </Link>
                        )}
                        {isAuthenticated ? (
                            <>
                                <Link to="/favorites" onClick={closeMenu} className="block text-lg font-medium hover:text-primary transition-colors py-2 border-b border-gray-100">
                                    Mes Favoris
                                </Link>
                                <Link to="/orders" onClick={closeMenu} className="block text-lg font-medium hover:text-primary transition-colors py-2 border-b border-gray-100">
                                    Mes Commandes
                                </Link>
                                <Link to="/profile" onClick={closeMenu} className="block text-lg font-medium hover:text-primary transition-colors py-2 border-b border-gray-100">
                                    Mon Profil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left text-lg font-medium text-red-500 hover:bg-red-50 transition-colors py-2"
                                >
                                    <FaSignOutAlt className="inline mr-2" />
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <div className="space-y-4 pt-4">
                                <Link to="/login" onClick={closeMenu} className="block btn-outline-primary text-center">
                                    Connexion
                                </Link>
                                <Link to="/register" onClick={closeMenu} className="block btn-primary text-center">
                                    S'inscrire
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
