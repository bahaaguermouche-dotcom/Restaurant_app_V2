import { Link } from 'react-router-dom';
import { FaHome, FaRegFrown } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-md">
                <FaRegFrown className="text-9xl text-gray-300 mx-auto mb-6 animate-bounce" />
                <h1 className="text-8xl font-black text-primary mb-4">404</h1>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Oups ! Page Introuvable</h2>
                <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                    Il semble que vous vous soyez perdu dans notre cuisine. La page que vous recherchez n'existe pas ou a été déplacée.
                </p>
                <Link to="/" className="btn-primary inline-flex items-center space-x-2 px-8 py-4 text-lg">
                    <FaHome />
                    <span>Retour à l'accueil</span>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
