import { $ } from './utils';

/**
 * Coloca el aviso «Desliza» de la portada para que nunca tape los botones.
 * - Escritorio: se queda donde lo pone el CSS (21 % desde abajo) salvo que tape los botones
 *   (portátiles bajos, p. ej. 1280×720); entonces se coloca justo debajo de ellos.
 * - Móvil: el texto de la portada llega más abajo, así que siempre va justo debajo de los botones,
 *   sobre el fondo claro de la montaña (mismo aspecto que en escritorio).
 * - Si no cabe sin tapar nada (pantallas muy bajas), no se muestra.
 * Solo se mide con la página arriba del todo; después la animación de la portada lo recoloca.
 */
const SEPARACION = 24; // px entre los botones y el aviso

export function initDesliza() {
    const escena = $('.scene');
    const aviso = $('.scene .scroll-cue');
    const botones = $('.scene .hero-copy .btns');
    if (!escena || !aviso || !botones) return;

    const colocar = () => {
        if (window.scrollY > 10) return;
        aviso.classList.remove('tapa');
        aviso.style.bottom = '';
        const movil = window.matchMedia('(max-width: 767px)').matches;
        const e = escena.getBoundingClientRect();
        const b = botones.getBoundingClientRect();
        const a = aviso.getBoundingClientRect();
        const tapa = a.top < b.bottom + 4 && a.bottom > b.top;
        if (!movil && !tapa) return;

        // Debajo de los botones, pero sin llegar a la silueta oscura de la ciudad (azul sobre azul no
        // se lee): los edificios empiezan hacia el 45 % de su capa. Si no hay hueco, oculto.
        const ciudad = $('.scene .city')?.getBoundingClientRect();
        const limite = ciudad ? ciudad.top + ciudad.height * 0.45 : e.bottom;
        const arriba = b.bottom + SEPARACION;
        if (arriba + a.height <= limite) aviso.style.bottom = `${Math.round(e.bottom - arriba - a.height)}px`;
        else aviso.classList.add('tapa');
    };

    colocar();
    window.addEventListener('resize', colocar, { passive: true });
    // Al empezar a bajar, la portada se desvanece y la animación lo vuelve a mostrar más abajo:
    // ya no tapa nada. Al volver arriba del todo se recoloca.
    window.addEventListener(
        'scroll',
        () => (window.scrollY > 10 ? aviso.classList.remove('tapa') : colocar()),
        { passive: true },
    );
    // Las fuentes cambian la altura del texto al cargar
    document.fonts?.ready.then(colocar);
}
