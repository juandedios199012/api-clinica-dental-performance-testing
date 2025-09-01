const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "clinicadentalptcosmosdb"; // Cambia por el nombre real de tu base de datos
const containerId = "cita";

module.exports = async function (context, req) {
  const client = new CosmosClient({ endpoint, key });
  const cita = req.body;
  cita.id = cita.id || Date.now().toString(); // Asegura un id único

  // Validación básica de campos requeridos
  const camposRequeridos = ["doctor", "servicio", "fecha", "hora", "comentario", "telefono", "correo", "id"];
  const faltantes = camposRequeridos.filter(campo => !cita[campo] || cita[campo].toString().trim() === "");
  if (faltantes.length > 0) {
    context.res = {
      status: 400,
      body: { error: `Faltan los siguientes campos requeridos: ${faltantes.join(", ")}` }
    };
    return;
  }

  // Validación de formato de fecha (acepta AAAA-MM-DD o DD-MM-AAAA)
  const fechaRegex = /^(\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})$/;
  if (!fechaRegex.test(cita.fecha)) {
    context.res = {
      status: 400,
      body: { error: "El campo 'fecha' debe estar en formato AAAA-MM-DD o DD-MM-AAAA." }
    };
    return;
  }

  // Validación de formato de hora (HH:MM)
  const horaRegex = /^\d{2}:\d{2}$/;
  if (!horaRegex.test(cita.hora)) {
    context.res = {
      status: 400,
      body: { error: "El campo 'hora' debe estar en formato HH:MM." }
    };
    return;
  }

  try {
    const container = client.database(databaseId).container(containerId);
    context.log("Registrando cita en Cosmos DB...");
    context.log("Datos de la cita:", cita);
    await container.items.create(cita);
    context.log("Cita registrada correctamente.");
    context.res = {
      status: 201,
      body: { mensaje: "Cita registrada", cita }
    };
  } catch (error) {
    context.log.error("Error al registrar la cita:", error);
    context.res = {
      status: 500,
      body: { error: error.message }
    };
  }
};
