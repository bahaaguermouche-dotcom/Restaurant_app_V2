import express from 'express';
import { Review, User, Dish } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import sequelize from '../config/database.js';

const router = express.Router();

// Get reviews for a dish
router.get('/dish/:dishId', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { dish_id: req.params.dishId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'nom']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des avis' });
    }
});

// Add a review
router.post('/dish/:dishId', authenticateToken, async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { rating, comment } = req.body;
        const dishId = req.params.dishId;
        const userId = req.user.id;

        // Check if user already reviewed this dish
        const existingReview = await Review.findOne({
            where: {
                user_id: userId,
                dish_id: dishId
            }
        });

        if (existingReview) {
            await t.rollback();
            return res.status(400).json({ message: 'Vous avez déjà donné votre avis sur ce plat' });
        }

        // Create review
        const review = await Review.create({
            user_id: userId,
            dish_id: dishId,
            rating,
            comment
        }, { transaction: t });

        // Update dish stats
        const dish = await Dish.findByPk(dishId, { transaction: t });
        const newCount = dish.review_count + 1;
        const newAvg = ((dish.average_rating * dish.review_count) + rating) / newCount;

        await dish.update({
            review_count: newCount,
            average_rating: parseFloat(newAvg.toFixed(1))
        }, { transaction: t });

        await t.commit();

        // Fetch complete review with user data to return
        const fullReview = await Review.findByPk(review.id, {
            include: [{ model: User, as: 'user', attributes: ['id', 'nom'] }]
        });

        res.status(201).json(fullReview);
    } catch (error) {
        await t.rollback();
        console.error('Add review error:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'avis' });
    }
});

export default router;
