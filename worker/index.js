import { manejar } from '../server/contacto.mjs';
import { manejarResenas } from '../server/resenas.mjs';

/**
 * Worker de Cloudflare. La web estática se sirve directamente desde dist/ (gratis e ilimitada);
 * este código solo se ejecuta para /api/* (ver run_worker_first en wrangler.jsonc).
 */
export default {
    async fetch(request, env, ctx) {
        const { pathname } = new URL(request.url);
        if (pathname === '/api/contacto') return manejar(request, env);
        if (pathname === '/api/resenas') return manejarResenas(request, env, ctx);
        return env.ASSETS.fetch(request);
    },
};
