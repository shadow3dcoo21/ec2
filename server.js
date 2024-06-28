const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // Importa Axios aquí
const Video = require('./models/Video');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const dataRoutes = require('./routes/dataRoutes');
mongoose.connect('mongodb://localhost:27017/tiktok', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDBssssssssssssssss');
});

app.use(bodyParser.json());
app.use('/api', dataRoutes);
//
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));


app.get('/videos', async (req, res) => {
    try {
      const videos = await Video.find();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching videos' });
    }
  });
  

  app.post('/enviar-datos', async (req, res) => {
    try {
      const { watchTime, currentCategory, currentUser } = req.body;
      console.log('Recibiendo datos en el backend:', watchTime, currentCategory, currentUser);
  
      // Enviar los datos a la API de Python
      const response = await axios.post('http://localhost:5001/guardar-datos', {
        watchTime,
        currentCategory,
        currentUser,
      });
      console.log('Respuesta de la API de Python:', response.data);
  
      res.send('Datos enviados y procesados correctamente');
    } catch (error) {
      console.error('Error al enviar datos a la API de Python:', error);
      res.status(500).send('Error al procesar los datos');
    }
  });

// Importa y usa tu ruta de carga de videos
const uploadRouter = require('./routes/upload');
app.use('/upload', uploadRouter);

mongoose.connect('mongodb://localhost:27017/tiktok', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



//vimeo
const VIMEO_ACCESS_TOKEN = '52591b49d9b03a3a6e981c1b9acf3f6a';
app.post('/api/create-upload', async (req, res) => {
  const { name, description } = req.body;

  try {
    const response = await axios.post('https://api.vimeo.com/me/videos', {
      upload: {
        approach: 'tus',
        size: 0 // Initially 0, will be updated by the client when uploading the video
      },
      name,
      description
    }, {
      headers: {
        'Authorization': `Bearer ${VIMEO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      uploadLink: response.data.upload.upload_link,
      accessToken: VIMEO_ACCESS_TOKEN // Optionally return if needed for client-side requests
    });
  } catch (error) {
    console.error('Error creating Vimeo upload:', error);
    res.status(500).json({ success: false, error: 'Error creating Vimeo upload' });
  }
});














app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
