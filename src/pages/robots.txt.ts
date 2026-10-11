import type { APIRoute } from 'astro';

/**
 * robots.txt según PUBLIC_INDEXAR (la misma variable que controla la etiqueta robots de cada página):
 * sin ella, se bloquea todo; con PUBLIC_INDEXAR=true, se permite el rastreo y se indica el sitemap.
 */
export const GET: APIRoute = ({ site }) => {
    const indexar = import.meta.env.PUBLIC_INDEXAR === 'true';
    const texto = indexar
        ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`
        : 'User-agent: *\nDisallow: /\n';
    return new Response(texto, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
