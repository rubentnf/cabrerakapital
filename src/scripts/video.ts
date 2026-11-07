import { $, $$ } from './utils';

/**
 * Vídeo de portada en una ventana emergente (<dialog>): se abre con el botón de play,
 * no se descarga hasta entonces y se pausa al cerrar. Se cierra con la ×, con Escape o pulsando fuera.
 */
export function initVideo() {
    const modal = $<HTMLDialogElement>('[data-video-modal]');
    const botones = $$<HTMLElement>('[data-video-abrir]');
    const video = modal ? $<HTMLVideoElement>('video', modal) : null;
    if (!modal || !video || !botones.length) return;

    // La ventana se saca de la portada: el texto de la portada se desvanece y se oculta al hacer scroll,
    // y nada de eso debe poder ocultar un vídeo que está sonando
    document.body.append(modal);

    let origen: HTMLElement | null = null;

    botones.forEach((b) =>
        b.addEventListener('click', () => {
            origen = b;
            if (!video.getAttribute('src')) {
                video.poster = video.dataset.poster ?? '';
                video.src = video.dataset.src ?? '';
            }
            modal.showModal();
            video.play().catch(() => {
                /* el navegador no ha dejado reproducir solo: la persona usa los controles */
            });
        }),
    );

    $('[data-video-cerrar]', modal)?.addEventListener('click', () => modal.close());
    // Pulsar en el fondo oscuro (el propio <dialog>, no el vídeo) cierra
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.close();
    });
    // Cualquier cierre (×, Escape, fondo): pausa y devuelve el foco al botón
    modal.addEventListener('close', () => {
        video.pause();
        origen?.focus({ preventScroll: true });
    });
    // Al cambiar de pestaña, minimizar o salir de la página, el vídeo se cierra y deja de sonar
    // (también si el navegador guarda la página en memoria para el botón «Atrás»)
    const parar = () => {
        if (modal.open) modal.close();
        video.pause();
    };
    document.addEventListener('visibilitychange', () => document.hidden && parar());
    addEventListener('pagehide', parar);
}
