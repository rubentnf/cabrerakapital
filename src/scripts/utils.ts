export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
    root.querySelector<T>(sel);
export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
    Array.from(root.querySelectorAll<T>(sel));

/** Divide un texto en palabras envueltas en <span class="w"> para animarlas una a una. */
export function splitWords(el: HTMLElement): HTMLElement[] {
    const texto = (el.textContent ?? '').trim();
    el.innerHTML = texto
        .split(/\s+/)
        .map((w) => `<span class="w">${w}</span>`)
        .join(' ');
    return $$('.w', el);
}

export const reducedMotion = () => document.documentElement.classList.contains('rm');