const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');

// Get all entries
router.get('/', async (req, res) => {
  try {
    const entries = await JournalEntry.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create an entry
router.post('/', async (req, res) => {
  const entry = new JournalEntry({
    date: req.body.date,
    tradesTaken: req.body.tradesTaken,
    numberOfWins: req.body.numberOfWins,
    numberOfLosses: req.body.numberOfLosses,
    totalProfit: req.body.totalProfit,
    totalLoss: req.body.totalLoss,
    lessonLearned: req.body.lessonLearned,
    psychology: req.body.psychology,
  });

  try {
    const newEntry = await entry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an entry
router.patch('/:id', async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    if (req.body.date != null) entry.date = req.body.date;
    if (req.body.tradesTaken != null) entry.tradesTaken = req.body.tradesTaken;
    if (req.body.numberOfWins != null) entry.numberOfWins = req.body.numberOfWins;
    if (req.body.numberOfLosses != null) entry.numberOfLosses = req.body.numberOfLosses;
    if (req.body.totalProfit != null) entry.totalProfit = req.body.totalProfit;
    if (req.body.totalLoss != null) entry.totalLoss = req.body.totalLoss;
    if (req.body.lessonLearned != null) entry.lessonLearned = req.body.lessonLearned;
    if (req.body.psychology != null) entry.psychology = req.body.psychology;

    const updatedEntry = await entry.save();
    res.json(updatedEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    
    await entry.deleteOne();
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
