import { $ } from './utils';

/**
 * Formulario de contacto
 * - Con PUBLIC_FORMSPREE_URL definida en .env, envía los datos a Formspree.
 * - Sin ella, solo muestra el aviso de demostración
 */
const ENDPOINT = import.meta.env.PUBLIC_FORMSPREE_URL as string | undefined;

export function initFormulario() {
    const form = $<HTMLFormElement>('#form');
    const aviso = $('#sent');
    if (!form || !aviso) return;

    const mostrar = (texto: string, ok = true) => {
        aviso.textContent = texto;
        aviso.dataset.estado = ok ? 'ok' : 'error';
        aviso.hidden = false;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.reportValidity()) return;

        if (!ENDPOINT) {
            mostrar('Modo demostración: el formulario todavía no envía nada.');
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
            mostrar(
                'Gracias. Hemos recibido su solicitud y le responderemos en 24-48 horas laborales.',
            );
        } catch {
            mostrar(
                'No hemos podido enviar el formulario. Inténtelo de nuevo o llámenos al 606 395 427.',
                false,
            );
        } finally {
            if (boton) boton.disabled = false;
        }
    });
}