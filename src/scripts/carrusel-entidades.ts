import { $$, reducedMotion } from './utils';

const MOVIL = '(max-width: 767px)';
const VELOCIDAD = 32; // px por segundo
const PAUSA_TRAS_TOQUE = 2500; // ms

/**
 * Carrusel de entidades en móvil: avanza solo y en bucle, y se puede arrastrar con el dedo.
 * El HTML trae la lista duplicada (.dup), así que al llegar a la mitad se vuelve al principio sin salto.
 */
export function initCarruselEntidades() {
    const mq = matchMedia(MOVIL);

    $$('[data-ents]').forEach((el) => {
        const primero = el.firstElementChild as HTMLElement | null;
        const copia = el.querySelector<HTMLElement>('.dup');
        if (!primero || !copia) return;

        const periodo = () => copia.offsetLeft - primero.offsetLeft;
        let pos = 0;
        let visible = false;
        let reanudarEn = 0;
        let ultimo = 0;

        const pausar = () => (reanudarEn = performance.now() + PAUSA_TRAS_TOQUE);
        el.addEventListener('pointerdown', pausar, { passive: true });
        el.addEventListener('touchstart', pausar, { passive: true });
        el.addEventListener('wheel', pausar, { passive: true });

        // Bucle infinito también cuando es la persona quien desliza
        el.addEventListener(
            'scroll',
            () => {
                if (!mq.matches) return;
                const p = periodo();
                if (el.scrollLeft >= p) el.scrollLeft -= p;
                else if (el.scrollLeft <= 0 && performance.now() < reanudarEn) el.scrollLeft += p;
                // El navegador redondea scrollLeft a píxeles: solo se adopta si lo ha movido la persona
                if (Math.abs(el.scrollLeft - pos) > 1) pos = el.scrollLeft;
            },
            { passive: true },
        );

        let raf = 0;
        const paso = (t: number) => {
            const dt = ultimo ? Math.min(t - ultimo, 100) / 1000 : 0;
            ultimo = t;
            if (t >= reanudarEn) {
                pos += VELOCIDAD * dt;
                const p = periodo();
                if (pos >= p) pos -= p;
                el.scrollLeft = pos;
            }
            raf = requestAnimationFrame(paso);
        };

        // El bucle solo corre en móvil, con el carrusel en pantalla y sin movimiento reducido
        const actualizar = () => {
            const activo = mq.matches && visible && !reducedMotion();
            if (activo && !raf) {
                ultimo = 0;
                raf = requestAnimationFrame(paso);
            } else if (!activo && raf) {
                cancelAnimationFrame(raf);
                raf = 0;
            }
        };

        new IntersectionObserver(([e]) => {
            visible = e.isIntersecting;
            actualizar();
        }).observe(el);
        mq.addEventListener('change', actualizar);
    });
}
