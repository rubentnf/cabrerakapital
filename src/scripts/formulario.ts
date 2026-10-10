import { $, $$ } from './utils';

/**
 * Formulario de contacto.
 * - Con PUBLIC_FORMSPREE_URL definida en .env, envía los datos a Formspree.
 * - Sin ella, solo muestra el aviso de demostración (útil mientras se prueba en local).
 */
const ENDPOINT = import.meta.env.PUBLIC_FORMSPREE_URL as string | undefined;

export function initFormulario() {
    const form = $<HTMLFormElement>('#form');
    const aviso = $('#sent');
    if (!form || !aviso) return;

    // Particular / pyme: se muestran solo los campos del tipo elegido y se desactivan los demás
    // para que no se envíen. Con ?tipo=pyme en la URL, el formulario llega ya preseleccionado.
    const grupos = $$('[data-grupo]', form);
    const aplicarTipo = (tipo: string) => {
        grupos.forEach((g) => {
            const activo = g.dataset.grupo === tipo;
            g.hidden = !activo;
            $$<HTMLInputElement | HTMLSelectElement>('input, select', g).forEach(
                (c) => (c.disabled = !activo),
            );
        });
    };
    const radios = $$<HTMLInputElement>('input[name="tipo_cliente"]', form);
    const deUrl = new URLSearchParams(location.search).get('tipo');
    const inicial = radios.find((r) => r.value === deUrl) ?? radios.find((r) => r.checked);
    if (inicial) inicial.checked = true;
    aplicarTipo(inicial?.value ?? 'particular');
    radios.forEach((r) => r.addEventListener('change', () => aplicarTipo(r.value)));

    const mostrar = (texto: string, ok = true) => {
        aviso.textContent = texto;
        aviso.dataset.estado = ok ? 'ok' : 'error';
        aviso.hidden = false;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.reportValidity()) return;

        if (!ENDPOINT) {
            mostrar(form.dataset.demo ?? '');
            return;
        }

        const boton = $<HTMLButtonElement>('button[type="submit"]', form);
        if (boton) boton.disabled = true;
        try {
            const respuesta = await fetch(ENDPOINT, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: new FormData(form),
            });
            if (!respuesta.ok) throw new Error(String(respuesta.status));
            form.reset();
            mostrar(form.dataset.exito ?? '');
        } catch {
            mostrar(form.dataset.error ?? '', false);
        } finally {
            if (boton) boton.disabled = false;
        }
    });
}
