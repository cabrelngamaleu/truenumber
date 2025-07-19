const express = require('express');
const GameHistory = require('../models/GameHistory');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     GameHistoryEntry:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         gameId:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         generatedNumber:
 *           type: number
 *         result:
 *           type: string
 *           enum: [gagné, perdu]
 *         balanceChange:
 *           type: number
 *         newBalance:
 *           type: number
 */

/**
 * @swagger
 * /history:
 *   get:
 *     summary: Récupérer l'historique des parties de l'utilisateur connecté
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historique des parties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GameHistoryEntry'
 *       401:
 *         description: Non autorisé
 */
router.get('/', auth, async (req, res) => {
  try {
    const history = await GameHistory.find({ userId: req.user._id })
      .sort({ date: -1 })
      .select('-userId');
    
    // Formater les données pour correspondre aux spécifications
    const formattedHistory = history.map(entry => ({
      _id: entry._id,
      gameId: entry._id,
      date: entry.date,
      generatedNumber: entry.generatedNumber,
      result: entry.result,
      balanceChange: entry.balanceChange,
      newBalance: entry.newBalance
    }));
    
    res.json({ history: formattedHistory });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * @swagger
 * /history/all:
 *   get:
 *     summary: Récupérer l'historique de toutes les parties (Admin seulement)
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historique global des parties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/GameHistoryEntry'
 *                   - type: object
 *                     properties:
 *                       user:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                           email:
 *                             type: string
 *       403:
 *         description: Accès refusé
 */
router.get('/all', auth, adminAuth, async (req, res) => {
  try {
    const history = await GameHistory.find()
      .populate('userId', 'username email')
      .sort({ date: -1 });
    
    // Formater les données pour l'admin
    const formattedHistory = history.map(entry => ({
      _id: entry._id,
      gameId: entry._id,
      date: entry.date,
      generatedNumber: entry.generatedNumber,
      result: entry.result,
      balanceChange: entry.balanceChange,
      newBalance: entry.newBalance,
      user: {
        username: entry.userId.username,
        email: entry.userId.email
      }
    }));
    
    res.json({ history: formattedHistory });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique global:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;