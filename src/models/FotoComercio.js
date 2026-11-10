// Modelo FotoComercio: fotos del local subidas a Cloudinary.
// En MySQL solo se guarda la referencia (url + public_id), nunca el binario.
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const FotoComercio = sequelize.define(
  'FotoComercio',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    public_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    comercioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  {
    tableName: 'fotos_comercio',
    timestamps: true
  }
);
