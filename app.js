// Configuración principal de Express para SpotMarket.
// Registra middlewares globales (CORS con credenciales para cookies httpOnly,
// parseo JSON, cookies, logs) y monta la API bajo el prefijo /api.
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './src/routes/index.js';
import { errorHandler, notFoundHandler } from './src/middlewares/errorHandler.js';
import { env } from './src/config/env.js';

export const app = express();

// CORS con credentials: necesario para que el navegador envíe/reciba la cookie httpOnly del JWT.
const origenesPermitidos = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: origenesPermitidos,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);
