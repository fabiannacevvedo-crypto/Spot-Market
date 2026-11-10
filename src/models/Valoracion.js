// Modelo Valoracion: puntuación (1-5) y comentario de un Usuario sobre un Producto.
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Valoracion = sequelize.define(
  'Valoracion',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    puntuacion: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    comentario: { type: DataTypes.TEXT, allowNull: true },
    usuarioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    productoId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
  },
  { tableName: 'valoraciones', timestamps: true }
);
