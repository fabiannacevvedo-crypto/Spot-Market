// Modelo Usuario: representa cuentas del sistema.
// rol 'usuario' = consumidor (valora/comenta/favoritos); 'comerciante' = dueño de un Comercio.
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rol: {
      type: DataTypes.ENUM('usuario', 'comerciante'),
      allowNull: false,
      defaultValue: 'usuario'
    }
  },
  {
    tableName: 'usuarios',
    timestamps: true
  }
);
