const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/restaurants';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Get all active restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true });
    res.json(restaurants);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get single restaurant
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Not found' });
    res.json(restaurant);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: Create
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `uploads/restaurants/${req.file.filename}`;
    const restaurant = await Restaurant.create(data);
    res.status(201).json(restaurant);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: Update
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `uploads/restaurants/${req.file.filename}`;
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(restaurant);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: Delete
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Restaurant deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: Get all (including inactive)
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;