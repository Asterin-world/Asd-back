// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  productDetails: String,
  brand: String,
  price: { type: Number, required: true },
  salePrice: Number,
  isOnSale: { type: Boolean, default: false },
  discount: Number,
  dateAdded: { type: Date, default: Date.now },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  images: [String],
  stock: { type: Number, default: 0 },
  isFeatured: {type: Boolean, default: false},
  totalSales: { type: Number, default: 0 },
  ratings: {
    average: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }
  },
  attributes: {
    strapMaterial: String,
    waterResistance: String,
    diamondType: {
      type: String,
      enum: ['Moissanite', 'Lab', 'Real'],
      default: 'Moissanite'
    },
    purity: {
      type: String,
      enum: ['10K', '14K', '18K'],
      default: '14K'
    },
    style: {
      type: String,
      enum: ['Regular', 'Hip-hop'],
      default: 'Regular'
    },
    metalType: { type: String, required: true }
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
