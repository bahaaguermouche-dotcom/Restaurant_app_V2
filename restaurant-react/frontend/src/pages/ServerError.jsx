import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

const ServerError = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="bg-yellow-50 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-12">
                    <FaExclamationTriangle className="text-5xl text-yellow-500 -rotate-12" />
                </div>
                <h1 className="text-5xl font-black text-gray-900 mb-4">500</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Erreur Interne</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Notre serveur rencontre un petit problème technique. Nous travaillons déjà à le résoudre. Veuillez réessayer dans quelques instants.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn-primary inline-flex items-center space-x-2 px-8 py-3"
                >
                    <FaRedo />
                    <span>Réessayer</span>
                </button>
            </div>
        </div>
    );
};

export default ServerError;
