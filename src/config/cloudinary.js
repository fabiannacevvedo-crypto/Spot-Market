// Configuración del SDK de Cloudinary (v2) para subir imágenes.
// Las credenciales vienen de .env; en MySQL se persiste solo url + public_id.
import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
});

export { cloudinary };
