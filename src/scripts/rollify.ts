import { $$ } from './utils';

/** Botones y enlaces del menú con texto que "rueda" al pasar el ratón (CSS .rl). */
export function rollify() {
    $$('.btn, .links a').forEach((el) => {
        if (el.children.length) return;
        const t = (el.textContent ?? '').trim();
        el.innerHTML = `<span class="rl"><span>${t}</span><span aria-hidden="true">${t}</span></span>`;
    });
}