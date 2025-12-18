import sequelize from './config/database.js';

async function migrate() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();

        console.log('Adding image_url column to dishes table...');
        try {
            await sequelize.query('ALTER TABLE dishes ADD COLUMN image_url TEXT;');
            console.log('✅ Successfully added image_url column.');
        } catch (error) {
            if (error.message.includes('duplicate column name')) {
                console.log('⚠️ Column image_url already exists.');
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await sequelize.close();
    }
}

migrate();
