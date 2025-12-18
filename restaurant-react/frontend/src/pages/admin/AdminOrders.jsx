import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { useSocket } from '../../context/SocketContext';
import { FaSearch, FaFilter, FaClock, FaCheckCircle, FaTimesCircle, FaTruck, FaEye } from 'react-icons/fa';
import { format } from 'date-fns';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { success, error } = useNotification();
    const socket = useSocket();

    useEffect(() => {
        fetchOrders();
    }, [page, filterStatus, searchTerm]);

    useEffect(() => {
        if (!socket) return;

        socket.on('newOrder', (newOrder) => {
            success(`Nouvelle commande reçue: #${newOrder.id}`);
            // If on first page and filters allow properly, refresh or prepend
            if (page === 1 && (filterStatus === 'all' || filterStatus === 'en attente')) {
                setOrders(prev => [newOrder, ...prev].slice(0, 20)); // Keep items limit consistent
            }
        });

        socket.on('orderStatusUpdated', ({ orderId, status }) => {
            setOrders(prevOrders => prevOrders.map(order =>
                order.id === orderId ? { ...order, statut: status } : order
            ));
        });

        return () => {
            socket.off('newOrder');
            socket.off('orderStatusUpdated');
        };
    }, [socket, page, filterStatus]);

    const fetchOrders = async () => {
        try {
            const response = await adminAPI.getAllOrders({
                page,
                status: filterStatus,
                search: searchTerm
            });
            setOrders(response.data.orders);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            error('Erreur lors du chargement des commandes');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await adminAPI.updateOrderStatus(orderId, newStatus);
            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? { ...o, statut: newStatus } : o));
            success(`Commande #${orderId} mise à jour`);
        } catch (err) {
            error('Erreur lors de la mise à jour');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'en attente': 'bg-yellow-100 text-yellow-800',
            'confirmé': 'bg-blue-100 text-blue-800',
            'en préparation': 'bg-purple-100 text-purple-800',
            'en livraison': 'bg-orange-100 text-orange-800',
            'livré': 'bg-green-100 text-green-800',
            'annulé': 'bg-red-100 text-red-800',
        };
        return `px-3 py-1 rounded-full text-xs font-semibold ${badges[status] || 'bg-gray-100 text-gray-800'}`;
    };

    if (loading) return (
        <div className="p-8 text-center">
            <LoadingSpinner />
        </div>
    );

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Gestion des Commandes</h1>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par client ou ID..."
                            className="pl-10 pr-4 py-2 border-2 border-gray-100 rounded-lg w-full focus:border-primary focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <FaFilter className="text-gray-400" />
                        <select
                            className="border-2 border-gray-100 rounded-lg px-4 py-2 focus:border-primary focus:outline-none bg-white"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="en attente">En attente</option>
                            <option value="confirmé">Confirmé</option>
                            <option value="en préparation">En préparation</option>
                            <option value="en livraison">En livraison</option>
                            <option value="livré">Livré</option>
                            <option value="annulé">Annulé</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Commande</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                        #{order.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{order.client?.nom || 'Inconnu'}</div>
                                        <div className="text-sm text-gray-500">{order.client?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(order.date_commande), 'dd MMM yyyy HH:mm')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        {(order.total || 0).toLocaleString()} DA
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={getStatusBadge(order.statut)}>{order.statut}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            {order.statut === 'en attente' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order.id, 'confirmé')}
                                                        className="text-green-600 hover:text-green-900 p-1"
                                                        title="Confirmer"
                                                    >
                                                        <FaCheckCircle className="text-xl" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order.id, 'annulé')}
                                                        className="text-red-600 hover:text-red-900 p-1"
                                                        title="Annuler"
                                                    >
                                                        <FaTimesCircle className="text-xl" />
                                                    </button>
                                                </>
                                            )}
                                            {order.statut === 'confirmé' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'livré')}
                                                    className="text-blue-600 hover:text-blue-900 p-1 flex items-center gap-1"
                                                    title="Marquer comme livré"
                                                >
                                                    <FaTruck className="text-xl" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="text-sm font-medium text-gray-500 hover:text-primary disabled:opacity-50"
                    >
                        Précédent
                    </button>
                    <span className="text-sm text-gray-600">Page {page} sur {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="text-sm font-medium text-gray-500 hover:text-primary disabled:opacity-50"
                    >
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
