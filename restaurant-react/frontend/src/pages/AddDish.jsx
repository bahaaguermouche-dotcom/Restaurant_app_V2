
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dishesAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { FaUtensils, FaSave, FaImage, FaDollarSign, FaTags, FaPlus } from 'react-icons/fa';

const AddDish = () => {
    const navigate = useNavigate();
    const { success, error } = useNotification();
    const [loadingField, setLoadingField] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        prix: '',
        image_url: '',
        categorie: 'Plats principaux',
        is_popular: false,
        is_new: true,
    });

    const categories = ['Entrées', 'Plats principaux', 'Desserts', 'Boissons'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingField(true);
        try {
            await dishesAPI.createDish(formData);
            success('Plat ajouté avec succès!');
            navigate('/');
        } catch (err) {
            error(err.response?.data?.message || 'Erreur lors de l\'ajout du plat');
        } finally {
            setLoadingField(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8">
                    <FaPlus className="inline mr-3 text-primary" />
                    Ajouter un nouveau plat
                </h1>

                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nom du plat
                            </label>
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Ex: Couscous Royal"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Prix (DA)
                            </label>
                            <input
                                type="number"
                                name="prix"
                                value={formData.prix}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Ex: 2500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <FaUtensils className="inline mr-2" />
                                Catégorie
                            </label>
                            <select
                                name="categorie"
                                value={formData.categorie}
                                onChange={handleChange}
                                className="input-field"
                                required
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                URL de l'image
                            </label>
                            <input
                                type="url"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="https://..."
                                required
                            />
                        </div>

                        {formData.image_url && (
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-2">Aperçu:</p>
                                <img
                                    src={formData.image_url}
                                    alt="Preview"
                                    className="w-full h-64 object-cover rounded-xl"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loadingField}
                            className={`btn-primary w-full text-lg ${loadingField ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {loadingField ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Ajout en cours...
                                </div>
                            ) : (
                                <>
                                    <FaPlus className="inline mr-2" />
                                    Ajouter le plat
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddDish;
