const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  user: { type: String, required: true },
  category: { type: String, required: true },
  videoUrl: { type: String, required: true }, // Cambiado de 'url' a 'videoUrl'
});

module.exports = mongoose.model('Video', videoSchema);
