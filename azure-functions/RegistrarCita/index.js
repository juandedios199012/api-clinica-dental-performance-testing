const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "clinicadentalptcosmosdb"; // Cambia por el nombre real de tu base de datos
const containerId = "cita";

module.exports = async function (context, req) {
  let cita;
  try {
    // Mostrar los valores de las variables de entorno en la respuesta para Postman
  context.log("COSMOS_DB_ENDPOINT:", endpoint);
  context.log("COSMOS_DB_KEY:", key);

    cita = req.body;
    cita.id = cita.id || Date.now().toString(); // Asegura un id único
    context.log("Objeto cita recibido para guardar:", JSON.stringify(cita));

    // Validación básica de campos requeridos
    const camposRequeridos = ["doctor", "servicio", /* "fecha", */ "hora", "comentario", "telefono", "correo", "id"];
    const faltantes = camposRequeridos.filter(campo => !cita[campo] || cita[campo].toString().trim() === "");
    if (faltantes.length > 0) {
      context.res = {
        status: 400,
        body: { error: `Faltan los siguientes campos requeridos: ${faltantes.join(", ")}`, cita, endpoint, key }
      };
      return;
    }

    // Validación de formato de hora (HH:MM)
    const horaRegex = /^\d{2}:\d{2}$/;
    if (!horaRegex.test(cita.hora)) {
      context.res = {
        status: 400,
        body: { error: "El campo 'hora' debe estar en formato HH:MM.", cita, endpoint, key }
      };
      return;
    }

    const client = new CosmosClient({ endpoint, key });
    const container = client.database(databaseId).container(containerId);
    context.log("Registrando cita en Cosmos DB...");
    context.log("Datos de la cita:", cita);
    await container.items.create(cita);
    context.log("Cita registrada correctamente.");
    context.res = {
  status: 201,
  body: { mensaje: "Cita registrada", cita, endpoint, key }
    };
  } catch (error) {
    context.log.error("Error al registrar la cita:", error);
    context.res = {
      status: 500,
      body: { error: error.message, cita, endpoint, key }
    };
  }
};
