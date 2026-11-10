// Calcula la distancia en kilómetros entre dos coordenadas (lat/lng) usando la
// fórmula de Haversine. Se usa en el servidor para evitar exponer lógica/keys
// y para ordenar comercios cercanos a la ubicación del usuario.
const RADIO_TIERRA_KM = 6371;
const aRad = (grados) => (grados * Math.PI) / 180;

export const distanciaKm = (lat1, lng1, lat2, lng2) => {
  const dLat = aRad(lat2 - lat1);
  const dLng = aRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRad(lat1)) * Math.cos(aRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return RADIO_TIERRA_KM * c;
};
