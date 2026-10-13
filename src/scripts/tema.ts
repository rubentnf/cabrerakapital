import { $$ } from './utils';

/**
 * Modo claro / oscuro. El script en línea de Base.astro fija data-theme en <html> antes de pintar
 * (preferencia guardada o, si no hay, la del sistema); aquí se gestiona el botón y los cambios.
 */
type Tema = 'light' | 'dark';

const CLAVE = 'tema';
const raiz = document.documentElement;
const sistema = matchMedia('(prefers-color-scheme: dark)');

const guardado = (): Tema | null => {
    try {
        const t = localStorage.getItem(CLAVE);
        return t === 'light' || t === 'dark' ? t : null;
    } catch {
        return null;
    }
};

function aplicar(tema: Tema) {
    raiz.dataset.theme = tema;
    // Color de la barra del navegador en móvil: el de la cabecera
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = tema === 'dark' ? '#08142a' : '#0a2240';
    // Ilustraciones con versión nocturna: <img data-oscuro="/img/…-oscuro.svg">
    for (const img of $$<HTMLImageElement>('img[data-oscuro]')) {
        img.dataset.claro ??= img.getAttribute('src') ?? '';
        img.src = tema === 'dark' ? img.dataset.oscuro! : img.dataset.claro;
    }
    for (const b of $$('[data-tema]')) b.setAttribute('aria-pressed', String(tema === 'dark'));
}

export function initTema() {
    aplicar(raiz.dataset.theme === 'dark' ? 'dark' : 'light');

    for (const b of $$('[data-tema]'))
        b.addEventListener('click', () => {
            const nuevo: Tema = raiz.dataset.theme === 'dark' ? 'light' : 'dark';
            try {
                localStorage.setItem(CLAVE, nuevo);
            } catch {}
            aplicar(nuevo);
        });

    // Sin elección guardada, sigue al sistema también si cambia con la página abierta
    sistema.addEventListener('change', (e) => {
        if (!guardado()) aplicar(e.matches ? 'dark' : 'light');
    });
}
