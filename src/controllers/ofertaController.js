// Controlador de ofertas. GET público devuelve solo ofertas vigentes (filtro por fecha, sin cron).
// Crear/editar/eliminar: solo el comerciante dueño del producto.
import { Op } from 'sequelize';
import { matchedData } from 'express-validator';
import { db } from '../models/index.js';
import { obtenerComercioDelUsuario, productoDelComercio } from '../utils/propiedad.js';

const { Oferta, Producto, Comercio } = db;

const whereVigente = () => {
  const ahora = new Date();
  return { fecha_inicio: { [Op.lte]: ahora }, fecha_fin: { [Op.gte]: ahora } };
};

export const listarOfertasVigentes = async (req, res, next) => {
  try {
    const ofertas = await Oferta.findAll({
      where: whereVigente(),
      include: [
        {
          model: Producto,
          as: 'producto',
          include: [{ model: Comercio, as: 'comercio', attributes: ['id', 'nombre_local'] }]
        }
      ],
      order: [['fecha_fin', 'ASC']]
    });
    return res.json({ ok: true, ofertas });
  } catch (error) {
    next(error);
  }
};

export const crearOferta = async (req, res, next) => {
  try {
    const comercio = await obtenerComercioDelUsuario(req.usuario.id);
    if (!comercio) return res.status(403).json({ ok: false, mensaje: 'No tenés un comercio registrado.' });
    const data = matchedData(req);
    const producto = await productoDelComercio(data.productoId, comercio.id);
    if (!producto) return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado o no te pertenece.' });
    const oferta = await Oferta.create(data);
    return res.status(201).json({ ok: true, mensaje: 'Oferta creada.', oferta });
  } catch (error) {
    next(error);
  }
};

export const actualizarOferta = async (req, res, next) => {
  try {
    const comercio = await obtenerComercioDelUsuario(req.usuario.id);
    if (!comercio) return res.status(403).json({ ok: false, mensaje: 'No tenés un comercio registrado.' });
    const oferta = await Oferta.findByPk(req.params.id, { include: [{ model: Producto, as: 'producto' }] });
    if (!oferta || oferta.producto.comercioId !== comercio.id) {
      return res.status(404).json({ ok: false, mensaje: 'Oferta no encontrada o no te pertenece.' });
    }
    await oferta.update(req.body);
    return res.json({ ok: true, mensaje: 'Oferta actualizada.', oferta });
  } catch (error) {
    next(error);
  }
};

export const eliminarOferta = async (req, res, next) => {
  try {
    const comercio = await obtenerComercioDelUsuario(req.usuario.id);
    if (!comercio) return res.status(403).json({ ok: false, mensaje: 'No tenés un comercio registrado.' });
    const oferta = await Oferta.findByPk(req.params.id, { include: [{ model: Producto, as: 'producto' }] });
    if (!oferta || oferta.producto.comercioId !== comercio.id) {
      return res.status(404).json({ ok: false, mensaje: 'Oferta no encontrada o no te pertenece.' });
    }
    await oferta.destroy();
    return res.json({ ok: true, mensaje: 'Oferta eliminada.' });
  } catch (error) {
    next(error);
  }
};
