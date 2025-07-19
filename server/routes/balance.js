const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Balance:
 *       type: object
 *       properties:
 *         balance:
 *           type: number
 */

/**
 * @swagger
 * /balance:
 *   get:
 *     summary: Récupérer le solde actuel de l'utilisateur connecté
 *     tags: [Balance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Solde actuel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Balance'
 *       401:
 *         description: Non autorisé
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('balance');
    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Erreur lors de la récupération du solde:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;