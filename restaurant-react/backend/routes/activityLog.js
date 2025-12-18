import express from 'express';
import { ActivityLog, User } from '../models/index.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken, isAdmin);

// Get activity logs with filters and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      user,
      action,
      startDate,
      endDate
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Apply filters
    if (action) {
      where.action = action;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Op.gte] = new Date(startDate);
      if (endDate) {
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.timestamp[Op.lte] = end;
      }
    }

    // User filter (requires joining with User table, executed in include or distinct query)
    const userWhere = {};
    if (user) {
      userWhere[Op.or] = [
        { nom: { [Op.like]: `%${user}%` } },
        { email: { [Op.like]: `%${user}%` } },
      ];
    }

    const logs = await ActivityLog.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nom', 'email'],
          required: !!user, // Inner join if filtering by user, Left join otherwise
          where: user ? userWhere : undefined,
        },
      ],
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true, // Crucial for accurate count with joins
    });

    res.json({
      logs: logs.rows,
      total: logs.count,
      page: parseInt(page),
      totalPages: Math.ceil(logs.count / limit),
    });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du journal d\'activité' });
  }
});

// Get unique actions for filter dropdown
router.get('/actions', async (req, res) => {
  try {
    const actions = await ActivityLog.findAll({
      attributes: ['action'],
      group: ['action'],
      order: [['action', 'ASC']],
    });

    res.json(actions.map(a => a.action));
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des actions' });
  }
});

export default router;
