import { $, $$, reducedMotion } from './utils';

/**
 * PROTOTIPOS de diseño del simulador (components/prototipos). Son maquetas para enseñar al cliente:
 * recorren el caso «comprar vivienda» con 5 preguntas y NO envían nada.
 * Cuando el cliente elija una variante, borrar este archivo y la carpeta components/prototipos.
 */

type Pregunta = {
    id: string;
    tipo: 'cifra' | 'ops' | 'contacto';
    /** Texto del paso en el índice (variante B) */
    paso: string;
    /** Pregunta formal (variante B) */
    q: string;
    /** Cómo la dice el asesor (variante A) */
    chat: string;
    ayuda?: string;
    ud?: string;
    ph?: string;
    min?: number;
    max?: number;
    ops?: string[];
};

const PREGUNTAS: Pregunta[] = [
    {
        id: 'precio',
        tipo: 'cifra',
        paso: 'Vivienda',
        q: '¿Qué precio tiene la vivienda que quiere comprar?',
        chat: 'Para empezar, ¿qué precio tiene la vivienda que quiere comprar?',
        ud: '€',
        ph: '180.000',
        min: 50000,
        max: 5000000,
    },
    {
        id: 'ahorros',
        tipo: 'cifra',
        paso: 'Ahorro',
        q: '¿Cuántos ahorros puede aportar?',
        chat: '¿Y cuántos ahorros puede aportar a la compra?',
        ayuda: 'Lo ideal es aportar un 20 % del precio y un 10 % más para los gastos.',
        ud: '€',
        ph: '40.000',
        min: 0,
        max: 5000000,
    },
    {
        id: 'uso',
        tipo: 'ops',
        paso: 'Uso',
        q: '¿Qué uso le va a dar a la vivienda?',
        chat: 'Bien. ¿Qué uso le va a dar a la vivienda?',
        ops: ['Vivienda habitual', 'Segunda residencia', 'Inversión'],
    },
    {
        id: 'titulares',
        tipo: 'ops',
        paso: 'Titulares',
        q: '¿Compra solo o con otra persona?',
        chat: '¿Compra solo o con otra persona?',
        ops: ['Solo/a', 'Con otra persona'],
    },
    {
        id: 'contacto',
        tipo: 'contacto',
        paso: 'Contacto',
        q: '¿A quién llamamos?',
        chat: 'Con esto ya puedo estudiar su caso. ¿Cómo se llama y a qué número le llamo?',
    },
];

type Respuestas = Record<string, string>;

const nf = new Intl.NumberFormat('es-ES');
const eur = (n: number) => nf.format(Math.round(n)) + ' €';
const num = (v = '') => +v.replace(/\D/g, '');

/** Crea un elemento: h('p', { class: 'x' }, 'texto', otroNodo) */
function h<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    attrs: Record<string, string | boolean | undefined> = {},
    ...hijos: (Node | string | null | undefined)[]
) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (v === false || v === undefined) continue;
        el.setAttribute(k, v === true ? '' : v);
    }
    el.append(...hijos.filter((x): x is Node | string => x != null));
    return el;
}

/** Valida y devuelve el texto de la respuesta, o un error. */
function leer(p: Pregunta, valor: string, extra = ''): { ok: true; texto: string } | { ok: false; error: string } {
    if (p.tipo === 'cifra') {
        const n = num(valor);
        if (!valor.trim() || Number.isNaN(n)) return { ok: false, error: 'Escriba una cantidad.' };
        if (n < (p.min ?? 0) || n > (p.max ?? Infinity))
            return { ok: false, error: `Entre ${eur(p.min ?? 0)} y ${eur(p.max ?? 0)}.` };
        return { ok: true, texto: eur(n) };
    }
    if (p.tipo === 'contacto') {
        if (!valor.trim()) return { ok: false, error: 'Escriba su nombre.' };
        if (extra.replace(/\D/g, '').length < 9) return { ok: false, error: 'Escriba un teléfono de 9 cifras.' };
        return { ok: true, texto: `${valor.trim()} · ${extra.trim()}` };
    }
    return valor ? { ok: true, texto: valor } : { ok: false, error: 'Elija una opción.' };
}

