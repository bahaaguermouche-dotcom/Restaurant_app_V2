import { FaChartLine, FaUsers, FaUtensils, FaShoppingCart, FaTachometerAlt, FaClipboardList, FaUsersCog } from 'react-icons/fa';

const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary', trend }) => {
    const colorClasses = {
        primary: 'from-primary-light to-primary',
        success: 'from-green-400 to-green-600',
        warning: 'from-yellow-400 to-yellow-600',
        info: 'from-blue-400 to-blue-600',
    };

    return (
        <div className="card card-hover p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white`}>
                    <Icon className="text-2xl" />
                </div>
                {trend && (
                    <span className={`text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
    );
};

export default StatCard;
