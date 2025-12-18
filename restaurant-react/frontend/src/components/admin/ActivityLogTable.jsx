import { format } from 'date-fns';
import { FaUser, FaDesktop, FaInfoCircle } from 'react-icons/fa';

const ActivityLogTable = ({ logs, loading }) => {
    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
                ))}
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
                <FaInfoCircle className="mx-auto text-4xl text-gray-300 mb-3" />
                <p className="text-gray-500">Aucune activité trouvée</p>
            </div>
        );
    }

    const getActionColor = (action) => {
        if (action.includes('DELETE')) return 'text-red-600 bg-red-100';
        if (action.includes('CREATE') || action.includes('ADD')) return 'text-green-600 bg-green-100';
        if (action.includes('UPDATE') || action.includes('EDIT')) return 'text-blue-600 bg-blue-100';
        return 'text-gray-600 bg-gray-100';
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b-2 border-gray-100">
                        <th className="text-left py-4 px-4 font-semibold text-gray-600">Utilisateur</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-600">Action</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-600">Détails</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-600">IP</th>
                        <th className="text-right py-4 px-4 font-semibold text-gray-600">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center">
                                        <FaUser size={12} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {log.user ? log.user.nom : 'Système / Anonyme'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {log.user ? log.user.email : '-'}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getActionColor(log.action)}`}>
                                    {log.action}
                                </span>
                            </td>
                            <td className="py-4 px-4">
                                <div className="max-w-xs truncate text-sm text-gray-600" title={log.details}>
                                    {log.entity_type && (
                                        <span className="font-semibold mr-1">{log.entity_type} #{log.entity_id}:</span>
                                    )}
                                    {log.details}
                                </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <FaDesktop className="mr-2 text-gray-400" size={12} />
                                    {log.ip_address || '-'}
                                </div>
                            </td>
                            <td className="py-4 px-4 text-right text-sm text-gray-600 whitespace-nowrap">
                                {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityLogTable;
