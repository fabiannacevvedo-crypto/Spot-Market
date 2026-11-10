// Controlador de productos: listado público con filtros, detalle (incrementa vistas),
// y CRUD restringido al comerciante dueño (verificación de propiedad).
import { Op } from 'sequelize';
import { matchedData } from 'express-validator';
import { db } from '../models/index.js';
import { subirABufferCloudinary } from '../utils/cloudinaryUpload.js';
import { obtenerComercioDelUsuario, productoDelComercio } from '../utils/propiedad.js';

const { Producto, Comercio, Oferta, Valoracion } = db;

export const listarProductos = async (req, res, next) => {
  try {
    const { q, categoria, orden } = req.query;
    const where = {};
    if (q) where.nombre = { [Op.like]: `%${q}%` };
    if (categoria) where.categoria = categoria;

    let order = [['createdAt', 'DESC']];
    if (orden === 'precio_asc') order = [['precio', 'ASC']];
    if (orden === 'precio_desc') order = [['precio', 'DESC']];
    if (orden === 'nombre') order = [['nombre', 'ASC']];

    const productos = await Producto.findAll({
      where,
      order,
      include: [
        { model: Comercio, as: 'comercio', attributes: ['id', 'nombre_local', 'tipo_comercio', 'direccion', 'latitud', 'longitud'] },
        { model: Oferta, as: 'ofertas' }
      ]
    });
    return res.json({ ok: true, productos });
  } catch (error) {
    next(error);
  }
};

export const obtenerProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Incrementar vistas al abrir el detalle (para ranking de "más buscados/vistos").
    await Producto.increment('vistas', { where: { id } });
    const producto = await Producto.findByPk(id, {
      include: [
        { model: Comercio, as: 'comercio', attributes: ['id', 'nombre_local', 'tipo_comercio', 'direccion', 'telefono'] },
        { model: Oferta, as: 'ofertas' },
        {
          model: Valoracion,
          as: 'valoraciones',
          attributes: ['id', 'puntuacion', 'comentario', 'createdAt']
        }
      ]
    });
    if (!producto) return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado.' });
    return res.json({ ok: true, producto });
  } catch (error) {
    next(error);
  }
};

export const crearProducto = async (req, res, next) => {
  try {
    const comercio = await obtenerComercioDelUsuario(req.usuario.id);
    if (!comercio) return res.status(403).json({ ok: false, mensaje: 'No tenés un comercio registrado.' });

    const data = matchedData(req);
    let imagen_url = null;
    let imagen_public_id = null;
    if (req.file) {
      const subida = await subirABufferCloudinary(req.file.buffer, 'spotmarket/productos');
      imagen_url = subida.url;
      imagen_public_id = subida.public_id;
    }

    const producto = await Producto.create({
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      especificaciones: data.especificaciones || null,
      precio: data.precio,
      tipo_precio: data.tipo_precio,
      categoria: data.categoria || null,
      imagen_url,
      imagen_public_id,
      comercioId: comercio.id
    });
    return res.status(201).json({ ok: true, mensaje: 'Producto creado.', producto });
  } catch (error) {
    next(error);
  }
};

export const actualizarProducto = async (req, res, next) => {
  try {
    const comercio = await obtenerComercioDelUsuario(req.usuario.id);
    if (!comercio) return res.status(403).json({ ok: false, mensaje: 'No tenés un comercio registrado.' });

    // Verificación de propiedad: solo el dueño puede modificar.
    const producto = await productoDelComercio(req.params.id, comercio.id);
    if (!producto) return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado o no te pertenece.' });

    const data = matchedData(req, { includeOptionals: true });
    if (req.file) {
      const subida = await subirABufferCloudinary(req.file.buffer, 'spotmarket/productos');
      data.imagen_url = subida.url;
      data.imagen_public_id = subida.public_id;
    }
    await producto.update(data);
    return res.json({ ok: true, mensaje: 'Producto actualizado.', producto });
  } catch (error) {
    next(error);
  }
};

export const eliminarProducto = async (req, res, next) => {
  try {
    const comercio = await obtenerComercioDelUsuario(req.usuario.id);
    if (!comercio) return res.status(403).json({ ok: false, mensaje: 'No tenés un comercio registrado.' });
    const producto = await productoDelComercio(req.params.id, comercio.id);
    if (!producto) return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado o no te pertenece.' });
    await producto.destroy();
    return res.json({ ok: true, mensaje: 'Producto eliminado.' });
  } catch (error) {
    next(error);
  }
};
