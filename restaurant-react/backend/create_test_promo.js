import sequelize from './config/database.js';
import { PromoCode } from './models/index.js';

const createPromo = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database');

        const code = await PromoCode.create({
            code: 'WELCOME10',
            discount_type: 'percentage',
            discount_value: 10, // 10%
            min_order_amount: 1000,
            max_uses: 100,
            expires_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // 1 year from now
        });

        console.log('✅ Promo Code created:', code.toJSON());
    } catch (error) {
        console.error('❌ Error creating promo code:', error);
    } finally {
        await sequelize.close();
    }
};

createPromo();
