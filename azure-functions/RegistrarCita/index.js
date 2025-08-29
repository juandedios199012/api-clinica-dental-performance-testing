const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "clinicadentalptcosmosdb"; // Cambia por el nombre real de tu base de datos
const containerId = "cita";

module.exports = async function (context, req) {
  const client = new CosmosClient({ endpoint, key });
  const cita = req.body;
  cita.id = cita.id || Date.now().toString(); // Asegura un id único

  try {
    const container = client.database(databaseId).container(containerId);
    await container.items.create(cita);
    context.res = {
      status: 201,
      body: { mensaje: "Cita registrada", cita }
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { error: error.message }
    };
  }
};
