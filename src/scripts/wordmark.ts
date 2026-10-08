/** Ajusta el logotipo gigante del pie para que ocupe exactamente el ancho del contenedor */
export function fitWordmark() {
    const fit = () => {
        const e = document.querySelector<HTMLElement>('.bigwm b');
        if (!e || !e.parentElement) return;
        e.style.fontSize = '100px';
        const ancho = e.scrollWidth;
        if (ancho > 0) e.style.fontSize = `${((100 * e.parentElement.clientWidth) / ancho) * 0.995}px`;
    };
    fit();
    addEventListener('resize', fit);
    document.fonts?.ready.then(fit);
}