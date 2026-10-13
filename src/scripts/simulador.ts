import { $, $$, reducedMotion } from './utils';
import { enviar } from './formulario';

/**
 * Simulador de hipoteca (views/Simulador.astro). Solo se activa si la página lo contiene.
 * - Primero se elige el recorrido: comprar vivienda o mejorar la hipoteca actual.
 * - Cada recorrido es un formulario por pasos; «Continuar» valida solo los campos del paso visible.
 * - Los bloques con data-si="campo:valor1,valor2" se muestran (y se envían) solo si ese campo
 *   tiene uno de esos valores. Mientras están ocultos van `disabled`, así no se validan ni se envían.
 * - Al terminar se envía igual que el formulario de contacto (formulario.ts) y se muestra la confirmación.
 */

type Campo = HTMLInputElement | HTMLSelectElement;

export function initSimulador() {
    const caja = $('#simbox');
    if (!caja) return;

    const inicio = $('#sim-inicio', caja)!;
    const exito = $('#sim-exito', caja)!;
    const formularios = $$<HTMLFormElement>('form[data-flujo]', caja);
    const { rango = '', completado = '', casi = '' } = caja.dataset;
    const locale = caja.dataset.lang === 'en' ? 'en-GB' : 'es-ES';

    /** Muestra solo una de las tres pantallas: elección, un recorrido o la confirmación. */
    const mostrar = (pantalla: HTMLElement) => {
        inicio.hidden = pantalla !== inicio;
        exito.hidden = pantalla !== exito;
        formularios.forEach((f) => (f.hidden = f !== pantalla));
    };

    /** Si la tarjeta ha quedado por encima de la pantalla (móvil), la vuelve a poner a la vista. */
    const alaVista = () => {
        if (caja.getBoundingClientRect().top < 0)
            caja.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    };

    // ---------- Campos numéricos ----------
    const formato = (el: HTMLInputElement) =>
        new Intl.NumberFormat(locale, {
            maximumFractionDigits: +(el.dataset.dec ?? 0),
            useGrouping: el.dataset.miles !== 'no',
        });

    /** "180.000" → 180000; "1,90" → 1.9. Los enteros ignoran cualquier separador. */
    const leer = (el: HTMLInputElement) => {
        const v = el.value.trim();
        if (!v) return NaN;
        if (!+(el.dataset.dec ?? 0)) return /\d/.test(v) && /^[\d.,\s]+$/.test(v) ? +v.replace(/\D/g, '') : NaN;
        return /^\d+([.,]\d+)?$/.test(v) ? +v.replace(',', '.') : NaN;
    };

    /** Mensaje de error si la cifra no es válida o está fuera de rango (vacío lo controla `required`). */
    const validarCifra = (el: HTMLInputElement) => {
        if (!el.value.trim()) return el.setCustomValidity('');
        const n = leer(el);
        const min = +(el.dataset.min ?? -Infinity);
        const max = +(el.dataset.max ?? Infinity);
        const f = formato(el);
        el.setCustomValidity(
            Number.isNaN(n) || n < min || n > max
                ? rango.replace('{min}', f.format(min)).replace('{max}', f.format(max))
                : '',
        );
    };

    caja.addEventListener('input', (e) => {
        const el = e.target;
        if (el instanceof HTMLInputElement && el.matches('[data-cifra]')) validarCifra(el);
    });
    // Al salir del campo, la cifra queda con separador de miles: 180000 → 180.000
    caja.addEventListener('change', (e) => {
        const el = e.target;
        if (!(el instanceof HTMLInputElement) || !el.matches('[data-cifra]')) return;
        validarCifra(el);
        const n = leer(el);
        if (el.checkValidity() && !Number.isNaN(n)) el.value = formato(el).format(n);
    });

    // ---------- Recorridos ----------
    formularios.forEach((form) => initRecorrido(form));

    function initRecorrido(form: HTMLFormElement) {
        const pasos = $$<HTMLElement>('[data-paso]', form);
        const condicionales = $$<HTMLFieldSetElement>('[data-si]', form);
        const numero = $('[data-n]', form)!;
        const porcentaje = $('[data-pct]', form)!;
        const barra = $('.sim-prog i', form)!;
        const atras = $<HTMLButtonElement>('[data-atras]', form)!;
        const siguiente = $<HTMLButtonElement>('[data-siguiente]', form)!;
        const enviarBtn = $<HTMLButtonElement>('[data-enviar]', form)!;
        const ultimo = pasos.length - 1;
        let actual = 0;

        $('[data-total]', form)!.textContent = String(pasos.length);

        const aplicarCondiciones = () =>
            condicionales.forEach((bloque) => {
                const [campo, valores] = bloque.dataset.si!.split(':');
                const elegido = (form.elements.namedItem(campo) as RadioNodeList | null)?.value ?? '';
                const visible = valores.split(',').includes(elegido);
                bloque.hidden = !visible;
                bloque.disabled = !visible;
            });

        const ir = (i: number, enfocar = true) => {
            actual = Math.max(0, Math.min(ultimo, i));
            pasos.forEach((p, n) => (p.hidden = n !== actual));
            const parte = (actual + 1) / pasos.length;
            numero.textContent = String(actual + 1);
            porcentaje.textContent =
                actual === ultimo ? casi : completado.replace('{p}', String(Math.round(parte * 100)));
            barra.style.transform = `scaleX(${parte})`;
            siguiente.hidden = actual === ultimo;
            enviarBtn.hidden = actual !== ultimo;
            if (enfocar) {
                $('.sim-paso-t', pasos[actual])?.focus({ preventScroll: true });
                alaVista();
            }
        };

        /** Valida los campos del paso visible y muestra el primer error. */
        const pasoValido = () => {
            for (const el of $$<Campo>('input, select', pasos[actual])) {
                if (el instanceof HTMLInputElement && el.matches('[data-cifra]')) validarCifra(el);
                if (!el.checkValidity()) {
                    el.reportValidity();
                    return false;
                }
            }
            return true;
        };

        const avanzar = () => {
            if (pasoValido()) ir(actual + 1);
        };

        form.addEventListener('change', aplicarCondiciones);
        siguiente.addEventListener('click', avanzar);
        atras.addEventListener('click', () => {
            if (actual > 0) return ir(actual - 1);
            mostrar(inicio);
            $('h2', inicio)?.focus({ preventScroll: true });
        });

        // Intro en un campo de texto equivale a «Continuar» (en el último paso, envía)
        form.addEventListener('keydown', (e) => {
            const el = e.target;
            if (e.key !== 'Enter' || actual === ultimo) return;
            if (el instanceof HTMLInputElement && !['checkbox', 'radio'].includes(el.type)) {
                e.preventDefault();
                avanzar();
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (actual !== ultimo || !pasoValido()) return;
            if (!(await enviar(form))) return;
            mostrar(exito);
            exito.classList.remove('anima');
            void exito.offsetWidth; // reinicia la animación del tick
            exito.classList.add('anima');
            exito.focus({ preventScroll: true });
            alaVista();
        });

        // Al elegir este recorrido (o volver a empezar), desde el primer paso y en blanco
        form.addEventListener('empezar', () => {
            form.reset();
            $$<HTMLInputElement>('[data-cifra]', form).forEach((el) => el.setCustomValidity(''));
            aplicarCondiciones();
            ir(0, false);
        });
    }

    $$<HTMLButtonElement>('[data-elige]', caja).forEach((boton) =>
        boton.addEventListener('click', () => {
            const form = formularios.find((f) => f.dataset.flujo === boton.dataset.elige);
            if (!form) return;
            form.dispatchEvent(new Event('empezar'));
            mostrar(form);
            $<HTMLElement>('.sim-paso:not([hidden]) .sim-paso-t', form)?.focus({ preventScroll: true });
            alaVista();
        }),
    );

    // «Hacer otra simulación»: vuelve a la elección
    $('#sim-otra', caja)?.addEventListener('click', () => {
        mostrar(inicio);
        $('h2', inicio)?.focus({ preventScroll: true });
        alaVista();
    });
}
