const express = require('express');
const Video = require('../models/Video');
const router = express.Router();

router.get('/', async (req, res) => {
  const videos = await Video.find().populate('user', 'email');
  const viewTimes = await ViewTime.find(); // Asegúrate de definir este modelo
  const videosWithViewTimes = videos.map(video => {
    const viewTime = viewTimes.find(vt => vt.video_id.toString() === video._id.toString());
    return {
      ...video.toObject(),
      viewTime: viewTime ? viewTime.view_time : '0'
    };
  });
  res.send(videosWithViewTimes);
});

module.exports = router;
