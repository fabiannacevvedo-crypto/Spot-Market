// Carga variables de entorno y expone una configuración centralizada.
// Centralizar esto evita leer process.env disperso por todo el proyecto.
import dotenv from 'dotenv';

dotenv.config();

export const env = {
  DB_NAME: process.env.DB_NAME || 'spotmarket',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASS: process.env.DB_PASS || '',
  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  PORT: Number(process.env.PORT) || 4000,
  JWT_SECRET: process.env.JWT_SECRET || 'secreto_dev_cambiar',
  NODE_ENV: process.env.NODE_ENV || 'development',
  // Orígenes permitidos para CORS (separados por coma). Necesario para cookies httpOnly.
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  // Credenciales de Cloudinary (subida de imágenes de comercios/productos).
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || ''
};
