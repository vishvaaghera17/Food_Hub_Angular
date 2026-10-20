const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  isAvailable: { type: Boolean, default: true },
  isVeg: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  preparationTime: { type: String, default: '15-20 min' }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);