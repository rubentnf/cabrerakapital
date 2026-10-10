import { $, $$ } from './utils';

/** Barra fija: se vuelve sólida al hacer scroll. Menú móvil con botón hamburguesa. */
export function initNav() {
    const nav = $('#nav');
    const burger = $('#burger');
    const menu = $('#menu');
    if (!nav || !burger || !menu) return;

    const onScroll = () => nav.classList.toggle('solid', scrollY > 40);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const abierto = () => menu.classList.contains('open');
    const enfocables = () => [burger, ...$$('a, button', menu)];

    const set = (abrir: boolean, devolverFoco = false) => {
        menu.classList.toggle('open', abrir);
        burger.setAttribute('aria-expanded', String(abrir));
        burger.setAttribute('aria-label', (abrir ? burger.dataset.cerrar : burger.dataset.abrir) ?? '');
        document.body.style.overflow = abrir ? 'hidden' : ''; // sin scroll de fondo con el menú abierto
        if (abrir) $('a', menu)?.focus();
        else if (devolverFoco) burger.focus();
    };

    burger.addEventListener('click', () => set(!abierto()));
    menu.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('a')) set(false);
    });

    addEventListener('keydown', (e) => {
        if (!abierto()) return;
        if (e.key === 'Escape') set(false, true);
        // Tab circula solo entre el botón y los enlaces del menú
        if (e.key === 'Tab') {
            const f = enfocables();
            const i = f.indexOf(document.activeElement as HTMLElement);
            const sig = e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i + 1) % f.length;
            e.preventDefault();
            f[sig].focus();
        }
    });

    // Si la ventana pasa a escritorio con el menú abierto, se cierra (y se recupera el scroll)
    matchMedia('(min-width: 1001px)').addEventListener('change', (e) => e.matches && set(false));
}
