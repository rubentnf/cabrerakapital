/**
 * Reseñas de Google del negocio para la sección «Opiniones» (components/Resenas.astro).
 * Usa la API de Google Places (New): nota media, número de reseñas y hasta 5 reseñas, elegidas por
 * Google. Se guardan 6 horas en la caché de Cloudflare, así que a Google solo se le pregunta unas
 * pocas veces al día sea cual sea el tráfico de la web.
 * Variables (en .dev.vars para pruebas locales y como secreto en Cloudflare en producción):
 *   GOOGLE_PLACES_KEY  clave de API de Google Cloud con «Places API (New)» activada (obligatoria)
 *   GOOGLE_PLACE_ID    identificador del negocio en Google. Si falta, se busca por PLACE_QUERY
 *   GOOGLE_PLACE_QUERY texto para buscarlo. Por defecto «Cabrera Kapital La Laguna»
 * Respuesta: { ok, puntuacion, total, enlace, resenas: [{ nombre, enlaceAutor, foto, texto, estrellas, fecha }] }
 */
const API = 'https://places.googleapis.com/v1';
const CACHE_SEGUNDOS = 6 * 60 * 60;
const BUSQUEDA = 'Cabrera Kapital La Laguna';

const json = (datos, estado = 200, segundos = 0) =>
    new Response(JSON.stringify(datos), {
        status: estado,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': segundos ? `public, max-age=${segundos}` : 'no-store',
        },
    });

/** Busca el negocio por texto y devuelve su Place ID (solo si no se ha configurado GOOGLE_PLACE_ID). */
async function buscarId(env) {
    const r = await fetch(`${API}/places:searchText`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': env.GOOGLE_PLACES_KEY,
            'X-Goog-FieldMask': 'places.id',
        },
        body: JSON.stringify({ textQuery: env.GOOGLE_PLACE_QUERY || BUSQUEDA, languageCode: 'es' }),
    });
    if (!r.ok) throw new Error(`searchText ${r.status}`);
    return (await r.json()).places?.[0]?.id;
}

async function consultar(env, idioma) {
    const id = env.GOOGLE_PLACE_ID || (await buscarId(env));
    if (!id) throw new Error('No se encuentra el negocio en Google');
    const r = await fetch(`${API}/places/${encodeURIComponent(id)}?languageCode=${idioma}`, {
        headers: {
            'X-Goog-Api-Key': env.GOOGLE_PLACES_KEY,
            'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
        },
    });
    if (!r.ok) throw new Error(`places ${r.status}`);
    const p = await r.json();
    return {
        ok: true,
        puntuacion: p.rating ?? null,
        total: p.userRatingCount ?? null,
        enlace: p.googleMapsUri ?? null,
        // Se muestran todas las que da Google (sin filtrar por estrellas) y solo las que tienen texto
        resenas: (p.reviews ?? [])
            .map((v) => ({
                nombre: v.authorAttribution?.displayName ?? '',
                enlaceAutor: v.authorAttribution?.uri ?? null,
                foto: v.authorAttribution?.photoUri ?? null,
                texto: (v.text?.text ?? v.originalText?.text ?? '').trim(),
                estrellas: Math.round(v.rating ?? 0),
                fecha: v.relativePublishTimeDescription ?? '',
            }))
            .filter((v) => v.texto && v.nombre),
    };
}

export async function manejarResenas(req, env = {}, ctx) {
    if (req.method !== 'GET') return json({ ok: false, error: 'metodo' }, 405);
    if (!env.GOOGLE_PLACES_KEY) return json({ ok: false, error: 'sin-configurar' }, 503);

    const url = new URL(req.url);
    const idioma = url.searchParams.get('lang') === 'en' ? 'en' : 'es';
    // Clave de caché propia (sin cabeceras del visitante): la misma respuesta para todos
    const clave = new Request(`${url.origin}/api/resenas?lang=${idioma}`);
    const cache = typeof caches !== 'undefined' ? caches.default : null;
    const guardada = await cache?.match(clave);
    if (guardada) return guardada;

    try {
        const respuesta = json(await consultar(env, idioma), 200, CACHE_SEGUNDOS);
        if (cache) {
            const copia = cache.put(clave, respuesta.clone());
            ctx?.waitUntil ? ctx.waitUntil(copia) : await copia;
        }
        return respuesta;
    } catch (error) {
        console.error('Reseñas de Google:', error);
        return json({ ok: false, error: 'google' }, 502);
    }
}
