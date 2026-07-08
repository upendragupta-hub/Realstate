const express = require('express');
const upload = require('../utils/multerConfig');
const cloudinary = require('../utils/cloudinaryConfig');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @desc    Upload multiple images to Cloudinary
 * @route   POST /api/upload
 * @access  Protected
 */
router.post('/', protect, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images provided' });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'realstate/properties' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      urls: imageUrls,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Image upload failed', error: error.message });
  }
});

module.exports = router;
