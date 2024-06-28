const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  watchTime: Number,
  currentCategory: String,
  currentUser: String,
}, { timestamps: true });

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
