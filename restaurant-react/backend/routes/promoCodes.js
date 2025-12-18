import express from 'express';
import { PromoCode, Order } from '../models/index.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validate a promo code
router.post('/validate', authenticateToken, async (req, res) => {
    try {
        const { code, amount } = req.body;

        const promoCode = await PromoCode.findOne({
            where: { code: code, active: true }
        });

        if (!promoCode) {
            return res.status(404).json({ message: 'Code promo invalide' });
        }

        // Check expiration
        if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
            return res.status(400).json({ message: 'Ce code promo a expiré' });
        }

        // Check usage limit
        if (promoCode.max_uses !== -1 && promoCode.current_uses >= promoCode.max_uses) {
            return res.status(400).json({ message: 'Ce code promo a atteint sa limite d\'utilisation' });
        }

        // Check minimum order amount
        if (amount < promoCode.min_order_amount) {
            return res.status(400).json({ 
                message: `Le montant minimum pour ce code est de ${promoCode.min_order_amount} DA` 
            });
        }

        // Calculate discount
        let discount = 0;
        if (promoCode.discount_type === 'percentage') {
            discount = (amount * promoCode.discount_value) / 100;
        } else {
            discount = promoCode.discount_value;
        }

        // Ensure discount doesn't exceed total amount
        discount = Math.min(discount, amount);

        res.json({
            valid: true,
            code: promoCode.code,
            discount_type: promoCode.discount_type,
            discount_value: promoCode.discount_value,
            calculated_discount: discount
        });
    } catch (error) {
        console.error('Promo code validation error:', error);
        res.status(500).json({ message: 'Erreur lors de la validation du code promo' });
    }
});

// Admin: Get all promo codes
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const promoCodes = await PromoCode.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(promoCodes);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des codes promo' });
    }
});

// Admin: Create a promo code
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { code, discount_type, discount_value, min_order_amount, max_uses, expires_at } = req.body;

        const existingCode = await PromoCode.findOne({ where: { code } });
        if (existingCode) {
            return res.status(400).json({ message: 'Ce code promo existe déjà' });
        }

        const newPromoCode = await PromoCode.create({
            code,
            discount_type,
            discount_value,
            min_order_amount,
            max_uses,
            expires_at
        });

        res.status(201).json(newPromoCode);
    } catch (error) {
        console.error('Create promo code error:', error);
        res.status(500).json({ message: 'Erreur lors de la création du code promo' });
    }
});

// Admin: Delete a promo code
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await PromoCode.destroy({
            where: { id: req.params.id }
        });

        if (result === 0) {
            return res.status(404).json({ message: 'Code promo non trouvé' });
        }

        res.json({ message: 'Code promo supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du code promo' });
    }
});

export default router;
