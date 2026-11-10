// Middlewares de autenticación/autorización para SpotMarket.
// verificarToken: lee el JWT desde la cookie httpOnly (no desde Authorization),
// así el token no queda expuesto al JavaScript del navegador.
// verificarRol: restringe el acceso según el rol guardado en el token.
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { NOMBRE_COOKIE_JWT } from '../utils/cookie.js';

export const verificarToken = (req, res, next) => {
  const token = req.cookies?.[NOMBRE_COOKIE_JWT];

  if (!token) {
    return res.status(401).json({
      ok: false,
      mensaje: 'No hay sesión activa. Iniciá sesión para continuar.'
    });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.usuario = { id: payload.id, rol: payload.rol, email: payload.email };
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Sesión inválida o expirada.'
    });
  }
};

// Recibe uno o más roles permitidos, p. ej. verificarRol('comerciante').
export const verificarRol = (...roles) => (req, res, next) => {
  if (!req.usuario || !roles.includes(req.usuario.rol)) {
    return res.status(403).json({
      ok: false,
      mensaje: 'No tenés permisos para realizar esta acción.'
    });
  }
  next();
};
