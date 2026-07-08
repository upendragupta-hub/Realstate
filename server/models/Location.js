const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, 'Please provide a city name'],
      trim: true,
      unique: true,
    },
    state: {
      type: String,
      required: [true, 'Please provide a state name'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Location', locationSchema);
