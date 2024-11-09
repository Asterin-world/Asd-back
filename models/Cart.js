// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  cart_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  products: [
    {
      product_id: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, default: 0 },
  updated_at: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
