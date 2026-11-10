import { Router } from 'express';
import { crearValoracion, valoracionesPorProducto, resumenMiComercio } from '../controllers/valoracionController.js';
import { validarValoracion } from '../validators/valoracionValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { verificarToken, verificarRol } from '../middlewares/auth.js';

const router = Router();
router.post('/', verificarToken, validarValoracion, validateRequest, crearValoracion);
router.get('/producto/:id', valoracionesPorProducto);
router.get('/mi-comercio', verificarToken, verificarRol('comerciante'), resumenMiComercio);
export default router;
