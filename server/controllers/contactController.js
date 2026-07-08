const Contact = require('../models/Contact');

const createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const contact = await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const replyMessage = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { replied: true, replyMessage },
      { new: true }
    );
    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createMessage, getMessages, deleteMessage, replyMessage };
