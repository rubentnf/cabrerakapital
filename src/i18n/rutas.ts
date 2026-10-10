export type Lang = 'es' | 'en';
export const langs: Lang[] = ['es', 'en'];
export const defaultLang: Lang = 'es';

/** Cada página tiene su ruta en cada idioma. */
export const rutas = {
    inicio: { es: '/', en: '/en/' },
    servicios: { es: '/servicios/', en: '/en/services/' },
    equipo: { es: '/equipo/', en: '/en/team/' },
    porque: { es: '/porque-nosotros/', en: '/en/why-us/' },
    simulador: { es: '/simulador/', en: '/en/calculator/' },
    contacto: { es: '/contacto/', en: '/en/contact/' },
    faq: { es: '/preguntas-frecuentes/', en: '/en/faq/' },
} as const;

export type PaginaId = keyof typeof rutas;

export const ruta = (id: PaginaId, lang: Lang) => rutas[id][lang];

/** Idioma de la URL actual: /en/... es inglés; el resto, español */
export const langDe = (pathname: string): Lang =>
    pathname === '/en/' || pathname.startsWith('/en/') ? 'en' : 'es';