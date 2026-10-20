const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(cart || { items: [] });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/add', protect, async (req, res) => {
  try {
    const { food, name, price, image, restaurantId, restaurantName } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart && cart.restaurant && cart.restaurant.toString() !== restaurantId) {
      await Cart.findOneAndDelete({ user: req.user._id });
      cart = null;
    }
    if (!cart) {
      cart = new Cart({ user: req.user._id, restaurant: restaurantId, restaurantName, items: [] });
    }
    const existingItem = cart.items.find(i => i.food.toString() === food);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ food, name, price, image, quantity: 1 });
    }
    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/update', protect, async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.find(i => i.food.toString() === foodId);
    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter(i => i.food.toString() !== foodId);
      } else {
        item.quantity = quantity;
      }
    }
    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/clear', protect, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;