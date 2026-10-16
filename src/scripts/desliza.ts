import { $, $$, reducedMotion } from './utils';

/**
 * Coloca el aviso «Desliza» de la portada para que se vea siempre y nunca tape los botones.
 * - Escritorio: se queda donde lo pone el CSS (21 % desde abajo) salvo que tape los botones
 *   (portátiles bajos, p. ej. 1366×768); entonces se coloca justo debajo de ellos.
 * - Móvil: centrado en el hueco entre el texto de la portada y los tejados de la ciudad.
 * - Si donde queda pisa la silueta oscura de la ciudad, pasa a marfil (.claro) para leerse.
 * - Solo si no cabe dentro de la escena (pantallas muy bajas) no se muestra (.tapa).
 * Solo se mide con la página arriba del todo; al empezar a bajar, la animación de la portada lo
 * recoloca y recupera su color normal.
 */
const SEPARACION = 24; // px entre los botones y el aviso

export function initDesliza() {
    // Quien lo pulsa como si fuera un «siguiente» (habitual en personas mayores): la página baja sola
    for (const boton of $$<HTMLButtonElement>('[data-desliza]'))
        boton.addEventListener('click', () =>
            window.scrollBy({
                top: Math.round(window.innerHeight * 0.8),
                behavior: reducedMotion() ? 'auto' : 'smooth',
            }),
        );

    const escena = $('.scene');
    const aviso = $('.scene .scroll-cue');
    const copia = $('.scene .hero-copy');
    if (!escena || !aviso || !copia) return;
    // Lo más bajo del texto de la portada (en escritorio el vídeo va aparte, a la derecha: no cuenta)
    const finTexto = () => {
        const hijos = [...copia.children].filter((h) => getComputedStyle(h).position !== 'absolute');
        const r = hijos.map((h) => h.getBoundingClientRect());
        return { top: Math.min(...r.map((x) => x.top)), bottom: Math.max(...r.map((x) => x.bottom)) };
    };

    const colocar = () => {
        if (window.scrollY > 10) return;
        aviso.classList.remove('tapa', 'claro');
        aviso.style.bottom = '';
        const movil = window.matchMedia('(max-width: 767px)').matches;
        const e = escena.getBoundingClientRect();
        const b = finTexto();
        let a = aviso.getBoundingClientRect();
        const tapa = a.top < b.bottom + 4 && a.bottom > b.top;

        const ciudad = $('.scene .city')?.getBoundingClientRect();

        if (movil || tapa) {
            // Móvil: en medio del hueco hasta los tejados; si no, justo debajo del texto. Sin sitio, oculto
            const techo = movil && ciudad ? ciudad.top + ciudad.height * 0.4 : e.bottom;
            const hueco = techo - (b.bottom + SEPARACION) - a.height;
            const arriba = b.bottom + SEPARACION + (movil ? Math.max(0, hueco / 2) : 0);
            const abajo = e.bottom - arriba - a.height;
            if (abajo < 8) return aviso.classList.add('tapa');
            aviso.style.bottom = `${Math.round(abajo)}px`;
            a = aviso.getBoundingClientRect();
        }

        // Los edificios empiezan hacia el 45 % de la capa de la ciudad: por debajo, azul sobre azul
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
