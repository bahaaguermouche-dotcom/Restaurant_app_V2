import sequelize from './config/database.js';
import { ActivityLog, User } from './models/index.js';

async function check() {
    try {
        await sequelize.authenticate();
        console.log('DB OK');

        const count = await ActivityLog.count();
        console.log('Total logs:', count);

        const userCount = await User.count();
        console.log('Total users:', userCount);

        const sample = await ActivityLog.findAll({ limit: 5 });
        console.log('Sample logs:', JSON.stringify(sample, null, 2));

    } catch (err) {
        console.error('Check failed:', err);
    } finally {
        process.exit();
    }
}

check();
