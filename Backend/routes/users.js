const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;