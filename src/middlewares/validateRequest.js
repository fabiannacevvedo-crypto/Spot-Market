import { validationResult } from 'express-validator';

// Middleware reutilizable: corta la petición si express-validator encontró errores,
// devolviendo el formato estándar { ok: false, mensaje, errores }.
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Error de validación en los datos enviados.',
      errores: errors.array().map((e) => ({ campo: e.path, mensaje: e.msg }))
    });
  }
  next();
};