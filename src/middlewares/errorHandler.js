// Responde 404 cuando ninguna ruta coincide, con el formato estándar de SpotMarket.
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    ok: false,
    mensaje: `La ruta ${req.method} ${req.originalUrl} no existe.`
  });
};

// Manejador global de errores: traduce errores conocidos (Sequelize, JWT, propios)
// al formato consistente { ok: false, mensaje } que usa toda la API.
export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} ->`, err.message);

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      ok: false,
      mensaje: 'Ya existe un registro con ese valor único.'
    });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      ok: false,
      mensaje: 'Error de validación en la base de datos.',
      errores: err.errors.map((e) => ({ campo: e.path, mensaje: e.message }))
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token inválido o expirado.'
    });
  }

  // Multer: tipo/tamaño de archivo inválido (configurado en feature/endpoints).
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      ok: false,
      mensaje: 'La imagen supera el tamaño máximo permitido (5 MB).'
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      ok: false,
      mensaje: err.message
    });
  }

  return res.status(500).json({
    ok: false,
    mensaje: 'Ocurrió un error interno del servidor.',
    // El detalle solo se expone en desarrollo para facilitar la depuración.
    ...(process.env.NODE_ENV === 'development' ? { detalle: err.message } : {})
  });
};