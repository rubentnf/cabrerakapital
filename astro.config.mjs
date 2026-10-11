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
    // Fuentes variables servidas desde src/assets/fonts (Fontsource, licencia SIL OFL 1.1).
    // Solo el eje de grosor (wght) y el subconjunto latino: el proveedor `fontsource` descarga la versión
    // con tamaño óptico (opsz) de Newsreader, que pesa más del doble y la web no usa.
    fonts: [
        {
            provider: fontProviders.local(),
            name: 'Manrope',
            cssVariable: '--font-manrope',
            fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
            options: {
                variants: [
                    { src: ['./src/assets/fonts/manrope-latin-wght-normal.woff2'], weight: '200 800', style: 'normal' },
                ],
            },
        },
        {
            provider: fontProviders.local(),
            name: 'Newsreader',
            cssVariable: '--font-newsreader',
            fallbacks: ['Georgia', 'serif'],
            options: {
                variants: [
                    { src: ['./src/assets/fonts/newsreader-latin-wght-normal.woff2'], weight: '200 800', style: 'normal' },
                    { src: ['./src/assets/fonts/newsreader-latin-wght-italic.woff2'], weight: '200 800', style: 'italic' },
                ],
            },
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
