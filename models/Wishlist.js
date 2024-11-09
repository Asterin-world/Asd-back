// models/Wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  wishlist_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  products: [
    {
      product_id: { type: String, required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  updated_at: { type: Date, default: Date.now }
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;
