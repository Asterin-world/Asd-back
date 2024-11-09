// routes/productRoutes.js
const express = require('express');
const { getAllProducts, getProductById, getProductsByCategory, getBestSellingAndFeaturedProducts, searchProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const upload = require('../middlewares/upload'); // Multer middleware for handling file uploads

const router = express.Router();

// Define product routes
router.get('/', getAllProducts); // GET all products
router.get('/best-selling-featured', getBestSellingAndFeaturedProducts);
// GET Products by category and subcategory
router.get('/collection/:category/:subcategory?', getProductsByCategory);

// GET Product by ID with optional category and subcategory
router.get('/collection/:category/:subcategory?/product/:productId', getProductById);
router.get('/search', searchProducts),
router.post('/create', upload.array('images', 5), createProduct); // POST create product with image upload (limit 5 images)
router.put('/update/:productId', upload.array('images', 5), updateProduct); // PUT update product with image upload (limit 5 images)
router.delete('/delete/:productId', deleteProduct); // DELETE product by ID

module.exports = router;