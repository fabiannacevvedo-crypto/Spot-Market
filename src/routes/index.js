// Enrutador principal de la API SpotMarket (prefijo /api).
import { Router } from 'express';
import authRoutes from './authRoutes.js';
import productoRoutes from './productoRoutes.js';
import ofertaRoutes from './ofertaRoutes.js';
import comercioRoutes from './comercioRoutes.js';
import favoritoRoutes from './favoritoRoutes.js';
import valoracionRoutes from './valoracionRoutes.js';
import { verificarToken, verificarRol } from '../middlewares/auth.js';
import { masBuscados } from '../controllers/comercioController.js';

const router = Router();

router.get('/salud', (req, res) => {
  res.status(200).json({ ok: true, mensaje: 'API SpotMarket operativa.' });
});

router.use('/auth', authRoutes);
router.use('/productos', productoRoutes);
router.use('/ofertas', ofertaRoutes);
router.use('/comercios', comercioRoutes);
router.use('/favoritos', favoritoRoutes);
router.use('/valoraciones', valoracionRoutes);
// Alias según enunciado: GET /api/comercio/mas-buscados
router.get('/comercio/mas-buscados', verificarToken, verificarRol('comerciante'), masBuscados);

export default router;
