import { Router } from 'express';
import {
  listarComercios,
  obtenerComercio,
  comerciosCercanos,
  actualizarComercio,
  masBuscados
} from '../controllers/comercioController.js';
import { verificarToken, verificarRol } from '../middlewares/auth.js';

const router = Router();
// Rutas específicas antes de /:id para que no las capture el parámetro.
router.get('/cercanos', comerciosCercanos);
router.get('/mas-buscados', verificarToken, verificarRol('comerciante'), masBuscados);
router.get('/', listarComercios);
router.get('/:id', obtenerComercio);
router.put('/:id', verificarToken, verificarRol('comerciante'), actualizarComercio);
export default router;
