// controllers/blogController.js
const blogService = require('../services/blogService');

// Get latest 4 blogs
exports.getLatestBlogs = async (req, res) => {
  try {
    const blogs = await blogService.getLatestBlogs();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a blog's details and 3 more latest blogs (excluding the current one)
exports.getBlogDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { blog, otherBlogs } = await blogService.getBlogDetails(id);
    res.status(200).json({ blog, otherBlogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const newBlog = await blogService.createBlog(req.body);
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
