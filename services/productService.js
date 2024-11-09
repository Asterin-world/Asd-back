// services/productService.js
const Product = require('../models/Product');

// Get all products with optional filters for category and subcategory
const getAllProducts = async (category, subcategory) => {
    let query = {};
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    const products = await Product.find(query);
    return products;
};

// Get a single product by its ID
const getProductById = async (product_id) => {
    const product = await Product.findOne({ product_id });
    return product;
};

const getProductsByCategory = async ({ category, subcategory, filters = {}, sortOption = {}, page = 1, productsPerPage = 12 }) => {
  try {
    const skip = (page - 1) * productsPerPage; // Calculate items to skip

    // Create the base query object
    const query = {
      category: category.toLowerCase(),
      ...(subcategory && { subcategory: subcategory.toLowerCase() }),
      ...filters,
    };

    // Build the aggregation pipeline
    const pipeline = [
      { $match: query }, // Match products based on filters

      // Add effectivePrice field to use for sorting
      {
        $addFields: {
          effectivePrice: {
            $cond: { if: { $eq: ['$isOnSale', true] }, then: '$salePrice', else: '$price' },
          },
        },
      },
    ];

    // Add sorting stage to the pipeline if sortOption is provided
    if (Object.keys(sortOption).length > 0) {
      pipeline.push({ $sort: sortOption });
    }

    // Pagination stage: Skip and limit
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: productsPerPage });

    // Execute the aggregation pipeline to get products
    const products = await Product.aggregate(pipeline);

    // Get the total count of products matching the filters (without pagination)
    const totalProducts = await Product.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    // Return the products, total count, and total pages
    return { products, totalProducts, totalPages };
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
};

const getBestSellingAndFeaturedProducts = async () => {
  try {
      const products = await Product.find({ totalSales: { $gte: 0 } }) // Fetch products with sales
          .sort({ totalSales: -1, isFeatured: -1 })  // Sort by featured first, then by sales in descending order
          .limit(10)
          .exec();
      return products;
  } catch (err) {
      throw new Error('Error fetching best-selling and featured products: ' + err.message);
  }
};

// Create a new product with multiple images
const createProduct = async (productData) => {
    // Convert images to base64 and store them in the product document
    //   const imageBase64Array = images.map((image) => image.buffer.toString('base64'));
    const newProduct = new Product({
        ...productData,
    });
    const savedProduct = await newProduct.save();
    return savedProduct;
};

// Update an existing product by its ID, with optional image updates
const updateProductById = async (product_id, updateData, images) => {
    // If images are provided, convert to base64 and update the images array
    if (images) {
        const imageBase64Array = images.map((image) => image.buffer.toString('base64'));
        updateData.images = imageBase64Array;
    }
    const updatedProduct = await Product.findOneAndUpdate(
        { product_id },
        { $set: updateData },
        { new: true } // Return the updated document
    );
    return updatedProduct;
};

const searchProducts = async (query) => {
  // Split the query into individual words and join with '|' for OR matching in regex
  const regex = new RegExp(query.split(' ').join('|'), 'i'); // 'i' for case-insensitive matching

  // Search in multiple fields: title, category, subcategory, and description
  try {
    const results = await Product.find({
      $or: [
        { title: { $regex: regex } },
        { category: { $regex: regex } },
        { subcategory: { $regex: regex } },
        { description: { $regex: regex } },
      ],
    }); // Limit results to 10 for better performance

    return results;
  } catch (error) {
    throw error;
  }
};

// Delete a product by its ID
const deleteProductById = async (product_id) => {
    const deletedProduct = await Product.findOneAndDelete({ product_id });
    return deletedProduct;
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getBestSellingAndFeaturedProducts,
    createProduct,
    searchProducts,
    updateProductById,
    deleteProductById
};
