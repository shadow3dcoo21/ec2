const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password: bcrypt.hashSync(password, 10) });
  await user.save();
  res.send('Usuario registrado');
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send('Credenciales incorrectas');
  }
  const token = jwt.sign({ id: user._id }, 'secretkey');
  res.send({ token });
});

module.exports = router;
