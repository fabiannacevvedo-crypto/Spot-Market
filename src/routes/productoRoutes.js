import { Router } from 'express';
import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productoController.js';
import { validarCrearProducto, validarActualizarProducto } from '../validators/productoValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { verificarToken, verificarRol } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/', listarProductos);
router.get('/:id', obtenerProducto);
router.post(
  '/',
  verificarToken,
  verificarRol('comerciante'),
  upload.single('imagen'),
  validarCrearProducto,
  validateRequest,
  crearProducto
);
router.put(
  '/:id',
  verificarToken,
  verificarRol('comerciante'),
  upload.single('imagen'),
  validarActualizarProducto,
  validateRequest,
  actualizarProducto
);
router.delete('/:id', verificarToken, verificarRol('comerciante'), eliminarProducto);

export default router;
