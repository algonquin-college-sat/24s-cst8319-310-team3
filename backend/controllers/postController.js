const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const postModel = require('../models/postModel');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { upload, handleFileUpload } = require('../utils/uploadImages'); // Import from uploadImages.js

//CRUD methods for post

// Set up storage for uploaded files
const storage = multer.memoryStorage(); // Use memory storage for simplicity

// const uploadFile = multer({ storage: storage });

// Insert a post
exports.addPost = [
    upload.none(), // Use multer to parse form-data without file uploads
    async (req, res) => {
      console.log('Request body in AddPost', req.body);
      const { content, subject } = req.body;
      console.log('content:', content);
      console.log('subject:', subject);
      const post = new postModel({ content, subject });
  
      try {
        const savedPost = await post.save();
        console.log('Post saved successfully', savedPost);
        res.status(200).json(savedPost);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    }
  ];

//Get all post
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.find({});
        res.status(200).json(posts);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'An error occurred while fetching posts.' });
    }
};

exports.updatePost = async (req, res) => {
    const postId = req.params.id;
    const updateData = req.body;
    try {
        const updatedPost = await postModel.findByIdAndUpdate(postId, updateData, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found to update.' });
        }
        res.status(200).json(updatedPost);
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the post.' });
    }
}

//Delete a post

exports.deletePost = async (req, res) => {

    const postId = req.params.id;

    try {
        const deletedPost = await postModel.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found to delete.' });
        }
        res.status(200).json(deletedPost);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the post.' });
    }
}

//Get post by ID

exports.getPostById = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the post.' });
    }
}


// Method to get posts filtered by role
exports.getPostByRole = async (req, res) => {
    const roleId = req.params.role;
    try {
        // Directly find posts with the role ObjectID
        const posts = await postModel.find({ roles: roleId }).populate('roles');
        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this role.' });
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the posts.' });
    }
};



const uploadDirFiles = "public/files/posts"; // Adjusted to use the public directory

// Check if the directory exists, if not, create it
if (!fs.existsSync(uploadDirFiles)) {
    fs.mkdirSync(uploadDirFiles, { recursive: true });
  }

// Set up storage for uploaded documents
const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDocDir); // Use the document uploads directory
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname); // Create a unique filename
    },
});

// Define a new file filter for documents
const documentFileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype === "application/msword" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        cb(null, true);
    } else {
        cb(new Error("Not a document! Please upload only PDF, DOC, or DOCX files."), false);
    }
};

// Set up multer for document uploads
const uploadDocuments = multer({
    storage: documentStorage,
    limits: {
        fileSize: 1024 * 1024 * 10, // 10MB max file size
    },
    fileFilter: documentFileFilter,
});

// New handleFileUpload function for documents
async function handleDocumentUpload(req, res) {
    try {
        const filename = path.basename(req.file.path);
        const documentUrl = `http://localhost:3000/documents/${filename}`;
        res.status(200).json({
            status: "success",
            message: "Document uploaded successfully",
            documentUrl: documentUrl,
        });
        console.log("Document uploaded successfully");
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
        console.log("Error uploading document");
    }
}

exports.handleFileUpload = handleFileUpload;
exports.uploadDocuments = uploadDocuments;
exports.handleDocumentUpload = handleDocumentUpload;
exports.upload = upload;