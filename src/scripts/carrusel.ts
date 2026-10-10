import { $, $$, reducedMotion } from './utils';

/** Carrusel con scroll-snap: la pista se desplaza sola (táctil o rueda) y los botones avanzan una tarjeta. */
export function initCarrusel() {
    $$('[data-carrusel]').forEach((raiz) => {
        const pista = $<HTMLElement>('[data-pista]', raiz);
        const prev = $<HTMLButtonElement>('[data-prev]', raiz);
        const next = $<HTMLButtonElement>('[data-next]', raiz);
        if (!pista || !prev || !next) return;

        const paso = () => {
            const tarjeta = pista.firstElementChild as HTMLElement | null;
            return (tarjeta?.offsetWidth ?? pista.clientWidth) + 20;
        };
        const ir = (dir: 1 | -1) =>
            pista.scrollBy({ left: dir * paso(), behavior: reducedMotion() ? 'auto' : 'smooth' });
        const actualizar = () => {
            prev.disabled = pista.scrollLeft < 4;
            next.disabled = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 4;
        };

        prev.addEventListener('click', () => ir(-1));
        next.addEventListener('click', () => ir(1));
        pista.addEventListener('scroll', actualizar, { passive: true });
        pista.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') ir(1);
            if (e.key === 'ArrowLeft') ir(-1);
        });
        addEventListener('resize', actualizar);
        actualizar();
    });
}