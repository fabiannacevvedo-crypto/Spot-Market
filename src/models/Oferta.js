// Modelo Oferta: descuento temporal sobre un Producto.
// La vigencia se controla por fecha_inicio/fecha_fin; las vencidas se ocultan por consulta.
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Oferta = sequelize.define(
  'Oferta',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    precio_oferta: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    fecha_inicio: { type: DataTypes.DATE, allowNull: false },
    fecha_fin: { type: DataTypes.DATE, allowNull: false },
    productoId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
  },
  { tableName: 'ofertas', timestamps: true }
);
