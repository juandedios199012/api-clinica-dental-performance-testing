const fs = require('fs');
const path = require('path');

module.exports = async function (context, req) {
  const DATA_FILE = path.join(__dirname, '../../citas.json');
  const nuevaCita = req.body;
  let citas = [];
  if (fs.existsSync(DATA_FILE)) {
    citas = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  citas.push(nuevaCita);
  fs.writeFileSync(DATA_FILE, JSON.stringify(citas, null, 2));
  context.res = {
    status: 201,
    body: { mensaje: 'Cita registrada', cita: nuevaCita }
  };
};
