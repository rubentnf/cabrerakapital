import { $, $$ } from './utils';

/**
 * Formularios de contacto.
 * - Los datos se envían a /api/contacto (función netlify/functions/contacto.mjs), que los manda por
 *   correo con Resend. Para probar en local hay que usar `npx netlify-cli dev` en vez de `npm run dev`.
 * - Con PUBLIC_FORM_ENDPOINT se puede apuntar a otro servicio (por ejemplo Formspree).
 * - Hay dos formularios: uno corto para particulares (#form) y uno por pasos para
 *   empresas y autónomos (#form-pyme). El selector «Soy…» muestra uno u otro.
 */
const ENDPOINT = (import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined) || '/api/contacto';

/** Envío común a los dos formularios. Devuelve true si se envió (o se simuló) bien. */
async function enviar(form: HTMLFormElement): Promise<boolean> {
    const aviso = $('[data-aviso]', form);
    const mostrar = (texto: string, ok = true) => {
        if (!aviso) return;
        aviso.textContent = texto;
        aviso.dataset.estado = ok ? 'ok' : 'error';
        aviso.hidden = false;
    };

    const boton = $<HTMLButtonElement>('button[type="submit"]', form);
    if (boton) boton.disabled = true;
    try {
        const respuesta = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: new FormData(form),
        });
        if (!respuesta.ok) throw new Error(String(respuesta.status));
        // /api/contacto responde {ok:true}; otros servicios (Formspree) también aceptan la petición
        const datos = await respuesta.json().catch(() => ({ ok: true }));
        if (datos.ok === false) throw new Error(String(datos.error));
        mostrar(form.dataset.exito ?? '');
        return true;
    } catch {
        mostrar(form.dataset.error ?? '', false);
        return false;
    } finally {
        if (boton) boton.disabled = false;
    }
}

/** Formulario por pasos para empresas: facturación, antigüedad, finalidad, importe y contacto. */
function initPasos(form: HTMLFormElement) {
    const pasos = $$<HTMLElement>('.wiz-step', form);
    const barras = $$('.wiz-bar i', form);
    const contador = $('[data-wiz-n]', form);
    const atras = $<HTMLButtonElement>('[data-wiz-back]', form)!;
    const siguiente = $<HTMLButtonElement>('[data-wiz-next]', form)!;
    const enviarBtn = $<HTMLButtonElement>('[data-wiz-send]', form)!;
    const ultimo = pasos.length - 1;
    let actual = 0;
    let conPuntero = false; // el avance automático solo ocurre al pulsar o tocar, no con el teclado

    const hayRespuesta = (i: number) =>
        i === ultimo || $$<HTMLInputElement>('input[type="radio"]', pasos[i]).some((r) => r.checked);

    const ir = (i: number, enfocar = true) => {
        actual = Math.max(0, Math.min(ultimo, i));
        pasos.forEach((p, n) => (p.hidden = n !== actual));
        barras.forEach((b, n) => b.classList.toggle('on', n <= actual));
        if (contador) contador.textContent = String(actual + 1);
        atras.hidden = actual === 0;
        siguiente.hidden = actual === ultimo;
        enviarBtn.hidden = actual !== ultimo;
        siguiente.disabled = !hayRespuesta(actual);
        if (enfocar) pasos[actual].focus({ preventScroll: true });
    };

    form.addEventListener('pointerdown', () => (conPuntero = true));
    form.addEventListener('keydown', () => (conPuntero = false));
    form.addEventListener('change', (e) => {
        if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'radio') return;
        siguiente.disabled = false;
        if (conPuntero && actual < ultimo) setTimeout(() => ir(actual + 1), 220);
    });
    siguiente.addEventListener('click', () => ir(actual + 1));
    atras.addEventListener('click', () => ir(actual - 1));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        if (await enviar(form)) {
            form.reset();
            form.classList.add('hecho');
            ir(0, false);
        }
    });

    ir(0, false);
}

export function initFormulario() {
    const corto = $<HTMLFormElement>('#form');
    const pymes = $<HTMLFormElement>('#form-pyme');
    if (!corto || !pymes) return;

    // Particular / empresa: se muestra solo el formulario del tipo elegido.
    // Con ?tipo=pyme en la URL, la página llega ya con el formulario de empresas.
    const aplicarTipo = (tipo: string) => {
        corto.hidden = tipo === 'pyme';
        pymes.hidden = tipo !== 'pyme';
    };
    const radios = $$<HTMLInputElement>('#tipo input[name="tipo_cliente"]');
    const deUrl = new URLSearchParams(location.search).get('tipo');
    const inicial = radios.find((r) => r.value === deUrl) ?? radios.find((r) => r.checked);
    if (inicial) inicial.checked = true;
    aplicarTipo(inicial?.value ?? 'particular');
    radios.forEach((r) => r.addEventListener('change', () => aplicarTipo(r.value)));

    corto.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!corto.reportValidity()) return;
        if (await enviar(corto)) corto.reset();
    });

    initPasos(pymes);
}
