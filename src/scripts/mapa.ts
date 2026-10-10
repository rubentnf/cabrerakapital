import { $$ } from './utils';

/** El mapa de Google solo se carga cuando la persona pulsa el botón (así no se conecta a Google al entrar). */
export function initMapa() {
    $$('[data-mapa]').forEach((caja) => {
        const boton = caja.querySelector('[data-mapa-btn]');
        boton?.addEventListener('click', () => {
            const iframe = document.createElement('iframe');
            iframe.src = caja.dataset.src ?? '';
            iframe.title = caja.dataset.titulo ?? '';
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'no-referrer-when-downgrade';
            iframe.allowFullscreen = true;
            caja.replaceChildren(iframe);
        });
    });
}