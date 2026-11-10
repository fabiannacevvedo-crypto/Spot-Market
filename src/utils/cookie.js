// Opciones de la cookie donde se guarda el JWT.
// httpOnly: JS del navegador no puede leerla (mitiga robo por XSS).
// sameSite: limita envío cross-site (protección CSRF básica). secure solo en producción (HTTPS).
import { env } from '../config/env.js';

export const cookieJwtOpciones = () => ({
  httpOnly: true,
  sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
  secure: env.NODE_ENV === 'production',
  maxAge: 8 * 60 * 60 * 1000 // 8 horas, alineado al expiresIn del token
});

export const NOMBRE_COOKIE_JWT = 'token';
