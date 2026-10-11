import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rutas } from './src/i18n/rutas.ts';

const SITE = 'https://cabrerakapital.es';
const pares = Object.values(rutas);

export default defineConfig({
    site: SITE,
    trailingSlash: 'always',
    i18n: {
        locales: ['es', 'en'],
        defaultLocale: 'es',
        routing: { prefixDefaultLocale: false },
    },
    build: {
        inlineStylesheets: 'always',
    },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'hover',
    },
    fonts: [
        {
            provider: fontProviders.fontsource(),
            name: 'Manrope',
            cssVariable: '--font-manrope',
            weights: ['200 800'], // fuente variable: todo el rango en un archivo
            styles: ['normal'],
            subsets: ['latin', 'latin-ext'],
            fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
        },
        {
            provider: fontProviders.fontsource(),
            name: 'Newsreader',
            cssVariable: '--font-newsreader',
            weights: ['200 800'],
            styles: ['normal', 'italic'],
            subsets: ['latin', 'latin-ext'],
            fallbacks: ['Georgia', 'serif'],
        },
    ],
    integrations: [
        sitemap({
            filter: (page) => !page.includes('/en/legal/'),
            serialize(item) {
                const ruta = new URL(item.url).pathname;
                const par = pares.find((p) => p.es === ruta || p.en === ruta);
                if (par) {
                    item.links = [
                        { lang: 'es', url: SITE + par.es },
                        { lang: 'en', url: SITE + par.en },
                        { lang: 'x-default', url: SITE + par.es },
                    ];
                }
                return item;
            },
        }),
    ],
});
