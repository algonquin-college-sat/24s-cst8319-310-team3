const express = require('express');
const router = express.Router();
const uploadImages = require('../utils/uploadImages');
const { upload } = uploadImages;

router.post(
    "/uploadImage",
    uploadImages.upload.single("file"),
    uploadImages.multerErrorHandling,
    uploadImages.handleFileUpload
  ); //For upload images in form post

  module.exports = router;