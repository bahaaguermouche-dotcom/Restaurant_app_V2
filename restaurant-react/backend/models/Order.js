import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date_commande: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    statut: {
        type: DataTypes.STRING(50),
        defaultValue: 'en attente',
    },
}, {
    tableName: 'orders',
    timestamps: false,
});

export default Order;
