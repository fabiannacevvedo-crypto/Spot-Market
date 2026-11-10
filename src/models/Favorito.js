// Modelo Favorito: tabla intermedia N:M entre Usuario y Producto (toggle de "me gusta"/guardar).
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Favorito = sequelize.define(
  'Favorito',
  {
    usuarioId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    productoId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true }
  },
  { tableName: 'favoritos', timestamps: true }
);
