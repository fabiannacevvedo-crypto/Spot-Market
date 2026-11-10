// Controlador de autenticación de SpotMarket.
// Maneja registro (usuario/comerciante), login, logout y sesión actual.
// El JWT se guarda en una cookie httpOnly (no en el body) para reducir exposición a XSS.
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { matchedData } from 'express-validator';
import { db } from '../models/index.js';
import { env } from '../config/env.js';
import { cookieJwtOpciones, NOMBRE_COOKIE_JWT } from '../utils/cookie.js';
import { subirABufferCloudinary } from '../utils/cloudinaryUpload.js';

const { Usuario, Comercio, FotoComercio } = db;

const generarToken = (usuario) =>
  jwt.sign({ id: usuario.id, rol: usuario.rol, email: usuario.email }, env.JWT_SECRET, {
    expiresIn: '8h'
  });

const datosUsuarioPublicos = (usuario) => ({
  id: usuario.id,
  nombre: usuario.nombre,
  email: usuario.email,
  rol: usuario.rol
});

export const registrar = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const email = data.email.toLowerCase();

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ ok: false, mensaje: 'El correo ya está registrado.' });
    }

    const hash = await bcrypt.hash(data.password, 10);
    const usuario = await Usuario.create({
      nombre: data.nombre,
      email,
      password: hash,
      rol: 'usuario'
    });

    const token = generarToken(usuario);
    res.cookie(NOMBRE_COOKIE_JWT, token, cookieJwtOpciones());

    return res.status(201).json({
      ok: true,
      mensaje: 'Cuenta creada correctamente.',
      usuario: datosUsuarioPublicos(usuario)
    });
  } catch (error) {
    next(error);
  }
};

export const registrarComercio = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const email = data.email.toLowerCase();

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ ok: false, mensaje: 'El correo ya está registrado.' });
    }

    // Hash de contraseña: nunca se guarda en texto plano.
    const hash = await bcrypt.hash(data.password, 10);
    const usuario = await Usuario.create({
      nombre: data.nombre,
      email,
      password: hash,
      rol: 'comerciante'
    });

    const tiposProductos = Array.isArray(data.tipos_productos)
      ? data.tipos_productos.join(',')
      : data.tipos_productos || null;

    const comercio = await Comercio.create({
      nombre_local: data.nombre_local,
      tipo_comercio: data.tipo_comercio,
      tipos_productos: tiposProductos,
      telefono: data.telefono || null,
      email,
      direccion: data.direccion || null,
      latitud: data.latitud || null,
      longitud: data.longitud || null,
      usuarioId: usuario.id
    });

    // Fotos opcionales: se suben a Cloudinary y se guarda solo url + public_id.
    const archivos = req.files || [];
    for (const archivo of archivos) {
      const subida = await subirABufferCloudinary(archivo.buffer, 'spotmarket/comercios');
      await FotoComercio.create({
        url: subida.url,
        public_id: subida.public_id,
        comercioId: comercio.id
      });
    }

    const token = generarToken(usuario);
    res.cookie(NOMBRE_COOKIE_JWT, token, cookieJwtOpciones());

    return res.status(201).json({
      ok: true,
      mensaje: 'Comercio registrado correctamente.',
      usuario: { ...datosUsuarioPublicos(usuario), comercioId: comercio.id, nombre_local: comercio.nombre_local }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = matchedData(req);
    const usuario = await Usuario.findOne({
      where: { email: email.toLowerCase() },
      include: [{ model: Comercio, as: 'comercio', attributes: ['id', 'nombre_local'] }]
    });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas.' });
    }

    const token = generarToken(usuario);
    res.cookie(NOMBRE_COOKIE_JWT, token, cookieJwtOpciones());

    const payload = { ...datosUsuarioPublicos(usuario) };
    if (usuario.comercio) {
      payload.comercioId = usuario.comercio.id;
      payload.nombre_local = usuario.comercio.nombre_local;
    }

    return res.status(200).json({ ok: true, mensaje: 'Inicio de sesión correcto.', usuario: payload });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  // Limpiar la cookie equivale a cerrar la sesión en este esquema basado en cookie.
  res.clearCookie(NOMBRE_COOKIE_JWT, { ...cookieJwtOpciones(), maxAge: undefined });
  return res.status(200).json({ ok: true, mensaje: 'Sesión cerrada.' });
};

export const me = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ['id', 'nombre', 'email', 'rol'],
      include: [{ model: Comercio, as: 'comercio', attributes: ['id', 'nombre_local'] }]
    });
    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
    }
    const payload = datosUsuarioPublicos(usuario);
    if (usuario.comercio) {
      payload.comercioId = usuario.comercio.id;
      payload.nombre_local = usuario.comercio.nombre_local;
    }
    return res.status(200).json({ ok: true, usuario: payload });
  } catch (error) {
    next(error);
  }
};
