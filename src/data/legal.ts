import type { Lang } from '../i18n';

/**
 * Textos legales. Cada documento es una página de la web cuyo contenido está en src/legal/<slug>.md.
 * Los textos de los enlaces están en src/i18n (clave "documentos").
 */
export type DocumentoId =
    'previa' | 'independencia' | 'aviso' | 'remuneracion' | 'privacidad' | 'exencion';

export const slugs: Record<DocumentoId, string> = {
    previa: 'informacion-previa-al-cliente',
    independencia: 'declaracion-de-independencia',
    aviso: 'aviso-legal',
    remuneracion: 'informacion-sobre-remuneracion',
    privacidad: 'politica-de-privacidad',
    exencion: 'clausula-de-exencion-de-responsabilidad',
};

export const ids = Object.keys(slugs) as DocumentoId[];

/** Dirección de la página de cada documento: /legal/<slug>/ en español y /en/legal/<slug>/ en inglés. */
export const rutaLegal = (id: DocumentoId, lang: Lang) =>
    `${lang === 'en' ? '/en' : ''}/legal/${slugs[id]}/`;

/** Columna «Información» del pie (después va el enlace a Preguntas frecuentes). */
export const grupoInformacion: DocumentoId[] = ['previa', 'independencia', 'aviso', 'remuneracion'];

/** Columna «Legal» del pie. */
export const grupoLegal: DocumentoId[] = ['privacidad', 'exencion'];