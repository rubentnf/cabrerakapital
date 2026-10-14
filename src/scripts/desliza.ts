import { $, $$, reducedMotion } from './utils';

/**
 * Coloca el aviso «Desliza» de la portada para que se vea siempre y nunca tape los botones.
 * - Escritorio: se queda donde lo pone el CSS (21 % desde abajo) salvo que tape los botones
 *   (portátiles bajos, p. ej. 1366×768); entonces se coloca justo debajo de ellos.
 * - Móvil: las islas (.islas) van pegadas bajo los botones y el aviso, debajo de las islas; si no
 *   cabe, se pone justo debajo de los botones, encima de las islas.
 * - Si donde queda pisa la silueta oscura de la ciudad, pasa a marfil (.claro) para leerse.
 * - Solo si no cabe dentro de la escena (pantallas muy bajas) no se muestra (.tapa).
 * Solo se mide con la página arriba del todo; al empezar a bajar, la animación de la portada lo
 * recoloca y recupera su color normal.
 */
const SEPARACION = 24; // px entre los botones y el aviso
const SEP_ISLAS = 10; // px entre las islas (móvil) y el aviso

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
    // Lo más bajo del texto de portada (la fila de botones, con el vídeo)
    const botones = $('.scene .hero-copy > :last-child');
    const islas = $('.scene .islas');
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

        // En móvil, las islas y el aviso debajo van centrados en el hueco entre los botones y los
        // tejados de la ciudad; si no sobra sitio, las islas se pegan a los botones (en escritorio
        // manda el CSS)
        const ciudad = $('.scene .city')?.getBoundingClientRect();
        if (islas) {
            let top = '';
            if (movil) {
                const alto = islas.getBoundingClientRect().height;
                const techo = ciudad ? ciudad.top + ciudad.height * 0.35 : e.bottom;
                const sobra = techo - (b.bottom + 6) - (alto + SEP_ISLAS + a.height);
                top = `${Math.round(b.bottom - e.top + 6 + Math.max(0, sobra / 2))}px`;
            }
            islas.style.top = top;
            islas.style.bottom = movil ? 'auto' : '';
        }

        if (movil || tapa) {
            // Debajo de las islas (móvil) o de los botones; si ni así cabe, no se muestra
            const i = movil && islas ? islas.getBoundingClientRect() : null;
            let abajo = i ? e.bottom - (i.bottom + SEP_ISLAS) - a.height : -1;
            // Móviles bajos: no cabe bajo las islas, así que va al fondo de la escena (sobre la
            // ciudad) para tapar lo menos posible de las islas
            if (i && abajo < 8) abajo = 8;
            else if (abajo < 8) abajo = e.bottom - (b.bottom + SEPARACION) - a.height;
            if (abajo < 8 || e.bottom - abajo - a.height < b.bottom + SEPARACION)
                return aviso.classList.add('tapa');
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
