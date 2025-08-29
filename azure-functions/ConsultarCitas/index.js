const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "clinicadentalptcosmosdb"; // Cambia por el nombre real de tu base de datos
const containerId = "cita";

module.exports = async function (context, req) {
  const client = new CosmosClient({ endpoint, key });

  try {
    const container = client.database(databaseId).container(containerId);
    const { resources: citas } = await container.items.readAll().fetchAll();
    context.res = {
      status: 200,
      body: citas
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { error: error.message }
    };
  }
};
