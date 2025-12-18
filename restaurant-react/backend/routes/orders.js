import express from 'express';
import { Order, OrderItem, CartItem, Dish } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's orders
router.get('/', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.id },
            include: [{ model: OrderItem, as: 'items' }],
            order: [['date_commande', 'DESC']],
        });

        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
    }
});

// Create order from cart
router.post('/confirm', authenticateToken, async (req, res) => {
    try {
        // Get cart items
        const cartItems = await CartItem.findAll({
            where: { user_id: req.user.id },
            include: [{ model: Dish, as: 'dish' }],
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Votre panier est vide!' });
        }

        // Calculate total
        let total = cartItems.reduce((sum, item) => {
            return sum + (item.dish.prix * item.quantite);
        }, 0);

        // Apply promo code if present
        const { promoCode } = req.body;
        if (promoCode) {
            const { PromoCode } = await import('../models/index.js');
            const promo = await PromoCode.findOne({
                where: { code: promoCode, active: true }
            });

            if (promo) {
                // Verify limits (simplified for now, ideally re-run all validations)
                if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
                    // Expired, ignore
                } else if (total >= promo.min_order_amount) {
                    let discount = 0;
                    if (promo.discount_type === 'percentage') {
                        discount = (total * promo.discount_value) / 100;
                    } else {
                        discount = promo.discount_value;
                    }
                    total = Math.max(0, total - discount);

                    // Increment usage
                    await promo.increment('current_uses');
                }
            }
        }

        // Create order
        const order = await Order.create({
            user_id: req.user.id,
            total,
        });

        // Create order items
        for (const item of cartItems) {
            await OrderItem.create({
                order_id: order.id,
                dish_id: item.dish_id,
                plat_nom: item.dish.nom,
                plat_prix: item.dish.prix,
                quantite: item.quantite,
            });
        }

        // Clear cart
        await CartItem.destroy({ where: { user_id: req.user.id } });

        // Notify Admins via Socket.IO
        req.io.emit('newOrder', {
            ...order.toJSON(),
            items: cartItems // Include items for immediate display
        });

        res.json({
            message: `Commande #${order.id} confirmée! Total: ${total.toLocaleString()} DA`,
            order,
        });
    } catch (error) {
        console.error('Confirm order error:', error);
        res.status(500).json({ message: 'Erreur lors de la confirmation de la commande' });
    }
});

export default router;
