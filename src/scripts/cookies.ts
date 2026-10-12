import { $, $$ } from './utils';

/**
 * Consentimiento de cookies. La única cookie no necesaria de la web es la del mapa de Google
 * (Umami no usa cookies), así que hay una sola decisión: mapas sí o no.
 * La respuesta se guarda en localStorage durante 12 meses; después se vuelve a preguntar.
 */
const CLAVE = 'ck-consentimiento';
const VIGENCIA = 365 * 24 * 60 * 60 * 1000;

type Consentimiento = { mapas: boolean; fecha: number };

export function consentimiento(): Consentimiento | null {
    try {
        const c = JSON.parse(localStorage.getItem(CLAVE) ?? 'null') as Consentimiento | null;
        return c && Date.now() - c.fecha < VIGENCIA ? c : null;
    } catch {
        return null;
    }
}

export const mapasPermitidos = () => consentimiento()?.mapas === true;

export function guardarConsentimiento(mapas: boolean) {
    const antes = mapasPermitidos();
    try {
        localStorage.setItem(CLAVE, JSON.stringify({ mapas, fecha: Date.now() }));
    } catch {
        // Sin almacenamiento (modo privado estricto): la decisión vale solo para esta página
    }
    $('[data-cookies]')?.setAttribute('hidden', '');
    // Si retira el permiso con el mapa ya cargado, se recarga para quitarlo
    if (antes && !mapas && $('[data-mapa] iframe')) location.reload();
    document.dispatchEvent(new CustomEvent('consentimiento', { detail: { mapas } }));
}

export function initCookies() {
    const aviso = $('[data-cookies]');
    if (!aviso) return;
    if (!consentimiento()) aviso.removeAttribute('hidden');

    $('[data-cookies-si]', aviso)?.addEventListener('click', () => guardarConsentimiento(true));
    $('[data-cookies-no]', aviso)?.addEventListener('click', () => guardarConsentimiento(false));
    // Enlace «Configurar cookies» del pie: vuelve a mostrar el aviso
    $$('[data-cookies-abrir]').forEach((a) =>
        a.addEventListener('click', (e) => {
            e.preventDefault();
            aviso.removeAttribute('hidden');
            $<HTMLButtonElement>('[data-cookies-si]', aviso)?.focus();
        }),
    );
}
