// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Route to get the latest 4 blogs
router.get('/latest', blogController.getLatestBlogs);

// Route to get blog details and 3 more latest blogs (excluding the current one)
router.get('/:id', blogController.getBlogDetails);

// Route to create a new blog
router.post('/create', blogController.createBlog);

module.exports = router;
