import { $, reducedMotion } from './utils';

/** Simulador de cuota (sistema francés). Solo se activa si la página lo contiene. */
export function initSimulador() {
    const caja = $('[data-simulador]');
    if (!caja) return;

    const campo = (n: string) => $<HTMLInputElement>(`[data-sim="${n}"]`, caja)!;
    const salida = (n: string) => $(`[data-out="${n}"]`, caja)!;
    const importe = campo('importe');
    const plazo = campo('plazo');
    const tipo = campo('tipo');

    const en = caja.dataset.lang === 'en';
    const anios = caja.dataset.anios ?? 'años';
    const eur = (v: number) =>
        en ? '€' + Math.round(v).toLocaleString('en-GB') : Math.round(v).toLocaleString('es-ES') + ' €';

    const mostrado = { c: 0, t: 0, i: 0 };
    const pintar = () => {
        salida('cuota').textContent = eur(mostrado.c);
        salida('total').textContent = eur(mostrado.t);
        salida('intereses').textContent = eur(mostrado.i);
    };

    const calcular = () => {
        const im = +importe.value;
        const n = +plazo.value * 12;
        const ti = +tipo.value;
        const m = ti / 1200;
        const cuota = m ? (im * m) / (1 - Math.pow(1 + m, -n)) : im / n;

        salida('importe').textContent = eur(im);
        salida('plazo').textContent = `${plazo.value} ${anios}`;
        salida('tipo').textContent = (en ? ti.toFixed(1) : ti.toFixed(1).replace('.', ',')) + ' %';

        const destino = { c: cuota, t: cuota * n, i: cuota * n - im };
        if (reducedMotion()) {
            Object.assign(mostrado, destino);
            pintar();
            return;
        }
        // GSAP se descarga solo cuando hace falta (ver main.ts)
        import('gsap').then(({ gsap }) =>
            gsap.to(mostrado, { ...destino, duration: 0.6, ease: 'power2.out', overwrite: true, onUpdate: pintar }),
        );
    };

    [importe, plazo, tipo].forEach((el) => el.addEventListener('input', calcular));
    calcular();
}
