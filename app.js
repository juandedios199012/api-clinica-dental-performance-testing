
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

// Permitir CORS para todas las rutas
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const DATA_FILE = path.join(__dirname, 'citas.json');


// Endpoint para registrar cita
app.post('/api/citas', (req, res) => {
  const nuevaCita = req.body;
  let citas = [];
  if (fs.existsSync(DATA_FILE)) {
    citas = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  citas.push(nuevaCita);
  fs.writeFileSync(DATA_FILE, JSON.stringify(citas, null, 2));
  res.status(201).json({ mensaje: 'Cita registrada', cita: nuevaCita });
});

// Endpoint para consultar todas las citas
app.get('/api/citas', (req, res) => {
  let citas = [];
  if (fs.existsSync(DATA_FILE)) {
    citas = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  res.json(citas);
});

app.listen(3000, () => {
  console.log('API de citas corriendo en http://localhost:3000');
});
