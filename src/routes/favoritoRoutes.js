import { Router } from 'express';
import { toggleFavorito, misFavoritos } from '../controllers/favoritoController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = Router();
router.post('/:productoId', verificarToken, toggleFavorito);
router.get('/', verificarToken, misFavoritos);
export default router;
