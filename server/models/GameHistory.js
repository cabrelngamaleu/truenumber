const mongoose = require('mongoose');

const gameHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  generatedNumber: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  result: {
    type: String,
    enum: ['gagné', 'perdu'],
    required: true
  },
  balanceChange: {
    type: Number,
    required: true
  },
  newBalance: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
gameHistorySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('GameHistory', gameHistorySchema);