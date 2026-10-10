import { es, type Dict } from './es';
import { en } from './en';
import type { Lang } from './rutas';

export * from './rutas';

const diccionarios: Record<Lang, Dict> = { es, en };

/** Devuelve el diccionario de textos del idioma indicado */
export const useT = (lang: Lang): Dict => diccionarios[lang];