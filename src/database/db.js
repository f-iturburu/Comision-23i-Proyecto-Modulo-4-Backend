
import mongoose from "mongoose";
import { CONNECTION_STRING } from "../config.js";

console.log(CONNECTION_STRING);

mongoose.connect(CONNECTION_STRING);

// Manejar los eventos de conexión y error
mongoose.connection.on('connected', () => {
  console.log('Conectado a la base de datos de MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`Error de conexión a la base de datos de MongoDB: ${err}`);
});