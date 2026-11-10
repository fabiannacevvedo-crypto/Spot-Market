// Seed de datos de ejemplo: 5 comercios en Formosa Capital y ~20 productos.
// Ejecutar con: npm run seed (requiere MySQL y .env configurado).
import bcrypt from 'bcryptjs';
import { sequelize } from './config/db.js';
import { db } from './models/index.js';

const { Usuario, Comercio, FotoComercio, Producto, Oferta, Valoracion } = db;

const comerciosData = [
  { nombre_local: 'Almacén Don Pepe', tipo_comercio: 'Almacén', tipos_productos: 'Alimentos,Bebidas,Limpieza', direccion: 'Av. 25 de Mayo 450', latitud: -26.1851, longitud: -58.1753, tel: '3704-111001' },
  { nombre_local: 'Carnicería El Gaucho', tipo_comercio: 'Carnicería', tipos_productos: 'Carnes', direccion: 'Calle Brandsen 320', latitud: -26.1825, longitud: -58.1688, tel: '3704-111002' },
  { nombre_local: 'Panadería La Espiga', tipo_comercio: 'Panadería', tipos_productos: 'Panadería,Alimentos', direccion: 'Av. Gutnisky 980', latitud: -26.1779, longitud: -58.1782, tel: '3704-111003' },
  { nombre_local: 'Verdulería Los Hermanos', tipo_comercio: 'Verdulería', tipos_productos: 'Frutas y Verduras', direccion: 'Calle Moreno 210', latitud: -26.1888, longitud: -58.1710, tel: '3704-111004' },
  { nombre_local: 'Supermercado Formosa', tipo_comercio: 'Supermercado', tipos_productos: 'Alimentos,Bebidas,Lácteos,Limpieza', direccion: 'Av. Italia 1200', latitud: -26.1905, longitud: -58.1655, tel: '3704-111005' }
];

const productosBase = [
  ['Aceite Girasol 900ml','Alimentos',2890],['Arroz Largo Fino 1kg','Alimentos',1450],['Azúcar 1kg','Alimentos',1350],
  ['Leche Entera 1L','Lácteos',1200],['Yogur Bebible 1L','Lácteos',2100],['Queso Cremoso 500g','Lácteos',4600],
  ['Pan Francés kg','Panadería',1800],['Facturas x6','Panadería',3200],['Carne Picada kg','Carnes',5900],
  ['Asado kg','Carnes',7200],['Tomate kg','Frutas y Verduras',1600],['Papa kg','Frutas y Verduras',900],
  ['Banana kg','Frutas y Verduras',1400],['Coca Cola 2.25L','Bebidas',3100],['Agua Mineral 2L','Bebidas',1100],
  ['Detergente 750ml','Limpieza',2890],['Lavandina 1L','Limpieza',1200],['Jabón en Polvo 800g','Limpieza',3400],
  ['Fideos Spaghetti 500g','Alimentos',1250],['Harina 000 1kg','Alimentos',1150]
];

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('DB conectada y sincronizada.');

    const hash = await bcrypt.hash('123456', 10);

    // Usuario consumidor de ejemplo (para valoraciones)
    const [consumidor] = await Usuario.findOrCreate({
      where: { email: 'vecino@spotmarket.com' },
      defaults: { nombre: 'Vecino Ejemplo', password: hash, rol: 'usuario' }
    });

    for (let i = 0; i < comerciosData.length; i++) {
      const c = comerciosData[i];
      const email = `comercio${i + 1}@spotmarket.com`;
      const [user] = await Usuario.findOrCreate({
        where: { email },
        defaults: { nombre: c.nombre_local, password: hash, rol: 'comerciante' }
      });
      const [comercio] = await Comercio.findOrCreate({
        where: { usuarioId: user.id },
        defaults: {
          nombre_local: c.nombre_local, tipo_comercio: c.tipo_comercio, tipos_productos: c.tipos_productos,
          telefono: c.tel, email, direccion: c.direccion, latitud: c.latitud, longitud: c.longitud, usuarioId: user.id
        }
      });

      // 4 productos por comercio = 20
      const slice = productosBase.slice(i * 4, i * 4 + 4);
      for (let j = 0; j < slice.length; j++) {
        const [nombre, categoria, precio] = slice[j];
        const [prod] = await Producto.findOrCreate({
          where: { nombre, comercioId: comercio.id },
          defaults: {
            nombre, categoria, precio, tipo_precio: 'diario', descripcion: `${nombre} en ${c.nombre_local}`,
            especificaciones: 'Producto de consumo masivo', vistas: Math.floor(Math.random() * 80) + 5,
            imagen_url: `https://placehold.co/400x300/0a1222/FFC700?text=${encodeURIComponent(nombre.split(' ')[0])}`,
            imagen_public_id: `seed/${comercio.id}-${j}`, comercioId: comercio.id
          }
        });
        // Una oferta vigente en algunos productos
        if (j === 0) {
          const ahora = new Date();
          const fin = new Date(ahora.getTime() + 7 * 86400000);
          await Oferta.findOrCreate({
            where: { productoId: prod.id },
            defaults: { precio_oferta: Math.round(precio * 0.85), fecha_inicio: ahora, fecha_fin: fin, productoId: prod.id }
          });
        }
        // Valoración de ejemplo
        if (j === 1) {
          await Valoracion.findOrCreate({
            where: { productoId: prod.id, usuarioId: consumidor.id },
            defaults: { productoId: prod.id, usuarioId: consumidor.id, puntuacion: 4 + (i % 2), comentario: 'Buen precio y atención.' }
          });
        }
      }
    }

    console.log('Seed completado: 5 comercios, 20 productos (clave ejemplo: 123456).');
    process.exit(0);
  } catch (e) {
    console.error('Error en seed:', e.message);
    process.exit(1);
  }
}

run();
