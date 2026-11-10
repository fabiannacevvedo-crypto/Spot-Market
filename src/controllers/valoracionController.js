// Controlador de valoraciones: crear (usuario logueado), listar por producto,
// y resumen para el panel del comerciante (promedio + comentarios recibidos).
import { matchedData } from 'express-validator';
import { db } from '../models/index.js';
import { obtenerComercioDelUsuario } from '../utils/propiedad.js';

const { Valoracion, Producto, Usuario } = db;

export const crearValoracion = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const valoracion = await Valoracion.create({ ...data, usuarioId: req.usuario.id });
    return res.status(201).json({ ok: true, mensaje: 'Valoración registrada.', valoracion });
  } catch (error) {
    next(error);
  }
};

export const valoracionesPorProducto = async (req, res, next) => {
  try {
    const valoraciones = await Valoracion.findAll({
      where: { productoId: req.params.id },
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre'] }],
      order: [['createdAt', 'DESC']]
    });
    return res.json({ ok: true, valoraciones });
  } catch (error) {
    next(error);
  }
};

export const resumenMiComercio = async (req, res, next) => {
  try {
    const comercio = await obtenerComercioDelUsuario(req.usuario.id);
    if (!comercio) return res.status(403).json({ ok: false, mensaje: 'No tenés un comercio registrado.' });

    const productos = await Producto.findAll({
      where: { comercioId: comercio.id },
      attributes: ['id'],
      include: [
        {
          model: Valoracion,
          as: 'valoraciones',
          include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre'] }]
        }
      ]
    });

    const valoraciones = productos.flatMap((p) =>
      p.valoraciones.map((v) => ({ ...v.toJSON(), productoId: p.id }))
    );
    const promedio =
      valoraciones.length > 0
        ? Math.round(
            (valoraciones.reduce((acc, v) => acc + v.puntuacion, 0) / valoraciones.length) * 10
          ) / 10
        : null;

    return res.json({
      ok: true,
      resumen: { promedio, total: valoraciones.length, valoraciones }
    });
  } catch (error) {
    next(error);
  }
};
