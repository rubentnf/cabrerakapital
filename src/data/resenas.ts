export interface Resena {
    nombre: string;
    texto: string;
    estrellas: 1 | 2 | 3 | 4 | 5;
    /** Texto libre, por ejemplo "hace 2 meses". Opcional. */
    fecha?: string;
}

/**
 * De dónde salen las reseñas de la sección «Opiniones»:
 * - 'google': automáticas. La nota, el total y hasta 5 reseñas (las elige Google) se cargan de
 *   /api/resenas (server/resenas.mjs), que necesita GOOGLE_PLACES_KEY en Cloudflare.
 * - 'manual': las de la lista `resenas` de abajo; de Google solo se cargan la nota y el total.
 * Si Google no responde (o en `astro dev`, donde no existe /api), se usan la lista y los datos de
 * abajo; si la lista está vacía, la sección no se muestra.
 */
export const modo: 'google' | 'manual' = 'google';

/** Enlace a la ficha de Google del negocio y, si se quiere, la nota media y el total de reseñas. */
export const google = {
    enlace: 'https://www.google.com/maps/search/?api=1&query=Cabrera+Kapital+La+Laguna',
    puntuacion: null as number | null, // por ejemplo 5.0
    total: null as number | null, // por ejemplo 27
};

/**
 * Reseñas escritas a mano (modo 'manual', o mientras Google no responde). Copiar el texto tal cual
 * aparece en Google y pedir permiso al cliente. Ejemplo:
 *   { nombre: 'María G.', texto: 'Nos consiguieron mejor hipoteca que nuestro banco…', estrellas: 5, fecha: 'hace 2 meses' },
 */
export const resenas: Resena[] = [];
