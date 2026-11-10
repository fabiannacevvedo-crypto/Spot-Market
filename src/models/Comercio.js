// Modelo Comercio: perfil público del local de un comerciante.
// Guarda ubicación (lat/lng) para el mapa y el cálculo de cercanía con Haversine.
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Comercio = sequelize.define(
  'Comercio',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    nombre_local: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    tipo_comercio: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    tipos_productos: {
      // Lista de rubros/productos que vende; se guarda como texto (CSV/JSON simple).
      type: DataTypes.TEXT,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: true,
      validate: { isEmail: true }
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    latitud: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true
    },
    longitud: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true
    },
    usuarioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: 'comercios',
    timestamps: true
  }
);
