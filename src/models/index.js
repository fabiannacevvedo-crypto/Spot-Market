// Registro central de modelos Sequelize y sus relaciones (SpotMarket).
// Se importa desde server.js para que Sequelize conozca los modelos antes de sync.
// Relaciones: Usuario1:1Comercio, Comercio1:NProducto, Producto1:NOferta,
// Producto1:NValoracion, Usuario N:M Producto (Favoritos).
import { sequelize } from '../config/db.js';
import { Usuario } from './Usuario.js';
import { Comercio } from './Comercio.js';
import { FotoComercio } from './FotoComercio.js';
import { Producto } from './Producto.js';
import { Oferta } from './Oferta.js';
import { Valoracion } from './Valoracion.js';
import { Favorito } from './Favorito.js';

// Usuario 1:1 Comercio
Usuario.hasOne(Comercio, { foreignKey: 'usuarioId', as: 'comercio' });
Comercio.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// Comercio 1:N FotoComercio
Comercio.hasMany(FotoComercio, { foreignKey: 'comercioId', as: 'fotos' });
FotoComercio.belongsTo(Comercio, { foreignKey: 'comercioId', as: 'comercio' });

// Comercio 1:N Producto
Comercio.hasMany(Producto, { foreignKey: 'comercioId', as: 'productos' });
Producto.belongsTo(Comercio, { foreignKey: 'comercioId', as: 'comercio' });

// Producto 1:N Oferta
Producto.hasMany(Oferta, { foreignKey: 'productoId', as: 'ofertas' });
Oferta.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });

// Producto 1:N Valoracion
Producto.hasMany(Valoracion, { foreignKey: 'productoId', as: 'valoraciones' });
Valoracion.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });
Usuario.hasMany(Valoracion, { foreignKey: 'usuarioId', as: 'valoraciones' });
Valoracion.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// Usuario N:M Producto (Favoritos)
Usuario.belongsToMany(Producto, { through: Favorito, foreignKey: 'usuarioId', otherKey: 'productoId', as: 'favoritos' });
Producto.belongsToMany(Usuario, { through: Favorito, foreignKey: 'productoId', otherKey: 'usuarioId', as: 'usuariosFavoritos' });

export const db = {
  sequelize,
  Usuario,
  Comercio,
  FotoComercio,
  Producto,
  Oferta,
  Valoracion,
  Favorito
};
