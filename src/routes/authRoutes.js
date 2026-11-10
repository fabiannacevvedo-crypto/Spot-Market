// Rutas de autenticación (/api/auth): registro, registro de comercio, login, logout y sesión actual.
import { Router } from 'express';
import {
  registrar,
  registrarComercio,
  login,
  logout,
  me
} from '../controllers/authController.js';
import { validarRegistro, validarRegistroComercio, validarLogin } from '../validators/authValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { verificarToken } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.post('/register', validarRegistro, validateRequest, registrar);

// register-comercio recibe multipart/form-data (texto + fotos).
// Multer corre primero para poblar req.body/req.files antes de validar.
router.post(
  '/register-comercio',
  upload.array('fotos', 8),
  validarRegistroComercio,
  validateRequest,
  registrarComercio
);

router.post('/login', validarLogin, validateRequest, login);
router.post('/logout', verificarToken, logout);
router.get('/me', verificarToken, me);

export default router;