/** Controles de respuesta (campo con unidad, opciones o nombre + teléfono). `responder` recibe el valor. */
function controles(p: Pregunta, clase: string, responder: (v: string, extra?: string) => void) {
    const caja = h('div', { class: `${clase}-resp` });
    const error = h('p', { class: `${clase}-error`, role: 'alert' });

    if (p.tipo === 'ops') {
        p.ops!.forEach((o) => {
            const b = h(
                'button',
                { type: 'button', class: `${clase}-op` },
                h('span', {}, o),
            );
            b.addEventListener('click', () => responder(o));
            caja.append(b);
        });
        return caja;
    }

    const form = h('form', { class: `${clase}-form`, novalidate: true });
    const entrada = (ph: string, tipo = 'text', modo?: string) =>
        h('input', { type: tipo, placeholder: ph, inputmode: modo, autocomplete: 'off', 'aria-label': ph });
    const campos =
        p.tipo === 'cifra'
            ? [entrada(p.ph ?? '', 'text', 'numeric')]
            : [entrada('Nombre', 'text'), entrada('Teléfono', 'tel', 'tel')];
    campos.forEach((c, i) => {
        const envoltura = h('span', { class: `${clase}-campo` }, c);
        if (p.tipo === 'cifra' && p.ud) envoltura.append(h('span', { class: `${clase}-ud` }, p.ud));
        if (i === 0) c.setAttribute('data-primero', '');
        form.append(envoltura);
    });
    // Miles mientras se escribe: 180000 → 180.000
    if (p.tipo === 'cifra')
        campos[0].addEventListener('input', () => {
            const n = num(campos[0].value);
            campos[0].value = campos[0].value.trim() ? nf.format(n) : '';
        });
    form.append(h('button', { type: 'submit', class: `${clase}-ok` }, 'Enviar'));
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const r = leer(p, campos[0].value, campos[1]?.value ?? '');
        if (!r.ok) {
            error.textContent = r.error;
            return;
        }
        error.textContent = '';
        responder(campos[0].value, campos[1]?.value);
    });
    caja.append(form, error);
    return caja;
}

const enfocar = (raiz: HTMLElement) =>
    setTimeout(() => $<HTMLElement>('[data-primero], button', raiz)?.focus({ preventScroll: true }), 30);

/* =====================================================================
 * A · Un asesor le guía (conversación)
 * ===================================================================== */
function initA() {
    const raiz = $('[data-pva]');
    if (!raiz) return;
    const log = $('.pva-log', raiz)!;
    const zona = $('.pva-zona', raiz)!;
    const asesores = $$('[data-asesor]', raiz);
    let avatar = ''; // foto del asesor elegido (se copia en la cabecera y en cada mensaje)
    const respuestas: Respuestas = {};

    /** Elige al azar a Alejandro u Olegario y devuelve su nombre de pila. */
    const elegirAsesor = () => {
        const a = asesores[Math.floor(Math.random() * asesores.length)];
        avatar = a.outerHTML;
        $('.pva-av', raiz)!.innerHTML = avatar;
        $('.pva-nombre', raiz)!.textContent = a.dataset.nombre ?? '';
        return (a.dataset.nombre ?? '').split(' ')[0];
    };
    let turno = 0; // para descartar mensajes de una conversación anterior

    const burbujaAsesor = (texto: string) =>
        h('div', { class: 'pva-msg' }, h('span', { class: 'pva-mini', 'aria-hidden': 'true' }), h('p', {}, texto));

    /** Cada mensaje lleva el número de su pregunta (data-q) para poder rehacer la conversación desde ahí. */
    const decir = async (texto: string, t: number, q = -1) => {
        const escribiendo = h('div', { class: 'pva-msg pva-esc', 'aria-hidden': 'true' }, h('span', { class: 'pva-mini' }), h('p', {}, h('i'), h('i'), h('i')));
        $$('.pva-mini', escribiendo).forEach((m) => (m.innerHTML = avatar));
        log.append(escribiendo);
        log.scrollTop = log.scrollHeight;
        await new Promise((r) => setTimeout(r, reducedMotion() ? 0 : 650));
        escribiendo.remove();
        if (t !== turno) return false;
        const b = burbujaAsesor(texto);
        b.dataset.q = String(q);
        $$('.pva-mini', b).forEach((m) => (m.innerHTML = avatar));
        log.append(b);
        log.scrollTop = log.scrollHeight;
        return true;
    };

    const preguntar = async (i: number) => {
        const t = ++turno;
        zona.replaceChildren();
        const p = PREGUNTAS[i];
        if (!p) {
            const nombre = (respuestas.contacto ?? '').split(' · ')[0];
            await decir(`Gracias, ${nombre}. Estudio su caso con las entidades y le llamo en 24–48 horas laborables. Un saludo.`, t, PREGUNTAS.length);
            zona.append(h('p', { class: 'pva-fin' }, 'Maqueta: aquí se enviaría la solicitud.'));
            return;
        }
        if (!(await decir(p.chat, t, i))) return;
        if (p.ayuda && !(await decir(p.ayuda, t, i))) return;
        zona.append(
            controles(p, 'pva', (v, extra) => {
                const r = leer(p, v, extra);
                if (!r.ok) return;
                respuestas[p.id] = r.texto;
                // La respuesta del cliente: al pulsarla se borra desde esa pregunta y se vuelve a hacer
                const mia = h('button', { type: 'button', class: 'pva-yo', 'data-q': String(i), title: 'Cambiar esta respuesta' }, r.texto, h('small', {}, 'Cambiar'));
                mia.addEventListener('click', () => {
                    $$('[data-q]', log).forEach((m) => +m.dataset.q! >= i && m.remove());
                    preguntar(i);
                });
                log.append(mia);
                preguntar(i + 1);
            }),
        );
        enfocar(zona);
    };

    const empezar = async (intro: string) => {
        const t = ++turno;
        log.replaceChildren();
        zona.replaceChildren();
        raiz.hidden = false;
        raiz.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
        if (!(await decir(intro, t))) return;
        if (t === turno) preguntar(0);
    };

    $$<HTMLButtonElement>('[data-pva-empieza]').forEach((b) =>
        b.addEventListener('click', () => {
            const nombre = elegirAsesor();
            empezar(
                b.dataset.pvaEmpieza === 'mejorar'
                    ? `Hola, soy ${nombre}. Vamos a ver cuánto puede ahorrar con su hipoteca. (En la maqueta sigue el recorrido de compra.)`
                    : `Hola, soy ${nombre}. Le hago unas preguntas rápidas y le preparo un estudio sin compromiso.`,
            );
        }),
    );
}

