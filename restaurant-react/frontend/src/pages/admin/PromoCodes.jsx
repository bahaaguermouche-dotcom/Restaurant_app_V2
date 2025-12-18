import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { FaTag, FaPlus, FaTrash, FaCalendarAlt, FaPercentage, FaMoneyBillWave } from 'react-icons/fa';
import { format } from 'date-fns';
import LoadingSpinner from '../../components/LoadingSpinner';

const PromoCodes = () => {
    const [promoCodes, setPromoCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { success, error } = useNotification();

    // Form state
    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_amount: 0,
        max_uses: -1,
        expires_at: ''
    });

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        try {
            const response = await adminAPI.getPromoCodes();
            setPromoCodes(response.data);
        } catch (err) {
            error('Erreur lors du chargement des codes promo');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce code promo ?')) return;
        try {
            await adminAPI.deletePromoCode(id);
            setPromoCodes(promoCodes.filter(p => p.id !== id));
            success('Code promo supprimé');
        } catch (err) {
            error('Erreur lors de la suppression');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await adminAPI.createPromoCode(formData);
            setPromoCodes([response.data, ...promoCodes]);
            success('Code promo créé avec succès');
            setShowModal(false);
            setFormData({
                code: '',
                discount_type: 'percentage',
                discount_value: '',
                min_order_amount: 0,
                max_uses: -1,
                expires_at: ''
            });
        } catch (err) {
            error(err.response?.data?.message || 'Erreur lors de la création');
        }
    };

    if (loading) return (
        <div className="p-8 text-center">
            <LoadingSpinner />
        </div>
    );

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Codes Promo</h1>
                    <p className="text-gray-600">Gérez les réductions et offres spéciales</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <FaPlus /> Nouveau Code
                </button>
            </div>

            {/* Promo Codes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promoCodes.map((promo) => (
                    <div key={promo.id} className="card p-6 relative hover:shadow-lg transition-all border-l-4 border-primary">
                        <button
                            onClick={() => handleDelete(promo.id)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <FaTrash />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-primary/10 text-primary p-3 rounded-full text-xl">
                                <FaTag />
                            </span>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{promo.code}</h3>
                                <p className="text-sm text-green-600 font-semibold">
                                    {promo.active ? 'Actif' : 'Inactif'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 text-gray-600">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    {promo.discount_type === 'percentage' ? <FaPercentage /> : <FaMoneyBillWave />}
                                    Réduction
                                </span>
                                <span className="font-bold text-gray-800">
                                    {promo.discount_value}{promo.discount_type === 'percentage' ? '%' : ' DA'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <FaMoneyBillWave /> Min. Commande
                                </span>
                                <span>{promo.min_order_amount} DA</span>
                            </div>
                            {promo.expires_at && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <FaCalendarAlt /> Expire le
                                    </span>
                                    <span>{format(new Date(promo.expires_at), 'dd/MM/yyyy')}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t text-sm flex justify-between">
                                <span>Utilisations:</span>
                                <span className="font-semibold">
                                    {promo.current_uses} / {promo.max_uses === -1 ? '∞' : promo.max_uses}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6">Créer un Code Promo</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Code</label>
                                <input
                                    type="text"
                                    required
                                    className="input uppercase"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="EX: OFFRE2024"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Type</label>
                                    <select
                                        className="input"
                                        value={formData.discount_type}
                                        onChange={e => setFormData({ ...formData, discount_type: e.target.value })}
                                    >
                                        <option value="percentage">Pourcentage (%)</option>
                                        <option value="fixed">Montant Fixe (DA)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Valeur</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        className="input"
                                        value={formData.discount_value}
                                        onChange={e => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Min. Commande (DA)</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="input"
                                    value={formData.min_order_amount}
                                    onChange={e => setFormData({ ...formData, min_order_amount: parseFloat(e.target.value) })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Max Utilisations</label>
                                    <input
                                        type="number"
                                        min="-1"
                                        className="input"
                                        placeholder="-1 = infini"
                                        value={formData.max_uses}
                                        onChange={e => setFormData({ ...formData, max_uses: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Expiration</label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={formData.expires_at}
                                        onChange={e => setFormData({ ...formData, expires_at: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 btn-secondary"
                                >
                                    Annuler
                                </button>
                                <button type="submit" className="flex-1 btn-primary">
                                    Créer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromoCodes;
