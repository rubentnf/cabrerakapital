/**
 * Recibe el formulario de contacto y lo envía por correo con Resend (https://resend.com).
 * Variables de entorno (en .env para pruebas locales y en el panel de Netlify en producción):
 *   RESEND_API_KEY  clave de API de Resend (obligatoria)
 *   CONTACT_TO      dirección(es) que reciben las solicitudes, separadas por comas (obligatoria)
 *   MAIL_FROM       remitente. Por defecto "Cabrera Kapital Web <onboarding@resend.dev>"
 *                   (con esa dirección de prueba Resend solo permite escribir al correo de tu cuenta)
 */
const TIPOS = ['particular', 'pyme'];

// Campos admitidos y su etiqueta en el correo (el resto se ignora)
const ETIQUETAS = {
    tipo_cliente: 'Tipo de cliente',
    nombre: 'Nombre',
    telefono: 'Teléfono',
    correo: 'Correo',
    necesidad: 'Qué necesita',
    facturacion: 'Facturación anual',
    antiguedad: 'Años en funcionamiento',
    finalidad: 'Finalidad de la financiación',
    importe: 'Importe necesario',
    mensaje: 'Mensaje',
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

export default async (req) => {
    if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405);

    let form;
    try {
        form = await req.formData();
    } catch {
        return json({ ok: false, error: 'formato' }, 400);
    }

    // Campo trampa: las personas no lo ven; los bots sí lo rellenan. Respondemos "ok" sin enviar nada.
    if (String(form.get('_gotcha') ?? '').trim() !== '') return json({ ok: true });

    const ip = req.headers.get('x-nf-client-connection-ip') ?? req.headers.get('x-forwarded-for') ?? 'desconocida';
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
    const telOk = tipo === 'pyme' ? (d.telefono ?? '').replace(/\D/g, '').length >= 9 : true;
    if (!d.nombre || !emailOk || !telOk || form.get('privacidad') !== 'on') {
        return json({ ok: false, error: 'datos' }, 400);
    }

    const clave = process.env.RESEND_API_KEY;
    const para = (process.env.CONTACT_TO ?? '').split(',').map((s) => s.trim()).filter(Boolean);
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

    const respuesta = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${clave}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            from: process.env.MAIL_FROM || 'Cabrera Kapital Web <onboarding@resend.dev>',
            to: para,
            reply_to: d.correo,
            subject: `Nueva solicitud (${d.tipo_cliente}) · ${d.nombre.replace(/[\r\n]+/g, ' ')}`,
            text: texto,
            html,
        }),
    });

    if (!respuesta.ok) {
        console.error('Resend', respuesta.status, await respuesta.text());
        return json({ ok: false, error: 'envio' }, 502);
    }
    return json({ ok: true });
};

export const config = { path: '/api/contacto' };
