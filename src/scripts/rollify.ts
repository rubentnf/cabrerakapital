import { $$ } from './utils';

/** Botones y enlaces del menú con texto que "rueda" al pasar el ratón (CSS .rl). */
export function rollify() {
    $$('.btn, .links a').forEach((el) => {
        if (el.children.length) return;
        const texto = (el.textContent ?? '').trim();
        const a = document.createElement('span');
        a.textContent = texto;
        const b = a.cloneNode(true) as HTMLElement;
        b.setAttribute('aria-hidden', 'true');
        const rl = document.createElement('span');
        rl.className = 'rl';
        rl.append(a, b);
        el.replaceChildren(rl);
    });
}
