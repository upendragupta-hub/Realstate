const Chat = require('../models/Chat');
const Message = require('../models/Message');

/**
 * @desc    Get all chats for a user
 * @route   GET /api/chats
 * @access  Protected
 */
const getChats = async (req, res) => {
  try {
    let query;
    if (req.user.role === 'admin') {
      // Admin can be on both sides — show all their chats
      query = { $or: [{ agent: req.user._id }, { buyer: req.user._id }] };
    } else if (req.user.role === 'agent') {
      query = { agent: req.user._id };
    } else {
      query = { buyer: req.user._id };
    }

    const chats = await Chat.find(query)
      .populate('buyer', 'name email profilePhoto')
      .populate('agent', 'name email profilePhoto')
      .populate('property', 'title images')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get or Create Chat
 * @route   POST /api/chats
 * @access  Protected
 */
const accessChat = async (req, res) => {
  try {
    const { agentId, propertyId } = req.body;
    const buyerId = req.user._id;

    if (!agentId || !propertyId) {
      return res.status(400).json({ success: false, message: 'Agent ID and Property ID are required' });
    }

    let chat = await Chat.findOne({
      buyer: buyerId,
      agent: agentId,
      property: propertyId,
    })
      .populate('buyer', 'name email profilePhoto')
      .populate('agent', 'name email profilePhoto')
      .populate('property', 'title images');

    if (chat) {
      return res.status(200).json({ success: true, chat });
    } else {
      const newChat = await Chat.create({
        buyer: buyerId,
        agent: agentId,
        property: propertyId,
      });

      const fullChat = await Chat.findById(newChat._id)
        .populate('buyer', 'name email profilePhoto')
        .populate('agent', 'name email profilePhoto')
        .populate('property', 'title images');

      res.status(201).json({ success: true, chat: fullChat });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get all messages for a chat
 * @route   GET /api/chats/:chatId/messages
 * @access  Protected
 */
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate('sender', 'name email profilePhoto')
      .sort({ createdAt: 1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Send a message
 * @route   POST /api/chats/:chatId/messages
 * @access  Protected
 */
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { chatId } = req.params;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    let message = await Message.create({
      chatId,
      sender: req.user._id,
      text,
    });

    message = await message.populate('sender', 'name profilePhoto');

    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getChats, accessChat, getMessages, sendMessage };
