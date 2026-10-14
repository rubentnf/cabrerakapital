import { $, $$, reducedMotion } from './utils';
import { enviar } from './formulario';

/**
 * Simulador de hipoteca (views/Simulador.astro), en forma de conversación.
 * - En la portada se elige el recorrido con una de dos frases: comprar vivienda o pagar menos por la
 *   hipoteca actual. Después, uno de los dos socios (al azar) hace las preguntas de una en una.
 * - Las preguntas salen de los formularios del recorrido (components/simulador), que están siempre
 *   ocultos: cada campo, grupo de opciones o desplegable es una pregunta. La respuesta se contesta con
 *   botones (opciones) o con un campo y «Enviar», se guarda en el formulario y se valida con sus reglas.
 * - Cada respuesta queda como un mensaje del cliente: al pulsarlo se vuelve a esa pregunta.
 * - Los bloques con data-si="campo:valor1,valor2" solo se preguntan (y se envían) si ese campo tiene uno
 *   de esos valores. Mientras no aplican van `disabled`, así no se validan ni se envían.
 * - Al aceptar la privacidad se envía igual que el formulario de contacto (formulario.ts).
 */

type Control = HTMLInputElement | HTMLSelectElement;

/** Una pregunta de la conversación: un campo, un grupo de opciones o la casilla de privacidad. */
type Pregunta = {
    el: HTMLElement;
    tipo: 'ops' | 'lista' | 'campo' | 'chk';
    paso: HTMLElement;
};

/** Lo que tarda el asesor en «escribir» cada mensaje (ms) */
const ESCRIBIENDO = 650;
/** Con más opciones que estas, un desplegable se contesta con la lista en vez de con botones */
const MAX_BOTONES = 10;

