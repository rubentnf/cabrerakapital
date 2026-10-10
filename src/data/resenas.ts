export interface Resena {
    nombre: string;
    texto: string;
    estrellas: 1 | 2 | 3 | 4 | 5;
    /** Texto libre, por ejemplo "hace 2 meses". Opcional. */
    fecha?: string;
}

/** Enlace a la ficha de Google del negocio y, si se quiere, la nota media y el total de reseñas. */
export const google = {
    enlace: 'https://www.google.com/maps/search/?api=1&query=Cabrera+Kapital+La+Laguna',
    puntuacion: null as number | null, // por ejemplo 5.0
    total: null as number | null, // por ejemplo 27
};

/**
 * Reseñas que se muestran en el carrusel. Copiar el texto tal cual aparece en Google
 * y pedir permiso al cliente. Si la lista está vacía, la sección no se muestra.
 * Las tres de abajo son marcadores: sustituirlas por las reales.
 */
export const resenas: Resena[] = [];