/**
 * Recibe el formulario de contacto y lo envía por correo con Resend (https://resend.com).
 * Es independiente del hosting: manejar(req, env) recibe la petición y las variables de entorno.
 * Variables (en .dev.vars para pruebas locales y en el panel de Cloudflare en producción):
 *   RESEND_API_KEY  clave de API de Resend (obligatoria)
 *   CONTACT_TO      dirección(es) que reciben las solicitudes, separadas por comas (obligatoria)
 *   MAIL_FROM       remitente. Por defecto "Cabrera Kapital Web <onboarding@resend.dev>"
 *                   (con esa dirección de prueba Resend solo permite escribir al correo de tu cuenta)
 */
const TIPOS = ['particular', 'pyme'];

// Campos admitidos y su etiqueta en el correo (el resto se ignora)
const ETIQUETAS = {
    tipo_cliente: 'Tipo de cliente',
    flujo: 'Simulador',
    nombre: 'Nombre',
    apellidos: 'Apellidos',
    telefono: 'Teléfono',
    correo: 'Correo',
    necesidad: 'Qué necesita',
    facturacion: 'Facturación anual',
    antiguedad: 'Años en funcionamiento',
    finalidad: 'Finalidad de la financiación',
    importe: 'Importe necesario',
    mensaje: 'Mensaje',
    // Simulador de hipoteca (views/Simulador.astro)
    motivo: 'Motivo del cambio',
    entidad: 'Entidad actual',
    precio: 'Precio de la vivienda (€)',
    plazo_compra: 'Cuándo quiere comprar',
    ubicacion: 'Ubicación de la vivienda',
    tipo_vivienda: 'Tipo de vivienda',
    uso: 'Uso de la vivienda',
    ahorros: 'Ahorros disponibles (€)',
    edad: 'Edad',
    firma: 'Firma de la hipoteca',
    pendiente: 'Capital pendiente (€)',
    fin: 'Año de fin de la hipoteca',
    tipo_hipoteca: 'Tipo de hipoteca',
    tramo_fijo_anios: 'Años a tipo fijo',
    tin: 'TIN (%)',
    diferencial: 'Diferencial sobre el euríbor (%)',
    vinculados: 'Productos vinculados (€/año)',
    titulares: 'Titulares',
    s1_situacion: 'Solicitante 1 · Situación laboral',
    s1_antiguedad: 'Solicitante 1 · Antigüedad laboral (años)',
    s1_ingresos: 'Solicitante 1 · Ingresos netos (€/mes)',
    s1_prestamos: 'Solicitante 1 · Otros préstamos (€/mes)',
    s2_situacion: 'Solicitante 2 · Situación laboral',
    s2_antiguedad: 'Solicitante 2 · Antigüedad laboral (años)',
    s2_ingresos: 'Solicitante 2 · Ingresos netos (€/mes)',
    s2_prestamos: 'Solicitante 2 · Otros préstamos (€/mes)',
};

const json = (datos, status = 200) =>
    new Response(JSON.stringify(datos), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });

const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Límite sencillo por IP (se reinicia si el servidor se "duerme"; frena abusos básicos)
const intentos = new Map();
function demasiadas(ip) {
    const ahora = Date.now();
    const ventana = 60 * 60 * 1000;
    const lista = (intentos.get(ip) ?? []).filter((t) => ahora - t < ventana);
    lista.push(ahora);
    intentos.set(ip, lista);
    return lista.length > 8;
}

export async function manejar(req, env = {}) {
    if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405);

    let form;
    try {
        form = await req.formData();
    } catch {
        return json({ ok: false, error: 'formato' }, 400);
    }

    // Campo trampa: las personas no lo ven; los bots sí lo rellenan. Respondemos "ok" sin enviar nada.
    if (String(form.get('_gotcha') ?? '').trim() !== '') return json({ ok: true });

    const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'desconocida';
    if (demasiadas(ip)) return json({ ok: false, error: 'limite' }, 429);

    // Datos limpios: solo los campos conocidos, recortados
    const d = {};
    for (const clave of Object.keys(ETIQUETAS)) {
        const v = form.get(clave);
        if (typeof v === 'string' && v.trim()) d[clave] = v.trim().slice(0, clave === 'mensaje' ? 3000 : 200);
    }

    const tipo = TIPOS.includes(d.tipo_cliente) ? d.tipo_cliente : 'particular';
    d.tipo_cliente = tipo === 'pyme' ? 'Empresa o autónomo' : 'Particular';

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo ?? '');
    // El teléfono es obligatorio en el formulario de empresas y en el simulador
    const telOk = tipo === 'pyme' || d.flujo ? (d.telefono ?? '').replace(/\D/g, '').length >= 9 : true;
    if (!d.nombre || !emailOk || !telOk || form.get('privacidad') !== 'on') {
        return json({ ok: false, error: 'datos' }, 400);
    }

    const clave = env.RESEND_API_KEY;
    const para = (env.CONTACT_TO ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    if (!clave || para.length === 0) return json({ ok: false, error: 'configuracion' }, 500);

    const filas = Object.entries(ETIQUETAS).filter(([k]) => d[k]);
    const texto = filas.map(([k, e]) => `${e}: ${d[k]}`).join('\n');
    const html =
        `<h2 style="font-family:Georgia,serif;margin:0 0 12px">Nueva solicitud desde la web</h2>` +
        `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:15px">` +
        filas
            .map(
                ([k, e]) =>
                    `<tr><td style="padding:6px 16px 6px 0;color:#55606e;vertical-align:top"><b>${esc(e)}</b></td>` +
                    `<td style="padding:6px 0;white-space:pre-wrap">${esc(d[k])}</td></tr>`,
            )
            .join('') +
        `</table>`;

    let respuesta;
    try {
        respuesta = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${clave}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: env.MAIL_FROM || 'Cabrera Kapital Web <onboarding@resend.dev>',
                to: para,
                reply_to: d.correo,
                subject: `Nueva solicitud (${d.flujo ? `Simulador · ${d.flujo}` : d.tipo_cliente}) · ${[d.nombre, d.apellidos].filter(Boolean).join(' ').replace(/[\r\n]+/g, ' ')}`,
                text: texto,
                html,
            }),
        });
    } catch (error) {
        console.error('Resend (red)', error);
        return json({ ok: false, error: 'envio' }, 502);
    }

    if (!respuesta.ok) {
        console.error('Resend', respuesta.status, await respuesta.text());
        return json({ ok: false, error: 'envio' }, 502);
    }
    return json({ ok: true });
}
