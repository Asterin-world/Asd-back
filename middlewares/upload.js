// middlewares/upload.js
const multer = require('multer');

// Set up storage for multer to handle file uploads in memory
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
