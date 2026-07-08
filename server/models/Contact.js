const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      maxlength: [100, 'Subject cannot exceed 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'Please provide your message'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    replied: {
      type: Boolean,
      default: false,
    },
    replyMessage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
