import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-primary text-white p-12 rounded-t-3xl text-center relative overflow-hidden">
                    <div className="hero-pattern absolute inset-0"></div>
                    <div className="relative z-10">
                        <div className="w-32 h-32 bg-yellow-300 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl font-bold text-primary">
                            {user?.nom?.charAt(0).toUpperCase()}
                        </div>
                        <h1 className="text-4xl font-bold mb-2">{user?.nom}</h1>
                        <p className="text-xl">Mon Profil</p>
                    </div>
                </div>

                <div className="card rounded-t-none p-8">
                    <div className="space-y-6">
                        <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                            <FaUser className="text-3xl text-primary mr-4" />
                            <div>
                                <p className="text-sm text-gray-600">Nom complet</p>
                                <p className="text-lg font-semibold">{user?.nom}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                            <FaEnvelope className="text-3xl text-primary mr-4" />
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="text-lg font-semibold">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                            <FaMapMarkerAlt className="text-3xl text-primary mr-4" />
                            <div>
                                <p className="text-sm text-gray-600">Adresse</p>
                                <p className="text-lg font-semibold">{user?.adresse}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full mt-8 bg-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-600 transition-all"
                    >
                        <FaSignOutAlt className="inline mr-2" />
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
