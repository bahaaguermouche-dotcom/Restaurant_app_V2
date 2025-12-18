import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PromoCode = sequelize.define('PromoCode', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    discount_type: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        defaultValue: 'percentage',
        allowNull: false,
    },
    discount_value: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    min_order_amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    max_uses: {
        type: DataTypes.INTEGER,
        defaultValue: -1, // -1 means unlimited
    },
    current_uses: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'promo_codes',
    timestamps: true,
});

export default PromoCode;
