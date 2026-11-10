import { Router } from 'express';
import { listarOfertasVigentes, crearOferta, actualizarOferta, eliminarOferta } from '../controllers/ofertaController.js';
import { validarOferta } from '../validators/ofertaValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { verificarToken, verificarRol } from '../middlewares/auth.js';

const router = Router();
router.get('/', listarOfertasVigentes);
router.post('/', verificarToken, verificarRol('comerciante'), validarOferta, validateRequest, crearOferta);
router.put('/:id', verificarToken, verificarRol('comerciante'), actualizarOferta);
router.delete('/:id', verificarToken, verificarRol('comerciante'), eliminarOferta);
export default router;
