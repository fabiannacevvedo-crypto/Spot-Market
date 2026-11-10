// Ayudas para verificar propiedad: un comerciante solo puede modificar
// sus propios productos/ofertas. Centralizar esto evita repetir la lógica.
import { db } from '../models/index.js';
const { Comercio, Producto } = db;

export const obtenerComercioDelUsuario = async (usuarioId) =>
  Comercio.findOne({ where: { usuarioId } });

export const productoDelComercio = async (productoId, comercioId) =>
  Producto.findOne({ where: { id: productoId, comercioId } });
