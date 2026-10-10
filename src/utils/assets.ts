import type { ImageMetadata } from 'astro';

type Glob = Record<string, { default: ImageMetadata }>;

/** "../assets/photos/olegario.jpeg" → "olegario" */
const nombreDe = (ruta: string) => ruta.split('/').pop()!.replace(/\.[^.]+$/, '');

/** Convierte el resultado de import.meta.glob en un mapa nombre → imagen */
const porNombre = (glob: Glob) =>
    new Map(Object.entries(glob).map(([ruta, m]) => [nombreDe(ruta), m.default]));

/** Fotos de src/assets/photos, por nombre de archivo sin extensión */
export const fotos = porNombre(
    import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp,avif}', { eager: true }),
);

/** Logos de src/assets/logos, por nombre de archivo sin extensión */
export const logos = porNombre(
    import.meta.glob('../assets/logos/*.{svg,png,webp,jpg,jpeg}', { eager: true }),
);

/** "Laboral Kutxa" → "laboral-kutxa" (minúsculas, sin tildes, con guiones) */
export const slug = (s: string) =>
    s
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
