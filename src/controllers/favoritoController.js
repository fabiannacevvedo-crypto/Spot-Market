// Controlador de favoritos: toggle (agregar/quitar) y listado del usuario autenticado.
import { db } from '../models/index.js';
const { Favorito, Usuario, Producto, Comercio } = db;

export const toggleFavorito = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const productoId = parseInt(req.params.productoId, 10);
    const existente = await Favorito.findOne({ where: { usuarioId, productoId } });
    if (existente) {
      await existente.destroy();
      return res.json({ ok: true, mensaje: 'Quitado de favoritos.', favorito: false });
    }
    await Favorito.create({ usuarioId, productoId });
    return res.status(201).json({ ok: true, mensaje: 'Agregado a favoritos.', favorito: true });
  } catch (error) {
    next(error);
  }
};

export const misFavoritos = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      include: [
        {
          model: Producto,
          as: 'favoritos',
          include: [{ model: Comercio, as: 'comercio', attributes: ['id', 'nombre_local'] }]
        }
      ]
    });
    return res.json({ ok: true, productos: usuario?.favoritos || [] });
  } catch (error) {
    next(error);
  }
};
