const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/foods';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const { restaurant, category } = req.query;
    let filter = { isAvailable: true };
    if (restaurant) filter.restaurant = restaurant;
    if (category) filter.category = category;
    const foods = await Food.find(filter).populate('restaurant', 'name');
    res.json(foods);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('restaurant', 'name');
    if (!food) return res.status(404).json({ message: 'Not found' });
    res.json(food);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `uploads/foods/${req.file.filename}`;
    const food = await Food.create(data);
    res.status(201).json(food);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `uploads/foods/${req.file.filename}`;
    const food = await Food.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(food);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: 'Food item deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const foods = await Food.find().populate('restaurant', 'name');
    res.json(foods);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;