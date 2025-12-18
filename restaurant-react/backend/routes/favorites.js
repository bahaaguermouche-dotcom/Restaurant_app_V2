import express from 'express';
import { Favorite, Dish } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's favorites
router.get('/', authenticateToken, async (req, res) => {
    try {
        const favorites = await Favorite.findAll({
            where: { user_id: req.user.id },
            include: [{ model: Dish, as: 'dish' }],
        });

        res.json(favorites);
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des favoris' });
    }
});

// Add to favorites
router.post('/add/:dishId', authenticateToken, async (req, res) => {
    try {
        const dishId = parseInt(req.params.dishId);

        const dish = await Dish.findByPk(dishId);
        if (!dish) {
            return res.status(404).json({ message: 'Plat non trouvé' });
        }

        // Check if already in favorites
        const existing = await Favorite.findOne({
            where: { user_id: req.user.id, dish_id: dishId },
        });

        if (existing) {
            return res.json({ success: false, message: 'Déjà dans les favoris' });
        }

        await Favorite.create({
            user_id: req.user.id,
            dish_id: dishId,
        });

        res.json({ success: true, message: 'Ajouté aux favoris' });
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout aux favoris' });
    }
});

// Remove from favorites
router.delete('/remove/:dishId', authenticateToken, async (req, res) => {
    try {
        const dishId = parseInt(req.params.dishId);

        const favorite = await Favorite.findOne({
            where: { user_id: req.user.id, dish_id: dishId },
        });

        if (!favorite) {
            return res.json({ success: false, message: 'Non trouvé dans les favoris' });
        }

        await favorite.destroy();
        res.json({ success: true, message: 'Retiré des favoris' });
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
});

export default router;
