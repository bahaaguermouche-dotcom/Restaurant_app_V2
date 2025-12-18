import sequelize from './config/database.js';

const migrate = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database');

        await sequelize.query('ALTER TABLE dishes ADD COLUMN prix FLOAT DEFAULT 0');
        console.log('✅ Added prix column to dishes table');

    } catch (error) {
        console.error('Migration error (column might already exist):', error.message);
    } finally {
        await sequelize.close();
    }
};

migrate();
