import { body, query } from 'express-validator';

export const validarCrearProducto = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número válido.'),
  body('tipo_precio').isIn(['diario', 'mensual']).withMessage('Tipo de precio inválido.'),
  body('categoria').optional({ values: 'falsy' }).isString(),
  body('descripcion').optional({ values: 'falsy' }).isString(),
  body('especificaciones').optional({ values: 'falsy' }).isString()
];

export const validarActualizarProducto = [
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío.'),
  body('precio').optional().isFloat({ min: 0 }).withMessage('Precio inválido.'),
  body('tipo_precio').optional().isIn(['diario', 'mensual']).withMessage('Tipo de precio inválido.')
];
