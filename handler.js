const serverless = require("serverless-http");
const express = require("express");
const app = express();
app.use(express.json());

app.use(require('./src/api/funcion-prueba'));

// test carga de compensaciones
app.use(require('./src/api/compensaciones/cargar-compensaciones'));

exports.handler = serverless(app);
