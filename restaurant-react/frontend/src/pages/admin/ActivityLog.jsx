import { useState, useEffect } from 'react';
import { logsAPI } from '../../services/api';
import ActivityLogTable from '../../components/admin/ActivityLogTable';
import Pagination from '../../components/Pagination';
import { FaSearch, FaFilter, FaHistory } from 'react-icons/fa';

const ActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actions, setActions] = useState([]);

    // Filters
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchUser, setSearchUser] = useState('');
    const [selectedAction, setSelectedAction] = useState('');
    const [startDate, setStartDate] = useState('');

    useEffect(() => {
        loadActions();
    }, []);

    useEffect(() => {
        loadLogs();
    }, [page, searchUser, selectedAction, startDate]);

    const loadActions = async () => {
        try {
            const res = await logsAPI.getActions();
            setActions(res.data);
        } catch (error) {
            console.error('Error loading actions:', error);
        }
    };

    const loadLogs = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 15,
                user: searchUser,
                action: selectedAction,
                startDate,
            };

            const res = await logsAPI.getLogs(params);
            setLogs(res.data.logs);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Error loading logs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                        <FaHistory className="mr-3 text-primary" />
                        Journal d'activité
                    </h1>
                    <p className="text-gray-600">Historique des actions système et utilisateurs</p>
                </div>
            </div>

            {/* Filters Panel */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur..."
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="relative">
                        <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={selectedAction}
                            onChange={(e) => setSelectedAction(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary appearance-none bg-white"
                        >
                            <option value="">Toutes les actions</option>
                            {actions.map(action => (
                                <option key={action} value={action}>{action}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>

                    <button
                        onClick={() => {
                            setSearchUser('');
                            setSelectedAction('');
                            setStartDate('');
                            setPage(1);
                        }}
                        className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Réinitialiser
                    </button>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <ActivityLogTable logs={logs} loading={loading} />

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
};

export default ActivityLog;
