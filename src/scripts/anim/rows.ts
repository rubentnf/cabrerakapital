import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$ } from '../utils';

/** Filas oscuras de servicios: se activa la que pasa por el centro (o la que toca el ratón). */
export function initRows() {
    $$('[data-rows]').forEach((ul) => {
        const filas = $$('.row', ul);
        const activar = (r: HTMLElement) => filas.forEach((x) => x.classList.toggle('active', x === r));
        filas.forEach((r) => {
            r.addEventListener('mouseenter', () => activar(r));
            ScrollTrigger.create({
                trigger: r,
                start: 'top 62%',
                end: 'bottom 38%',
                onToggle: (s) => s.isActive && activar(r),
            });
            gsap.from($('.rt > span', r), {
                yPercent: 100,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: { trigger: r, start: 'top 92%' },
            });
        });
        if (filas[0]) activar(filas[0]);
    });
}