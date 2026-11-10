// Configuración de Multer para recibir imágenes en memoria (memoryStorage).
// memoryStorage: el archivo queda en req.file.buffer, lo que permite enviarlo
// directo a Cloudinary con upload_stream sin tocar el disco del servidor.
import multer from 'multer';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const fileFilter = (req, file, cb) => {
  if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
    const err = new Error('Tipo de imagen no permitido. Usá jpg, png o webp.');
    err.statusCode = 400;
    return cb(err);
  }
  cb(null, true);
};

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES },
  fileFilter
});
