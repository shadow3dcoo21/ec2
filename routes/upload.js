const express = require('express');
const router = express.Router();
const multer = require('multer');
const Video = require('../models/Video');

// Configuración para manejar la subida de archivos utilizando Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // directorio donde se guardarán los videos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // nombre original del archivo
  }
});
const upload = multer({ storage: storage });

// Ruta para subir un video
router.post('/uploadst', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se recibió ningún archivo');
  }

  // Guardar información del video en la base de datos
  const { user, category } = req.body;
  const videoUrl = req.file.path;

  try {
    const video = new Video({ user, category, videoUrl });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

