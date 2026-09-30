const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  tradesTaken: {
    type: Number,
    required: true,
    default: 0,
  },
  numberOfWins: {
    type: Number,
    required: true,
    default: 0,
  },
  numberOfLosses: {
    type: Number,
    required: true,
    default: 0,
  },
  totalProfit: {
    type: Number,
    required: true,
    default: 0,
  },
  totalLoss: {
    type: Number,
    required: true,
    default: 0,
  },
  netPnl: {
    type: Number,
    default: 0,
  },
  lessonLearned: {
    type: String,
    trim: true,
  },
  psychology: {
    type: String,
    enum: ['Excellent', 'Good', 'Neutral', 'Poor', 'Terrible'],
    default: 'Neutral',
  },
}, {
  timestamps: true,
});

journalEntrySchema.pre('save', function () {
  this.netPnl = this.totalProfit - this.totalLoss;
  
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
