const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { protect, adminOnly } = require('../middleware/auth');

// Place order
router.post('/', protect, async (req, res) => {
  try {
    const { items, restaurantId, restaurantName, totalAmount, deliveryFee, deliveryAddress, phone, paymentMethod, notes } = req.body;
    const order = await Order.create({
      user: req.user._id,
      restaurant: restaurantId,
      restaurantName,
      items,
      totalAmount,
      deliveryFee,
      deliveryAddress,
      phone,
      paymentMethod,
      notes
    });
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// User orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: All orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: Update order status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Cancel order (user)
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (['Delivered', 'Cancelled'].includes(order.status))
      return res.status(400).json({ message: 'Cannot cancel this order' });
    order.status = 'Cancelled';
    await order.save();
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;