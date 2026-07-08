const express = require('express');
const { createMessage, getMessages, deleteMessage, replyMessage } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Public route to submit contact us inquiries
router.post('/', createMessage);

// Admin-only routes to list, reply, or delete
router.get('/', protect, adminOnly, getMessages);
router.post('/:id/reply', protect, adminOnly, replyMessage);
router.delete('/:id', protect, adminOnly, deleteMessage);

module.exports = router;
