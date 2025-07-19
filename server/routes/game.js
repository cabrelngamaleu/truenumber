const express = require('express');
const User = require('../models/User');
const GameHistory = require('../models/GameHistory');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     GameResult:
 *       type: object
 *       properties:
 *         result:
 *           type: string
 *           enum: [gagné, perdu]
 *         generatedNumber:
 *           type: number
 *         newBalance:
 *           type: number
 *         balanceChange:
 *           type: number
 */

/**
 * @swagger
 * /game/play:
 *   post:
 *     summary: Jouer une partie de TrueNumber
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Lance une partie du jeu TrueNumber. 
 *       Règles:
 *       - Nombre généré entre 0 et 100
 *       - Si ≤ 70: PERDU (-35 points)
 *       - Si > 70 et ≤ 100: GAGNÉ (+50 points)
 *     responses:
 *       200:
 *         description: Résultat de la partie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameResult'
 *       401:
 *         description: Non autorisé
 */
router.post('/play', auth, async (req, res) => {
  try {
    // Générer un nombre aléatoire entre 0 et 100
    const generatedNumber = Math.floor(Math.random() * 101);
    
    // Déterminer le résultat selon les règles
    let result, balanceChange;
    
    if (generatedNumber <= 70) {
      result = 'perdu';
      balanceChange = -35;
    } else {
      result = 'gagné';
      balanceChange = 50;
    }
    
    // Mettre à jour le solde de l'utilisateur
    const user = await User.findById(req.user._id);
    const newBalance = user.balance + balanceChange;
    
    await User.findByIdAndUpdate(req.user._id, { balance: newBalance });
    
    // Enregistrer l'historique de la partie
    const gameHistory = new GameHistory({
      userId: req.user._id,
      generatedNumber,
      result,
      balanceChange,
      newBalance
    });
    
    await gameHistory.save();
    
    res.json({
      result,
      generatedNumber,
      newBalance,
      balanceChange
    });
    
  } catch (error) {
    console.error('Erreur lors du jeu:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;