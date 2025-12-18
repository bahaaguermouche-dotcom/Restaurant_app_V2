import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Dish = sequelize.define('Dish', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    prix: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    average_rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    review_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    categorie: {
        type: DataTypes.STRING(50),
    },
    image: {
        type: DataTypes.STRING(300),
    },
}, {
    tableName: 'dishes',
    timestamps: false,
});

export default Dish;
