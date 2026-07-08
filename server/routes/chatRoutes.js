const express = require('express');
const { getChats, accessChat, getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getChats);
router.post('/', protect, accessChat);
router.get('/:chatId/messages', protect, getMessages);
router.post('/:chatId/messages', protect, sendMessage);

module.exports = router;
