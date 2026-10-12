import { $$ } from './utils';
import { guardarConsentimiento, mapasPermitidos } from './cookies';

/**
 * El mapa de Google instala cookies, así que solo se carga con permiso: directamente si ya se
 * aceptaron las cookies, o cuando la persona pulsa «Ver mapa» (que cuenta como aceptarlas).
 */
export function initMapa() {
    const cajas = $$('[data-mapa]');
    if (!cajas.length) return;

    const cargar = (caja: HTMLElement) => {
        if (caja.querySelector('iframe')) return;
        const iframe = document.createElement('iframe');
        iframe.src = caja.dataset.src ?? '';
        iframe.title = caja.dataset.titulo ?? '';
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.allowFullscreen = true;
        caja.replaceChildren(iframe);
        // Con el mapa a la vista, el enlace «Cómo llegar» sobra
        caja.parentElement?.querySelector('[data-mapa-link]')?.setAttribute('hidden', '');
    };

    cajas.forEach((caja) => {
        caja.querySelector('[data-mapa-btn]')?.addEventListener('click', () => {
            guardarConsentimiento(true);
            cargar(caja);
        });
    });

    if (mapasPermitidos()) cajas.forEach(cargar);
    document.addEventListener('consentimiento', (e) => {
        if ((e as CustomEvent<{ mapas: boolean }>).detail.mapas) cajas.forEach(cargar);
    });
}
