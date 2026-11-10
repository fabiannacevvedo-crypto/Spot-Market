import { body } from 'express-validator';

export const validarValoracion = [
  body('productoId').isInt({ min: 1 }).withMessage('Producto inválido.'),
  body('puntuacion').isInt({ min: 1, max: 5 }).withMessage('La puntuación debe ser entre 1 y 5.'),
  body('comentario').optional({ values: 'falsy' }).isString().isLength({ max: 1000 })
];
