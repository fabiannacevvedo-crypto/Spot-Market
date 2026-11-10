// Validaciones de auth con express-validator (se usan como middleware en las rutas).
import { body } from 'express-validator';

export const validarRegistro = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
  body('email').trim().isEmail().withMessage('Ingresá un correo válido.').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres.')
];

export const validarRegistroComercio = [
  body('nombre').trim().notEmpty().withMessage('El nombre del responsable es obligatorio.'),
  body('nombre_local').trim().notEmpty().withMessage('El nombre del local es obligatorio.'),
  body('tipo_comercio').trim().notEmpty().withMessage('Seleccioná el tipo de comercio.'),
  body('tipos_productos').optional({ values: 'falsy' }).isString(),
  body('telefono').optional({ values: 'falsy' }).isString(),
  body('email').trim().isEmail().withMessage('Ingresá un correo válido.').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres.'),
  body('direccion').optional({ values: 'falsy' }).isString(),
  body('latitud')
    .optional({ values: 'falsy' })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitud inválida.'),
  body('longitud')
    .optional({ values: 'falsy' })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitud inválida.')
];

export const validarLogin = [
  body('email').trim().isEmail().withMessage('Ingresá un correo válido.').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria.')
];
