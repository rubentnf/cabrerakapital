import { $ } from './utils';

/**
 * Coloca el aviso «Desliza» de la portada para que se vea siempre y nunca tape los botones.
 * - Escritorio: se queda donde lo pone el CSS (21 % desde abajo) salvo que tape los botones
 *   (portátiles bajos, p. ej. 1366×768); entonces se coloca justo debajo de ellos.
 * - Móvil: el texto de la portada llega más abajo, así que siempre va justo debajo de los botones.
 * - Si donde queda pisa la silueta oscura de la ciudad, pasa a marfil (.claro) para leerse.
 * - Solo si no cabe dentro de la escena (pantallas muy bajas) no se muestra (.tapa).
 * Solo se mide con la página arriba del todo; al empezar a bajar, la animación de la portada lo
 * recoloca y recupera su color normal.
 */
const SEPARACION = 24; // px entre los botones y el aviso

export function initDesliza() {
    const escena = $('.scene');
    const aviso = $('.scene .scroll-cue');
    const botones = $('.scene .hero-copy .btns');
    if (!escena || !aviso || !botones) return;

    const colocar = () => {
        if (window.scrollY > 10) return;
        aviso.classList.remove('tapa', 'claro');
        aviso.style.bottom = '';
        const movil = window.matchMedia('(max-width: 767px)').matches;
        const e = escena.getBoundingClientRect();
        const b = botones.getBoundingClientRect();
        let a = aviso.getBoundingClientRect();
        const tapa = a.top < b.bottom + 4 && a.bottom > b.top;

        if (movil || tapa) {
            // Justo debajo de los botones; si ni así cabe dentro de la escena, no se muestra
            const abajo = e.bottom - (b.bottom + SEPARACION) - a.height;
            if (abajo < 8) return aviso.classList.add('tapa');
            aviso.style.bottom = `${Math.round(abajo)}px`;
            a = aviso.getBoundingClientRect();
        }

        // Los edificios empiezan hacia el 45 % de la capa de la ciudad: por debajo, azul sobre azul
        const ciudad = $('.scene .city')?.getBoundingClientRect();
        if (ciudad && a.bottom > ciudad.top + ciudad.height * 0.45) aviso.classList.add('claro');
    };

    colocar();
    window.addEventListener('resize', colocar, { passive: true });
    // Al empezar a bajar, la portada se desvanece y la animación lo vuelve a mostrar más abajo, sobre
    // el cielo claro: recupera su color y ya no tapa nada. Al volver arriba del todo se recoloca.
    window.addEventListener(
        'scroll',
        () => (window.scrollY > 10 ? aviso.classList.remove('tapa', 'claro') : colocar()),
        { passive: true },
    );
    // Las fuentes cambian la altura del texto al cargar
    document.fonts?.ready.then(colocar);
}
