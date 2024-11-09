// services/blogService.js
const Blog = require('../models/Blog');

// Get the latest 4 blogs
const getLatestBlogs = async () => {
  return await Blog.find().sort({ createdAt: -1 }).limit(4);
};

// Get a single blog by ID and 3 other latest blogs excluding the current one
const getBlogDetails = async (id) => {
  const blog = await Blog.findById(id);
  const otherBlogs = await Blog.find({ _id: { $ne: id } }).sort({ createdAt: -1 }).limit(3);
  return { blog, otherBlogs };
};

// Create a new blog
const createBlog = async (blogData) => {
  const newBlog = new Blog(blogData);
  return await newBlog.save();
};

module.exports = {
  getLatestBlogs,
  getBlogDetails,
  createBlog,
};
