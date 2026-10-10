import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://cabrerakapital.es',
    trailingSlash: 'always',
    i18n: {
        locales: ['es', 'en'],
        defaultLocale: 'es',
        routing: { prefixDefaultLocale: false },
    },
    integrations: [
        sitemap({
            i18n: { defaultLocale: 'es', locales: { es: 'es-ES', en: 'en-GB' } },
        }),
    ],
});
