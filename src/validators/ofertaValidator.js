import { body } from 'express-validator';

export const validarOferta = [
  body('productoId').isInt({ min: 1 }).withMessage('Producto inválido.'),
  body('precio_oferta').isFloat({ min: 0 }).withMessage('Precio de oferta inválido.'),
  body('fecha_inicio').isISO8601().withMessage('Fecha de inicio inválida.'),
  body('fecha_fin').isISO8601().withMessage('Fecha de fin inválida.')
];