/* =====================================================================
 * B · Su expediente (índice + ficha «Su caso» en directo)
 * ===================================================================== */
function initB() {
    const raiz = $('[data-pvb]');
    if (!raiz) return;
    const indice = $('.pvb-indice', raiz)!;
    const panel = $('.pvb-panel', raiz)!;
    const ficha = $('.pvb-ficha', raiz)!;
    const respuestas: Respuestas = {};
    let actual = 0;

    const pintarIndice = () =>
        indice.replaceChildren(
            ...PREGUNTAS.map((p, i) => {
                const estado = respuestas[p.id] ? 'hecho' : i === actual ? 'actual' : '';
                const li = h('li', { class: estado, 'aria-current': i === actual ? 'step' : undefined });
                const b = h('button', { type: 'button', disabled: !respuestas[p.id] && i !== actual }, h('span', { class: 'pvb-num' }, respuestas[p.id] ? '✓' : String(i + 1).padStart(2, '0')), h('span', {}, p.paso));
                b.addEventListener('click', () => ir(i));
                li.append(b);
                return li;
            }),
        );

    const pintarFicha = () => {
        const precio = num(respuestas.precio);
        const ahorros = num(respuestas.ahorros);
        const filas = PREGUNTAS.filter((p) => p.tipo !== 'contacto').map((p) =>
            h('div', { class: 'pvb-fila' }, h('dt', {}, p.paso), h('dd', {}, respuestas[p.id] ?? '—')),
        );
        const bloque = h('div', { class: 'pvb-calc' });
        if (precio && respuestas.ahorros !== undefined) {
            // Importe orientativo: precio + 10 % de gastos − ahorros
            const importe = Math.max(0, precio * 1.1 - ahorros);
            const pct = Math.min(100, Math.round((importe / precio) * 100));
            const nivel = pct <= 80 ? 'bien' : pct <= 90 ? 'medio' : 'alto';
            const barra = h('span', { class: 'pvb-barra' }, h('i', { class: nivel, style: `width:${pct}%` }), h('b', { style: 'left:80%', title: '80 %' }));
            bloque.append(
                h('span', { class: 'pvb-et' }, 'Importe a financiar (orientativo)'),
                h('strong', {}, eur(importe)),
                barra,
                h('p', {}, `${pct} % del precio. ${nivel === 'bien' ? 'Dentro de lo que suelen financiar los bancos (hasta un 80 %).' : 'Por encima del 80 % habitual: lo estudiaremos con más detalle.'}`),
            );
        } else {
            bloque.append(h('p', { class: 'pvb-vacio' }, 'Con el precio y los ahorros le calculamos el importe a financiar.'));
        }
        ficha.replaceChildren(h('span', { class: 'pvb-et' }, 'Su caso'), h('dl', {}, ...filas), bloque);
    };

    const ir = (i: number, foco = true) => {
        actual = i;
        pintarIndice();
        const p = PREGUNTAS[i];
        if (!p) {
            panel.replaceChildren(
                h('span', { class: 'pvb-et' }, 'Solicitud lista'),
                h('h4', {}, 'Gracias. Le llamamos en 24–48 horas laborables.'),
                h('p', { class: 'pvb-ayuda' }, 'Maqueta: aquí se enviaría la solicitud.'),
            );
            return;
        }
        panel.replaceChildren(
            h('span', { class: 'pvb-et' }, `${String(i + 1).padStart(2, '0')} · ${p.paso}`),
            h('h4', {}, p.q),
            p.ayuda ? h('p', { class: 'pvb-ayuda' }, p.ayuda) : '',
            controles(p, 'pvb', (v, extra) => {
                const r = leer(p, v, extra);
                if (!r.ok) return;
                respuestas[p.id] = r.texto;
                pintarFicha();
                ir(PREGUNTAS.findIndex((q) => !respuestas[q.id]) === -1 ? PREGUNTAS.length : PREGUNTAS.findIndex((q) => !respuestas[q.id]));
            }),
        );
        if (foco) enfocar(panel);
    };

    pintarFicha();
    ir(0, false);
}

initA();
initB();
