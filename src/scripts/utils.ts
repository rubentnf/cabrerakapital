export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
    root.querySelector<T>(sel);
export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
    Array.from(root.querySelectorAll<T>(sel));

/**
 * Divide un texto en palabras envueltas en <span class="w"> para animarlas una a una.
 * Con `mascara`, cada palabra va además dentro de un <span class="split-mask"> que la recorta.
 */
export function splitWords(el: HTMLElement, mascara = false): HTMLElement[] {
    const palabras = (el.textContent ?? '').trim().split(/\s+/);
    const spans = palabras.map((p) => {
        const w = document.createElement('span');
        w.className = 'w';
        w.textContent = p;
        return w;
    });
    const nodos = spans.map((w) => {
        if (!mascara) return w;
        const m = document.createElement('span');
        m.className = 'split-mask';
        m.append(w);
        return m;
    });
    el.replaceChildren(...nodos.flatMap((n, i) => (i ? [' ', n] : [n])));
    return spans;
}

export const reducedMotion = () => document.documentElement.classList.contains('rm');