const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
  name: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  restaurantName: String,
  items: [cartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);