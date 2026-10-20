const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
  name: String,
  price: Number,
  quantity: Number,
  image: String
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  restaurantName: String,
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  deliveryAddress: { type: String, required: true },
  phone: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);