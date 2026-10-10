import { gsap } from 'gsap';
import { $, reducedMotion } from './utils';

const caja = document.querySelector<HTMLElement>('.simg');
const en = caja?.dataset.lang === 'en';
const eur = (v: number) =>
    en ? '€' + Math.round(v).toLocaleString('en-GB') : Math.round(v).toLocaleString('es-ES') + ' €';
const anios = caja?.dataset.anios ?? 'años';

/** Simulador de cuota (sistema francés). Solo se activa si la página lo contiene. */
export function initSimulador() {
    const importe = $<HTMLInputElement>('#i');
    const plazo = $<HTMLInputElement>('#p');
    const tipo = $<HTMLInputElement>('#t');
    if (!importe || !plazo || !tipo) return;

    const mostrado = { c: 0, t: 0, i: 0 };
    const pintar = () => {
        $('#cuota')!.textContent = eur(mostrado.c);
        $('#tot')!.textContent = eur(mostrado.t);
        $('#int')!.textContent = eur(mostrado.i);
    };
    const calcular = () => {
        const im = +importe.value,
            años = +plazo.value,
            ti = +tipo.value;
        const m = ti / 1200,
            n = años * 12;
        const cuota = m ? (im * m) / (1 - Math.pow(1 + m, -n)) : im / n;
        $('#vi')!.textContent = eur(im);
        $('#vp')!.textContent = `${años} ${anios}`;
        $('#vt')!.textContent = (en ? ti.toFixed(1) : ti.toFixed(1).replace('.', ',')) + ' %';
        const destino = { c: cuota, t: cuota * n, i: cuota * n - im };
        if (reducedMotion()) {
            Object.assign(mostrado, destino);
            pintar();
        } else
            gsap.to(mostrado, {
                ...destino,
                duration: 0.6,
                ease: 'power2.out',
                overwrite: true,
                onUpdate: pintar,
            });
    };
    [importe, plazo, tipo].forEach((el) => el.addEventListener('input', calcular));
    calcular();
}
