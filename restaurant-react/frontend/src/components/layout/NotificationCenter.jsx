import { useState, useRef, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { FaBell, FaCheck, FaInfoCircle, FaExclamationTriangle, FaExclamationCircle, FaTrash, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const NotificationCenter = () => {
    const { history, clearHistory } = useNotification();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const icons = {
        success: <FaCheck className="text-green-500" />,
        error: <FaExclamationCircle className="text-red-500" />,
        info: <FaInfoCircle className="text-blue-500" />,
        warning: <FaExclamationTriangle className="text-yellow-500" />,
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-white hover:text-yellow-300 transition-colors focus:outline-none"
            >
                <FaBell size={22} />
                {history.length > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-primary animate-pulse">
                        {history.length > 9 ? '9+' : history.length}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
                    >
                        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 flex items-center">
                                <FaBell className="mr-2 text-primary" />
                                Notifications
                            </h3>
                            {history.length > 0 && (
                                <button
                                    onClick={clearHistory}
                                    className="text-xs text-gray-500 hover:text-red-500 flex items-center transition-colors"
                                >
                                    <FaTrash className="mr-1" />
                                    Tout effacer
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {history.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                        <FaBell size={32} />
                                    </div>
                                    <p className="text-gray-500">Aucune notification pour le moment</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {history.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-4 hover:bg-gray-50 transition-colors flex items-start space-x-3"
                                        >
                                            <div className={`mt-1 p-2 rounded-full bg-opacity-10 ${item.type === 'error' ? 'bg-red-500' : item.type === 'success' ? 'bg-green-500' : 'bg-primary'}`}>
                                                {icons[item.type] || <FaInfoCircle className="text-primary" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800 font-medium leading-relaxed">
                                                    {item.message}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">
                                                    {format(new Date(item.timestamp), 'HH:mm - dd MMM', { locale: fr })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {history.length > 0 && (
                            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
                                >
                                    Fermer
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter;
