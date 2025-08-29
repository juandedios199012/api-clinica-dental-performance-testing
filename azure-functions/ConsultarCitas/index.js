const fs = require('fs');
const path = require('path');

module.exports = async function (context, req) {
  const DATA_FILE = path.join(__dirname, '../../citas.json');
  let citas = [];
  if (fs.existsSync(DATA_FILE)) {
    citas = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  context.res = {
    status: 200,
    body: citas
  };
};
