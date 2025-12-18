import { Link } from 'react-router-dom';
import { FaLock, FaHome } from 'react-icons/fa';

const Forbidden = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="bg-red-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
                    <FaLock className="text-6xl text-red-500" />
                </div>
                <h1 className="text-5xl font-black text-gray-900 mb-4">403</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Accès Refusé</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette zone réservée.
                </p>
                <Link to="/" className="btn-primary inline-flex items-center space-x-2 px-8 py-3">
                    <FaHome />
                    <span>Retour à l'accueil</span>
                </Link>
            </div>
        </div>
    );
};

export default Forbidden;
