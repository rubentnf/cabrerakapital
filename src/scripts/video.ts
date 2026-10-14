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

    let origen: HTMLElement | null = null;

    botones.forEach((b) =>
        b.addEventListener('click', () => {
            origen = b;
            if (!video.getAttribute('src')) video.src = video.dataset.src ?? '';
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
        origen?.focus();
    });
}
