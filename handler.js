// Importa el módulo 'serverless-http' para permitir que Express funcione con AWS Lambda.
const serverless = require("serverless-http");
// Importa el framework 'express', que es utilizado para manejar solicitudes HTTP en Node.js.
const express = require("express");
// Crea una nueva aplicación Express. 'app' será utilizado para configurar el servidor.
const app = express();
// Utiliza el middleware 'express.json()' para parsear automáticamente cuerpos de solicitudes JSON,
app.use(express.json());

app.use(require('./src/api/funcion-prueba'));

// compensaciones test
app.use(require('./src/api/compensaciones/cargar-compensaciones'));
app.use(require('./src/api/compensaciones/nueva-compensacion'));

exports.handler = serverless(app);
