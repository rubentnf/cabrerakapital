import { $ } from './utils';

/** Barra fija: se vuelve sólida al hacer scroll. Menú movil con botón hamburguesa. */
export function initNav() {
    const nav = $('#nav');
    const burger = $('#burger');
    const menu = $('#menu');
    if (!nav || !burger || !menu) return;

    const onScroll = () => nav.classList.toggle('solid', scrollY > 40);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const set = (abierto: boolean) => {
        menu.classList.toggle('open', abierto);
        burger.setAttribute('aria-expanded', String(abierto));
    };
    burger.addEventListener('click', () => set(!menu.classList.contains('open')));
    menu.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('a')) set(false);
    });
    addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
}