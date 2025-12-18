import express from 'express';
import { Dish } from '../models/index.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all dishes
router.get('/', async (req, res) => {
    try {
        const dishes = await Dish.findAll();
        res.json(dishes);
    } catch (error) {
        console.error('Get dishes error:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des plats' });
    }
});

// Get popular dishes (for home page)
router.get('/popular', async (req, res) => {
    try {
        const dishes = await Dish.findAll({ limit: 6 });
        res.json(dishes);
    } catch (error) {
        console.error('Get popular dishes error:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des plats' });
    }
});

// Get new dishes
router.get('/new', async (req, res) => {
    try {
        const dishes = await Dish.findAll({
            order: [['id', 'DESC']],
            limit: 3
        });
        res.json(dishes);
    } catch (error) {
        console.error('Get new dishes error:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des plats' });
    }
});

// Get dish by ID
router.get('/:id', async (req, res) => {
    try {
        const dish = await Dish.findByPk(req.params.id);
        if (!dish) {
            return res.status(404).json({ message: 'Plat non trouvé' });
        }
        res.json(dish);
    } catch (error) {
        console.error('Get dish error:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du plat' });
    }
});

// Add new dish (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { nom, prix, categorie, image } = req.body;

        const dish = await Dish.create({
            nom,
            prix: parseFloat(prix),
            categorie,
            image,
        });

        res.status(201).json({
            message: 'Plat ajouté avec succès!',
            dish
        });
    } catch (error) {
        console.error('Add dish error:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du plat' });
    }
});

export default router;
