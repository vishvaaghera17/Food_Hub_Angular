const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  cuisine: { type: String, default: '' },
  address: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  deliveryTime: { type: String, default: '30-45 min' },
  minOrder: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isOpen: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);