export function initSimulador() {
    const caja = $('#simbox');
    if (!caja) return;

    const inicio = $('#sim-inicio', caja)!;
    const chat = $('[data-chat]', caja)!;
    const log = $('.sima-log', chat)!;
    const resp = $('[data-resp]', chat)!;
    const exito = $('#sim-exito', caja)!;
    const formularios = $$<HTMLFormElement>('form[data-flujo]', caja);
    const asesores = $$('[data-asesor]', chat);
    const {
        rango = '',
        holaComprar = '',
        holaMejorar = '',
        despedida = '',
        cambiar = '',
        sobreUsted = '',
        sobreOtra = '',
        continuar = '',
        enviar: textoEnviar = '',
    } = caja.dataset;
    const locale = caja.dataset.lang === 'en' ? 'en-GB' : 'es-ES';

    let avatar = ''; // foto del asesor elegido (se copia en la cabecera y en cada mensaje)
    let turno = 0; // para descartar mensajes de una conversación o de una pregunta anteriores

    const crear = <K extends keyof HTMLElementTagNameMap>(tag: K, clase = '', texto = '') => {
        const el = document.createElement(tag);
        if (clase) el.className = clase;
        if (texto) el.textContent = texto;
        return el;
    };

    /** La ventana del chat entera a la vista (si no lo está ya). */
    const ventana = $('.sima', chat)!;
    const alaVista = () => {
        const r = ventana.getBoundingClientRect();
        if (r.top < 60 || r.bottom > window.innerHeight + 2)
            ventana.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    };

    // Como en WhatsApp: cada vez que entra un mensaje, la conversación baja hasta el último
    new MutationObserver(() =>
        log.scrollTo({ top: log.scrollHeight, behavior: reducedMotion() ? 'auto' : 'smooth' }),
    ).observe(log, { childList: true });

    // ---------- Cifras (mismas reglas que tenía el formulario por pasos) ----------
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

    // ---------- Mensajes ----------
    /** Elige al azar a Alejandro u Olegario y devuelve su nombre de pila. */
    const elegirAsesor = () => {
        const a = asesores[Math.floor(Math.random() * asesores.length)];
        avatar = a.outerHTML;
        $('.sima-av', chat)!.innerHTML = avatar;
        $('.sima-nombre', chat)!.textContent = a.dataset.nombre ?? '';
        return (a.dataset.nombre ?? '').split(' ')[0];
    };

    const burbuja = (contenido: (string | Node)[], clase = '') => {
        const msg = crear('div', `sima-msg ${clase}`.trim());
        const mini = crear('span', 'sima-mini');
        mini.innerHTML = avatar;
        mini.setAttribute('aria-hidden', 'true');
        const p = crear('p');
        p.append(...contenido);
        msg.append(mini, p);
        return msg;
    };

    /** El asesor «escribe» y dice `texto`. `q`: pregunta a la que pertenece (para borrarlo al volver). */
    const decir = async (texto: string, t: number, q = -1) => {
        const escribiendo = burbuja(['i', 'i', 'i'].map((x) => crear(x as 'i')), 'sima-esc');
        escribiendo.setAttribute('aria-hidden', 'true');
        log.append(escribiendo);
        if (!reducedMotion()) await new Promise((r) => setTimeout(r, ESCRIBIENDO));
        escribiendo.remove();
        if (t !== turno) return false;
        const msg = burbuja([texto]);
        msg.dataset.q = String(q);
        log.append(msg);
        return true;
    };

    /** Borra de la conversación lo que pertenece a la pregunta `desde` en adelante. */
    const borrarDesde = (desde: number) =>
        $$('[data-q]', log).forEach((m) => +m.dataset.q! >= desde && m.remove());

    /** Texto de la etiqueta sin el asterisco de obligatorio. */
    const textoDe = (el: Element | null | undefined) => {
        if (!el) return '';
        const copia = el.cloneNode(true) as HTMLElement;
        $$('.req', copia).forEach((r) => r.remove());
        return copia.textContent?.trim() ?? '';
    };

    // ---------- Conversación de un recorrido ----------
    function conversar(form: HTMLFormElement) {
        const condicionales = $$<HTMLFieldSetElement>('[data-si]', form);
        const preguntas: Pregunta[] = $$<HTMLElement>('.campo, .sim-ops, .chk', form).map((el) => ({
            el,
            tipo: el.matches('.sim-ops') ? 'ops' : el.matches('.chk') ? 'chk' : $('select', el) ? 'lista' : 'campo',
            paso: el.closest<HTMLElement>('[data-paso]')!,
        }));

        const aplicarCondiciones = () =>
            condicionales.forEach((bloque) => {
                const [campo, valores] = bloque.dataset.si!.split(':');
                const elegido = (form.elements.namedItem(campo) as RadioNodeList | null)?.value ?? '';
                const visible = valores.split(',').includes(elegido);
                bloque.hidden = !visible;
                bloque.disabled = !visible;
            });

        /** Si la pregunta aplica con las respuestas actuales (no está en un bloque desactivado). */
        const aplica = (p: Pregunta) => !p.el.closest('fieldset[disabled]');

        /**
         * Frase del asesor al empezar un grupo de preguntas. Datos de los titulares: con dos, «Empecemos
         * por usted» y «Ahora, los datos de la otra persona»; con uno, nada. En los demás grupos, su rótulo
         * («Primeros años, a tipo fijo»…).
         */
        const grupoDe = (p: Pregunta) => {
            const sol = p.el.closest<HTMLElement>('.sim-sol');
            if (sol) {
                const titulares = $$('.sim-sol', p.paso).filter((s) => !s.closest('fieldset[disabled]'));
                if (titulares.length < 2) return '';
                return titulares.indexOf(sol) === 0 ? sobreUsted : sobreOtra;
            }
            let grupo = '';
            for (const sub of $$('.sim-sub', p.paso)) {
                if (sub.closest('fieldset[disabled]') || sub.closest('.sim-sol')) continue;
                if (sub.compareDocumentPosition(p.el) & Node.DOCUMENT_POSITION_FOLLOWING) grupo = textoDe(sub);
            }
            return grupo;
        };

        /** Deja la respuesta del cliente en la conversación y pasa a la siguiente pregunta. */
        const responder = (q: number, texto: string) => {
            const mia = crear('button', 'sima-yo');
            mia.type = 'button';
            mia.dataset.q = String(q);
            mia.append(texto, crear('small', '', cambiar));
            mia.addEventListener('click', () => preguntar(q));
            log.append(mia);
            preguntar(q + 1);
        };

        /** Controles para contestar: botones, lista o campo con «Enviar», según la pregunta. */
        const controles = (q: number) => {
            const p = preguntas[q];
            const error = crear('p', 'sima-error');
            error.setAttribute('role', 'alert');

            // Opciones: un botón por opción (la elegida antes, marcada)
            const botones = (ops: { texto: string; elegida: boolean; elegir: () => void }[]) => {
                const caja = crear('div', 'sima-ops');
                ops.forEach((o) => {
                    const b = crear('button', 'sima-op', o.texto);
                    b.type = 'button';
                    if (o.elegida) b.classList.add('elegida');
                    b.addEventListener('click', () => {
                        o.elegir();
                        responder(q, o.texto);
                    });
                    caja.append(b);
                });
                return caja;
            };

            if (p.tipo === 'ops') {
                const radios = $$<HTMLInputElement>('input[type="radio"]', p.el);
                return botones(
                    radios.map((r) => ({
                        texto: textoDe(r.closest('label')),
                        elegida: r.checked,
                        elegir: () => {
                            r.checked = true;
                            form.dispatchEvent(new Event('change'));
                        },
                    })),
                );
            }

            const real = $<Control>('input, select', p.el)!;
            if (p.tipo === 'lista' && real instanceof HTMLSelectElement) {
                const opciones = [...real.options].filter((o) => o.value);
                if (opciones.length <= MAX_BOTONES)
                    return botones(
                        opciones.map((o) => ({
                            texto: o.text,
                            elegida: o.value === real.value,
                            elegir: () => (real.value = o.value),
                        })),
                    );
            }

            // Campo (o lista larga) con «Enviar»; en la privacidad, casilla y «Enviar solicitud»
            const mini = crear('form', 'sima-form');
            mini.noValidate = true;
            let visible: Control;
            if (p.tipo === 'chk') {
                const chk = real as HTMLInputElement;
                const etiqueta = crear('label', 'chk sima-chk');
                visible = crear('input');
                visible.type = 'checkbox';
                visible.checked = chk.checked;
                const texto = $('span', p.el)!.cloneNode(true);
                etiqueta.append(visible, texto);
                mini.append(etiqueta);
            } else if (real instanceof HTMLSelectElement) {
                visible = real.cloneNode(true) as HTMLSelectElement;
                visible.removeAttribute('name');
                visible.value = real.value;
                visible.setAttribute('aria-label', textoDe($('.campo-t', p.el)));
                mini.append(visible);
            } else {
                const campo = crear('span', 'sima-campo');
                visible = real.cloneNode(true) as HTMLInputElement;
                visible.removeAttribute('name');
                visible.removeAttribute('data-cifra');
                visible.value = real.value;
                visible.setAttribute('aria-label', textoDe($('.campo-t', p.el)));
                campo.append(visible);
                const ud = $('.campo-ud', p.el);
                if (ud) campo.append(ud.cloneNode(true));
                mini.append(campo);
            }
            const ok = crear('button', 'sima-ok', p.tipo === 'chk' ? textoEnviar : '');
            ok.type = 'submit';
            if (p.tipo !== 'chk') {
                ok.setAttribute('aria-label', continuar);
                ok.innerHTML = '<span aria-hidden="true">→</span>';
            }
            mini.append(ok);

            mini.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (real instanceof HTMLInputElement && real.type === 'checkbox')
                    real.checked = (visible as HTMLInputElement).checked;
                else real.value = visible.value;
                if (real.matches('[data-cifra]')) {
                    validarCifra(real as HTMLInputElement);
                    const n = leer(real as HTMLInputElement);
                    if (real.checkValidity() && !Number.isNaN(n)) real.value = formato(real as HTMLInputElement).format(n);
                }
                if (!real.checkValidity()) {
                    error.textContent = real.validationMessage;
                    visible.focus();
                    return;
                }
                error.textContent = '';
                if (p.tipo !== 'chk') {
                    const ud = $('.campo-ud', p.el)?.textContent;
                    const texto =
                        real instanceof HTMLSelectElement ? real.selectedOptions[0].text : real.value.trim();
                    return responder(q, !texto ? '—' : ud ? `${texto} ${ud}` : texto);
                }
                // Último paso: se envía la solicitud
                ok.disabled = true;
                const enviado = await enviar(form);
                ok.disabled = false;
                if (!enviado) {
                    error.textContent = form.dataset.error ?? '';
                    return;
                }
                terminar();
            });
            const caja = crear('div');
            caja.append(mini, error);
            return caja;
        };

        /** Hace la pregunta `q` (o la siguiente que aplique) con su contexto: paso, grupo y ayuda. */
        const preguntar = async (desde: number) => {
            const t = ++turno;
            aplicarCondiciones();
            borrarDesde(desde);
            resp.replaceChildren();
            let q = desde;
            while (q < preguntas.length && !aplica(preguntas[q])) q++;
            const p = preguntas[q];
            if (!p) return;
            let previa = desde - 1;
            while (previa >= 0 && !aplica(preguntas[previa])) previa--;
            const antes = preguntas[previa];

            // Al empezar un paso, el asesor lo presenta («Cuéntenos más sobre la vivienda»)
            if (antes?.paso !== p.paso) {
                if (!(await decir(textoDe($('.sim-paso-t', p.paso)), t, q))) return;
                const intro = $(':scope > p', p.paso);
                if (intro && !(await decir(textoDe(intro), t, q))) return;
            }
            const grupo = grupoDe(p);
            if (grupo && (!antes || grupoDe(antes) !== grupo || antes.paso !== p.paso))
                if (!(await decir(grupo, t, q))) return;
            if (p.tipo !== 'chk') {
                const titulo = p.tipo === 'ops' ? $('legend', p.el) : $('.campo-t', p.el);
                if (!(await decir(textoDe(titulo), t, q))) return;
                const ayuda = $('.campo-ayuda', p.el);
                if (ayuda && !(await decir(textoDe(ayuda), t, q))) return;
            }
            resp.replaceChildren(controles(q));
            $<HTMLElement>('input, select, button', resp)?.focus({ preventScroll: true });
            log.scrollTop = log.scrollHeight;
            alaVista();
        };

        /** Solicitud enviada: el asesor se despide por el nombre y aparece la confirmación. */
        const terminar = async () => {
            const nombre = (form.elements.namedItem('nombre') as HTMLInputElement | null)?.value.trim() ?? '';
            const t = ++turno;
            resp.replaceChildren();
            if (!(await decir(despedida.replace('{n}', nombre), t, preguntas.length))) return;
            exito.hidden = false;
            exito.classList.remove('anima');
            void exito.offsetWidth; // reinicia la animación del tick
            exito.classList.add('anima');
            exito.focus({ preventScroll: true });
            alaVista();
        };

        // Empieza en blanco: saludo del asesor y primera pregunta
        form.reset();
        $$<HTMLInputElement>('[data-cifra]', form).forEach((el) => el.setCustomValidity(''));
        const nombre = elegirAsesor();
        const hola = form.dataset.flujo === 'mejorar' ? holaMejorar : holaComprar;
        const t = ++turno;
        log.replaceChildren();
        resp.replaceChildren();
        exito.hidden = true;
        chat.hidden = false;
        ventana.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
        decir(hola.replace('{n}', nombre), t).then((sigue) => {
            if (sigue) preguntar(0);
        });
    }

    $$<HTMLButtonElement>('[data-elige]', caja).forEach((boton) =>
        boton.addEventListener('click', () => {
            const form = formularios.find((f) => f.dataset.flujo === boton.dataset.elige);
            if (form) conversar(form);
        }),
    );

    // «Hacer otra simulación»: vuelve a las dos frases
    $('#sim-otra', caja)?.addEventListener('click', () => {
        ++turno;
        chat.hidden = true;
        inicio.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
        $('h1', inicio)?.focus({ preventScroll: true });
    });
}
