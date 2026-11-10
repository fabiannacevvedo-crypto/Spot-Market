// Modelo Producto: publicado por un Comercio, con precio gestionable por día o mes.
// `vistas` se incrementa al abrir el detalle (ranking "más buscados"/vistos).
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Producto = sequelize.define(
  'Producto',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(160), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    especificaciones: { type: DataTypes.TEXT, allowNull: true },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    tipo_precio: {
      type: DataTypes.ENUM('diario', 'mensual'),
      allowNull: false,
      defaultValue: 'diario'
    },
    imagen_url: { type: DataTypes.STRING(500), allowNull: true },
    imagen_public_id: { type: DataTypes.STRING(255), allowNull: true },
    vistas: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    categoria: { type: DataTypes.STRING(80), allowNull: true },
    comercioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
  },
  { tableName: 'productos', timestamps: true }
);
