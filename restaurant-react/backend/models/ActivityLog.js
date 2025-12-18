import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ActivityLog = sequelize.define('ActivityLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Can be null for anonymous actions or system events
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    entity_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    entity_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    details: {
        type: DataTypes.TEXT, // JSON string or text details
        allowNull: true,
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'activity_logs',
    timestamps: false, // We use our own timestamp field
});

export default ActivityLog;
