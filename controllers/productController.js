// controllers/productController.js
const productService = require('../services/ProductService');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const { category, subcategory } = req.query;
        const products = await productService.getAllProducts(category, subcategory);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// controllers/productController.js
const getProductsByCategory = async (req, res) => {
  try {
    const { category, subcategory } = req.params;
    const { sort, priceRange, page = 1, brand, style, diamondType, purity } = req.query;

    if (!category) return res.status(400).json({ error: "Category is required." });

    // Parse and validate price range
    let minPrice = 0;
    let maxPrice = Infinity;

    if (priceRange) {
      const rangeValues = priceRange.split(',').map((val) => parseFloat(val));

      // Validate if the parsed values are numbers
      if (!isNaN(rangeValues[0])) minPrice = rangeValues[0];
      if (!isNaN(rangeValues[1])) maxPrice = rangeValues[1];

      // Check if any of the values are still NaN (in case of malformed input)
      if (isNaN(minPrice) || isNaN(maxPrice)) {
        return res.status(400).json({ error: "Invalid price range values provided." });
      }
    }

    // Build the filters and sorting options
    const filters = {
      ...(subcategory ? { subcategory } : {}),
      ...(minPrice !== 0 || maxPrice !== Infinity ? { price: { $gte: minPrice, $lte: maxPrice } } : {}),
      ...(brand ? { brand: { $in: brand.split(',') } } : {}),
      ...(style ? { 'attributes.style': { $in: style.split(',') } } : {}),
      ...(diamondType ? { 'attributes.diamondType': { $in: diamondType.split(',') } } : {}),
      ...(purity ? { 'attributes.purity': { $in: purity.split(',') } } : {}),
    };

    // Define sort options
    let sortOption = {};
    switch (sort) {
      case 'price-low-to-high':
        sortOption.effectivePrice = 1;
        break;
      case 'price-high-to-low':
        sortOption.effectivePrice = -1;
        break;
      case 'alphabetical-asc':
        sortOption.title = 1;
        break;
      case 'alphabetical-desc':
        sortOption.title = -1;
        break;
      case 'date-old-to-new':
        sortOption.dateAdded = 1;
        break;
      case 'date-new-to-old':
        sortOption.dateAdded = -1;
        break;
      case 'featured':
        sortOption.isFeatured = -1; // Sort by isFeatured, showing featured products first
        break;
      case 'best-selling':
        sortOption.totalSales = -1; // Sort by totalSales, showing best-selling products first
        break;
      default:
        sortOption = {};
    }

    // Use service layer to fetch the products
    const { products, totalProducts, totalPages } = await productService.getProductsByCategory({
      category,
      subcategory,
      filters,
      sortOption,
      page: parseInt(page, 10),
      productsPerPage: 9,
    });

    // Send response with products, total count, and total pages
    res.status(200).json({ products, totalProducts, totalPages });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBestSellingAndFeaturedProducts = async (req, res) => {
  try {
      const products = await productService.getBestSellingAndFeaturedProducts();
      res.json(products);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { product_id, title, description, brand, price, salePrice, isOnSale, discount, category, subcategory, stock, ratings, images, attributes, productDetails } = req.body;
        const productData = {
            product_id,
            title,
            description,
            brand,
            price,
            salePrice,
            isOnSale,
            discount,
            category,
            subcategory,
            stock,
            attributes,
            ratings,
            images,
            productDetails
        };
        const newProduct = await productService.createProduct(productData);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an existing product
const updateProduct = async (req, res) => {
    try {
        const product_id = req.params.productId;
        const updateData = req.body;
        const images = req.files; // Array of uploaded images, if any
        const updatedProduct = await productService.updateProductById(product_id, updateData, images);
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    try {
        const product_id = req.params.productId;
        const deletedProduct = await productService.deleteProductById(product_id);
        res.json(deletedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const searchProducts = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const results = await productService.searchProducts(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching products', error });
  }
};

module.exports = { getAllProducts, getProductById, getProductsByCategory, searchProducts, getBestSellingAndFeaturedProducts, createProduct, updateProduct, deleteProduct };
