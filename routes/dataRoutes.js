const express = require('express');
const router = express.Router();
const redis = require('redis');
const Data = require('../models/Data');

const client = redis.createClient();

client.on('error', (err) => {
  console.error('Error connecting to Redis', err);
});

router.post('/enviar-datos', async (req, res) => {
  try {
    const { watchTime, currentCategory, currentUser } = req.body;
    console.log('Recibiendo datos en el backend:', watchTime, currentCategory, currentUser);

    // Guardar datos en Redis
    const redisKey = `${currentUser}:${currentCategory}`;
    client.set(redisKey, JSON.stringify({ watchTime, currentCategory, currentUser }), redis.print);

    // Extraer datos de Redis
    client.get(redisKey, async (err, data) => {
      if (err) {
        console.error('Error retrieving data from Redis', err);
        res.status(500).send('Error retrieving data from Redis');
        return;
      }

      const parsedData = JSON.parse(data);
      console.log('Datos extraídos de Redis:', parsedData);

      // Guardar datos en MongoDB
      const newData = new Data(parsedData);
      await newData.save();

      console.log('Datos guardados en MongoDB');
      res.send('Datos enviados y procesados correctamente');
    });
  } catch (error) {
    console.error('Error al enviar datos a la API de Python:', error);
    res.status(500).send('Error al procesar los datos');
  }
});

module.exports = router;
