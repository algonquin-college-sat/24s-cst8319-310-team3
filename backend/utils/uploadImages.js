const fs = require('fs');
const path = require('path');
const multer = require('multer');
// const { multerErrorHandling } = require('../controllers/eventController');

// Directory for image uploads
const uploadDirImages = "public/images";

// Check if the directory exists, if not, create it
if (!fs.existsSync(uploadDirImages)) {
    fs.mkdirSync(uploadDirImages, { recursive: true });
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirImages); // Use the uploads directory
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname); // Create a unique filename
    },
});

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new Error("Not an image! Please upload only images."), false);
    }
};

// Set up the multer object for filtering file size
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB max file size
    },
    fileFilter: fileFilter,
});

// Route to handle file upload
async function handleFileUpload(req, res) {
    try {
        // Extract filename from the uploaded file path
        const filename = path.basename(req.file.path);

        // Construct the new URL
        const imageUrl = `http://localhost:3000/images/${filename}`;

        // Use the new imageUrl in the response
        res.status(200).json({
            status: "success",
            message: "File uploaded successfully",
            imageUrl: imageUrl, // Updated to use the new URL
        });
        console.log("Image uploaded successfully");
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
        console.log("Error uploading image");
    }
}

// Multer error handling middleware
exports.multerErrorHandling = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ status: "fail", message: "File size exceeds limit. Max 5MB allowed." });
    } else {
      next(err);
    }
  };

module.exports = {
    upload,
    handleFileUpload,
};