import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
    },
    adresse: {
        type: DataTypes.STRING(200),
    },
    password_hash: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    date_inscription: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    role: {
        type: DataTypes.STRING(20),
        defaultValue: 'user',
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'active',
    },
}, {
    tableName: 'users',
    timestamps: false,
});

// Method to hash password
User.prototype.setPassword = async function (password) {
    this.password_hash = await bcrypt.hash(password, 10);
};

// Method to check password
User.prototype.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password_hash);
};

export default User;
