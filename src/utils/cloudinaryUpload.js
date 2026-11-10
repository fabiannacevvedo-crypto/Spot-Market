// Sube un archivo (buffer de Multer memoryStorage) a Cloudinary usando upload_stream.
// Se usa stream (no disco temporal) porque Multer guarda en memoria y así no
// escribimos archivos locales; en MySQL solo persistimos url + public_id.
import { cloudinary } from '../config/cloudinary.js';

export const subirABufferCloudinary = (buffer, carpeta = 'spotmarket') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: carpeta, resource_type: 'image' },
      (error, resultado) => {
        if (error) return reject(error);
        resolve({ url: resultado.secure_url, public_id: resultado.public_id });
      }
    );
    stream.end(buffer);
  });
