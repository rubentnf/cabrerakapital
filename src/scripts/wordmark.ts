/** Ajusta el logotipo gigante del pie para que ocupe exactamente el ancho del contenedor */
export function fitWordmark() {
    const e = document.querySelector<HTMLElement>('.bigwm b');
    const caja = e?.parentElement;
    if (!e || !caja) return;

    const fit = () => {
        e.style.fontSize = '100px';
        const ancho = e.scrollWidth;
        if (ancho > 0) e.style.fontSize = `${((100 * caja.clientWidth) / ancho) * 0.995}px`;
    };

    // Solo se recalcula cuando cambia el ancho de la caja (no en cada evento de resize)
    let anchoCaja = 0;
    new ResizeObserver(([entrada]) => {
        const w = entrada.contentRect.width;
        if (w !== anchoCaja) {
            anchoCaja = w;
            fit();
        }
    }).observe(caja);
    document.fonts?.ready.then(fit);
}
