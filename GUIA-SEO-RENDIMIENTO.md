# Guía de SEO, rendimiento y accesibilidad — Cabrera Kapital

Segunda ronda de mejoras, basada en Lighthouse (móvil, versión compilada) y en la revisión del código.

**Punto de partida:**

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Inicio | 95 | 93 | 100 | 69\* |
| Servicios | 96 | 93 | 100 | 66\* |
| Contacto | 99 | 98 | 100 | 66\* |
| Equipo | 98 | 98 | 100 | 69\* |
| Legal | 99 | 93 | 100 | 66\* |

\* El SEO solo baja por el `noindex` puesto a propósito hasta publicar (`PUBLIC_INDEXAR`).

Cada paso indica 📄 **archivo**, ✏️ **qué cambiar** y ✅ **cómo comprobarlo**. Haz las fases en orden y un commit al final de cada una.

> Consejo: `Ctrl+Shift+V` en VS Code para ver la guía con formato y marcar las casillas.

---

## Fase 0 · Preparación

### ☐ 0.1 Rama de trabajo

Confirma antes lo que tengas pendiente (por ejemplo, el cambio de `l3` en `es.ts`) y, desde `main`:

```bash
git checkout -b seo-rendimiento
```

### ☐ 0.2 Mide antes de empezar

```bash
npm run build
npm run preview
```

Abre `http://localhost:4321/` en Chrome → DevTools (`F12`) → pestaña **Lighthouse** → modo *Navigation*, dispositivo *Mobile* → *Analyze page load*. Apunta las cifras de Inicio y de una página interior para compararlas al final.

---

## Fase 1 · SEO

### ☐ 1.1 Títulos y descripciones con palabras clave

Google corta los títulos a unos 60 caracteres y las descripciones a unos 155. Ahora el título de la portada mide 88, y casi todos los títulos interiores («Contacto · Cabrera Kapital») no contienen ninguna palabra que alguien buscaría.

📄 `src/i18n/es.ts` — cambia los `title` (y las dos descripciones cortas):

| Clave | Antes | Después |
|---|---|---|
| `inicio.title` | Cabrera Kapital · Intermediación hipotecaria y financiación para empresas en Canarias | `Intermediario hipotecario en Tenerife · Cabrera Kapital` |
| `servicios.title` | Servicios · Cabrera Kapital | `Hipotecas y financiación para empresas · Cabrera Kapital` |
| `equipo.title` | Equipo · Cabrera Kapital | `Equipo: asesores hipotecarios en La Laguna · Cabrera Kapital` |
| `porque.title` | Por qué nosotros · Cabrera Kapital | `Por qué elegir Cabrera Kapital como intermediario` |
| `simulador.title` | Simulador de cuota · Cabrera Kapital | `Simulador de hipoteca: calcule su cuota · Cabrera Kapital` |
| `contacto.title` | Contacto · Cabrera Kapital | `Contacto en La Laguna · Cabrera Kapital` |
| `faq.title` | Preguntas frecuentes · Cabrera Kapital | `Preguntas frecuentes sobre hipotecas · Cabrera Kapital` |

```ts
// simulador.description
'Calcule gratis la cuota mensual orientativa de su hipoteca o préstamo según importe, plazo e interés. Después, le ayudamos a mejorarla.',
// contacto.description
'Solicite su estudio gratuito en Cabrera Kapital, C/ Santa Eulalia 9, La Laguna. Llámenos o escríbanos: respondemos en 24–48 horas laborables.',
```

📄 `src/i18n/en.ts` — lo mismo en inglés:

| Clave | Después |
|---|---|
| `inicio.title` | `Mortgage broker in Tenerife · Cabrera Kapital` |
| `servicios.title` | `Mortgages and business financing · Cabrera Kapital` |
| `equipo.title` | `Team: mortgage advisers in La Laguna · Cabrera Kapital` |
| `porque.title` | `Why choose Cabrera Kapital as your broker` |
| `simulador.title` | `Mortgage calculator: estimate your payment · Cabrera Kapital` |
| `contacto.title` | `Contact us in La Laguna · Cabrera Kapital` |
| `faq.title` | `Mortgage FAQ · Cabrera Kapital` |

```ts
// simulador.description
'Work out the estimated monthly payment of your mortgage or loan by amount, term and interest rate, free of charge. Then we help you improve it.',
// contacto.description
'Request your free assessment from Cabrera Kapital, C/ Santa Eulalia 9, La Laguna. Call or write to us: we reply within 24–48 working hours.',
```

Los textos son una propuesta: ajústalos a cómo os buscan vuestros clientes. La regla es **palabra clave primero, marca al final, menos de 60 caracteres**.

✅ `npm run build` y, para ver la longitud de cada título:

```bash
for f in $(find dist -name index.html); do t=$(grep -o '<title>[^<]*' $f | sed 's/<title>//'); echo "${#t}  $t"; done | sort -n
```

Ninguno debería pasar de 60.

### ☐ 1.2 Detalles del `<head>`: color del navegador, icono de iPhone y texto de la imagen

📄 `src/layouts/Base.astro` — junto a `<link rel="icon" …>`:

```astro
<meta name="theme-color" content="#0a2240" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

Y junto a las demás etiquetas `og:image`:

```astro
<meta property="og:image:alt" content={t.inicio.oficina.alt} />
```

(La imagen para compartir es la foto de la oficina, y ese texto ya la describe en los dos idiomas.)

📄 `public/apple-touch-icon.png` — crea un PNG de **180 × 180 px** con el logotipo «CK» sobre fondo azul marino, sin transparencia. Puedes generarlo a partir de `public/favicon.svg` con cualquier editor o con [realfavicongenerator.net](https://realfavicongenerator.net).

✅ En DevTools → *Elements* → `<head>`: aparecen las tres etiquetas. En Chrome para Android, la barra del navegador se vuelve azul marino.

### ☐ 1.3 `robots.txt` generado según `PUBLIC_INDEXAR`

Ahora `public/robots.txt` es fijo con `Disallow: /`. Si al publicar activas `PUBLIC_INDEXAR=true` pero olvidas cambiar este archivo, Google no rastreará nada. Lo generaremos a partir de la misma variable.

1. **Borra** `public/robots.txt`.
2. Crea 📄 `src/pages/robots.txt.ts`:

```ts
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
```

✅ `npm run build && cat dist/robots.txt` → `Disallow: /`. Después prueba con la variable activada:

```bash
PUBLIC_INDEXAR=true npm run build && cat dist/robots.txt
```

Debe salir `Allow: /` y la línea `Sitemap:`. (En PowerShell: `$env:PUBLIC_INDEXAR='true'; npm run build`.)

### ☐ 1.4 Páginas legales en inglés: sin contenido duplicado

`/en/legal/*` muestra el mismo texto en español que `/legal/*`, pero con `lang="en"` y sus propias etiquetas `hreflang`. Google lo interpreta como **contenido duplicado y en el idioma equivocado**. Las mantenemos (la persona que navega en inglés conserva su menú), pero:
- la versión inglesa apunta como canónica a la española;
- no se declaran alternativas de idioma (no hay traducción real);
- el texto se marca como español.

**1)** 📄 `src/layouts/Base.astro` — dos props nuevas:

```ts
interface Props {
    // …
    /** Ruta canónica, si no es la de la propia página (p. ej. textos legales en inglés → versión española). */
    canonical?: string;
    /** false: no se publican etiquetas hreflang (páginas sin traducción real). */
    hreflang?: boolean;
}
const {
    title,
    description,
    page,
    alt,
    animaciones = true,
    canonical: canonicalRuta,
    hreflang = true,
} = Astro.props;
// …
const canonical = new URL(canonicalRuta ?? Astro.url.pathname, site);
```

Después, en el `<head>`, **sustituye entero** este bloque (el `langs.map` y la etiqueta `x-default` que va debajo):

```astro
{
    langs.map((l) => (
        <link
            rel="alternate"
            hreflang={l}
            href={new URL(alts[l], site)}
        />
    ))
}
<link
    rel="alternate"
    hreflang="x-default"
    href={new URL(alts.es, site)}
/>
```

por este otro, que hace lo mismo pero solo cuando `hreflang` es `true`:

```astro
{
    hreflang && (
        <>
            {langs.map((l) => (
                <link rel="alternate" hreflang={l} href={new URL(alts[l], site)} />
            ))}
            <link rel="alternate" hreflang="x-default" href={new URL(alts.es, site)} />
        </>
    )
}
```

**2)** 📄 `src/views/Legal.astro` — en `<Base …>` añade:

```astro
canonical={rutaLegal(id, "es")}
hreflang={false}
```

y marca el texto como español (está en español en las dos versiones):

```astro
<article class="legal-texto" lang="es">
```

✅ `npm run build`, y luego:

```bash
grep -o '<link rel="canonical"[^>]*>' dist/en/legal/aviso-legal/index.html
grep -o '<link rel="alternate"[^>]*>' dist/en/legal/aviso-legal/index.html | wc -l
grep -o '<link rel="alternate"[^>]*>' dist/servicios/index.html
```

La canónica debe ser `https://cabrerakapital.es/legal/aviso-legal/`, el segundo comando debe dar `0`, y el tercero, las tres alternativas (`es`, `en`, `x-default`) de Servicios, que no cambian.

### ☐ 1.5 Página 404 propia, en los dos idiomas

Ahora, una URL que no existe muestra la página genérica del hosting. La haremos como el resto de la web: los textos en los diccionarios, una vista que los usa y una página fina por idioma (`/404` y `/en/404/`).

**1)** 📄 `src/i18n/es.ts` — añade este bloque al objeto `es` (por ejemplo, justo después de `documentos: { … },`):

```ts
    noEncontrada: {
        title: 'Página no encontrada · Cabrera Kapital',
        description: 'La página que busca no existe o ha cambiado de dirección.',
        etiqueta: 'Error 404',
        h1: 'Esta página no existe.',
        lead: 'Puede que la dirección haya cambiado o que el enlace tenga un error.',
        inicio: 'Ir al inicio',
        contacto: 'Contactar',
    },
```

📄 `src/i18n/en.ts` — el mismo bloque en inglés, en el mismo sitio (si falta, `npm run check` avisará):

```ts
    noEncontrada: {
        title: 'Page not found · Cabrera Kapital',
        description: 'The page you are looking for does not exist or has moved.',
        etiqueta: 'Error 404',
        h1: 'This page does not exist.',
        lead: 'The address may have changed or the link may contain an error.',
        inicio: 'Go to the home page',
        contacto: 'Contact us',
    },
```

**2)** 📄 `src/layouts/Base.astro` — una prop más, para que una página pueda pedir no indexarse nunca:

```ts
interface Props {
    // …
    /** false: la página nunca se indexa (por ejemplo, la 404). */
    indexable?: boolean;
}
const {
    // … las de antes …
    hreflang = true,
    indexable = true,
} = Astro.props;
```

y en la etiqueta robots:

```astro
<meta
    name="robots"
    content={indexar && indexable ? "index,follow" : "noindex,nofollow"}
/>
```

**3)** 📄 `src/components/HeroInterior.astro` — añade un hueco (`<slot />`) debajo del texto, para que una página pueda poner botones dentro de la cabecera:

```astro
        <p class="lead" data-fade>
            {lead}
        </p>
        <slot />
    </div>
</section>
```

(Las páginas que ya usan `HeroInterior` no cambian: si no le pasan nada, el hueco queda vacío.)

**4)** Crea la vista 📄 `src/views/NoEncontrada.astro`. Usa la misma cabecera que las demás páginas interiores, con los botones dentro:

```astro
---
import Base from "../layouts/Base.astro";
import HeroInterior from "../components/HeroInterior.astro";
import { langDe, ruta, useT } from "../i18n";
const lang = langDe(Astro.url.pathname);
const t = useT(lang).noEncontrada;
---

<Base title={t.title} description={t.description} indexable={false} hreflang={false}>
    {
        /* El hosting sirve la 404 española para cualquier dirección que no exista.
           Si la dirección era de la parte inglesa, se pasa a la 404 en inglés. */
        lang === "es" && (
            <script slot="head" is:inline>
                if (location.pathname.startsWith("/en/")) location.replace("/en/404/");
            </script>
        )
    }
    <HeroInterior etiqueta={t.etiqueta} titulo={t.h1} lead={t.lead}>
        <div class="btns" data-fade>
            <a class="btn gold" href={ruta("inicio", lang)}>{t.inicio}</a>
            <a class="btn line" href={ruta("contacto", lang)}>{t.contacto}</a>
        </div>
    </HeroInterior>
</Base>
```

**5)** Las dos páginas, finas como las demás:

📄 `src/pages/404.astro`

```astro
---
import NoEncontrada from "../views/NoEncontrada.astro";
---

<NoEncontrada />
```

📄 `src/pages/en/404.astro`

```astro
---
import NoEncontrada from "../../views/NoEncontrada.astro";
---

<NoEncontrada />
```

Cómo funciona al publicar:
- **Vercel y Netlify** sirven `dist/404.html` (la española) con estado **404** para cualquier dirección que no exista, sin configurar nada.
- Si la dirección era de la parte inglesa (`/en/…`), el pequeño script de la vista lleva a `/en/404/`, que tiene cabecera, menú y textos en inglés. Google ya ha recibido el estado 404 de la dirección original, y las dos páginas llevan `noindex`.
- El plugin de sitemap reconoce las páginas 404 de cada idioma y las deja fuera solo.

✅ `npm run check` sin errores. `npm run build && npm run preview`, y abre:
- `http://localhost:4321/no-existe/` → 404 en español; en DevTools → *Network*, el estado es **404**.
- `http://localhost:4321/en/no-existe/` → pasa a la 404 en inglés, con el menú en inglés.

Y comprueba que no aparecen en el sitemap:

```bash
grep -c "404" dist/sitemap-0.xml   # debe dar 0
```

### ☐ 1.6 Sitemap con los dos idiomas bien emparejados

La opción `i18n` del plugin de sitemap solo empareja rutas iguales con distinto prefijo (`/servicios/` ↔ `/en/servicios/`). Las tuyas tienen nombres distintos (`/en/services/`), así que **solo la portada** sale con su versión en inglés. Además usa `es-ES`/`en-GB` mientras el HTML usa `es`/`en`.

📄 `astro.config.mjs` — sustituye todo el archivo:

```js
import { defineConfig } from 'astro/config';
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
    integrations: [
        sitemap({
            // Los textos legales en inglés apuntan a la versión española (paso 1.4): fuera del sitemap
            filter: (page) => !page.includes('/en/legal/'),
            // Cada página con su pareja en el otro idioma, usando la tabla de src/i18n/rutas.ts
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
```

✅ `npm run build`, y luego:

```bash
grep -o '<url>.*</url>' dist/sitemap-0.xml | sed 's/<url>/\n<url>/g' | grep services
```

`/servicios/` y `/en/services/` deben aparecer enlazadas entre sí. No debe haber ninguna `/en/legal/`.

### ☐ 1.7 Datos estructurados del negocio (lo que más ayuda al SEO local)

Con esto Google entiende que sois un **servicio financiero con oficina física**: dirección, horario, teléfonos, idiomas y registro en el Banco de España. Es lo que alimenta los resultados locales («intermediario hipotecario La Laguna») y el panel lateral de la marca.

**1)** 📄 `src/data/contacto.ts` — añade estos campos al objeto `contacto`:

```ts
    // Dirección por partes (datos estructurados para Google)
    direccionPostal: {
        calle: 'C/ Santa Eulalia, 9, Local',
        cp: '38320',
        localidad: 'San Cristóbal de La Laguna',
        provincia: 'Santa Cruz de Tenerife',
    },
    // Coordenadas exactas de la oficina: en Google Maps, clic derecho sobre el local → la primera línea del menú
    geo: { lat: 0, lng: 0 },
    // Horario de lunes a viernes, en formato 24 h
    horario: { abre: '08:30', cierra: '18:30' },
```

⚠️ **Sustituye `lat` y `lng`** por las coordenadas reales (por ejemplo `28.48…`, `-16.31…`). Mientras valgan 0, el componente no las publica.

**2)** Crea 📄 `src/components/DatosNegocio.astro`:

```astro
---
// Datos estructurados del negocio (schema.org) para Google: ficha local, horario, teléfonos, registro…
// Comprobar con https://search.google.com/test/rich-results
import { contacto } from "../data/contacto";
import { langDe, useT } from "../i18n";

interface Props {
    /** URL absoluta de la imagen del negocio (la misma de og:image) */
    imagen: string;
}
const { imagen } = Astro.props;
const site = Astro.site!;
const t = useT(langDe(Astro.url.pathname));
const { direccionPostal: d, geo, horario } = contacto;

const negocio = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": new URL("/#negocio", site).href,
    name: "Cabrera Kapital",
    description: t.inicio.description,
    url: site.href,
    logo: new URL("/favicon.svg", site).href,
    image: imagen,
    telephone: contacto.telefonos[0].tel,
    email: contacto.correo,
    address: {
        "@type": "PostalAddress",
        streetAddress: d.calle,
        postalCode: d.cp,
        addressLocality: d.localidad,
        addressRegion: d.provincia,
        addressCountry: "ES",
    },
    ...(geo.lat && geo.lng
        ? { geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng } }
        : {}),
    openingHoursSpecification: [
        {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: horario.abre,
            closes: horario.cierra,
        },
    ],
    hasMap: contacto.mapaEnlace,
    areaServed: { "@type": "AdministrativeArea", name: "Canarias" },
    knowsLanguage: ["es", "en"],
    identifier: {
        "@type": "PropertyValue",
        propertyID: "Registro de intermediarios de crédito inmobiliario del Banco de España",
        value: "E593",
    },
    founder: [
        { "@type": "Person", name: "Olegario Cabrera García" },
        { "@type": "Person", name: "Alejandro Cabrera Martín" },
    ],
    // Cuando tengáis la ficha de Google Business Profile o redes sociales, añadid aquí sus enlaces:
    // sameAs: ["https://g.page/…", "https://www.linkedin.com/company/…"],
};
---

<script type="application/ld+json" set:html={JSON.stringify(negocio)} />
```

**3)** 📄 `src/layouts/Base.astro` — impórtalo y colócalo en el `<head>`, después de las etiquetas `og:`:

```astro
import DatosNegocio from "../components/DatosNegocio.astro";
// …
<DatosNegocio imagen={new URL(og.src, site).href} />
```

✅ `npm run build`, y en [validator.schema.org](https://validator.schema.org/) pega el HTML de `dist/index.html` (o, ya publicado, la URL en [Rich Results Test](https://search.google.com/test/rich-results)). Debe detectar un `FinancialService` sin errores.

**→ Commit de la fase 1.**

---

## Fase 2 · Rendimiento

> Nota: en la revisión propuse sacar `scroll-story.css` de las páginas interiores. Al comprobarlo, ese archivo también tiene estilos globales (`.rl` de los botones, `.rm`, el logotipo del pie `.bigwm`, las fotos `.ph`/`.foto` de Equipo y las filas de Servicios). Separarlo es arriesgado y ahorraría muy poco, así que lo sustituye el paso 2.2.

### ☐ 2.1 Fuentes con la API de Astro (precarga y sin saltos)

Ahora las fuentes llegan desde el CSS, sin precarga: el navegador las descubre tarde y el texto, que es el elemento principal (LCP) de la portada, tarda en mostrarse con su tipografía. La API de fuentes de Astro (de serie desde Astro 6):
- **precarga** el archivo de cada fuente;
- genera **fuentes de reserva con las mismas medidas**, para que no se mueva el texto cuando llega la definitiva;
- sirve los archivos desde tu propio dominio.

**1)** 📄 `astro.config.mjs` — importa `fontProviders` y añade `fonts`:

```js
import { defineConfig, fontProviders } from 'astro/config';
// …
export default defineConfig({
    site: SITE,
    // …
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
    integrations: [ /* … */ ],
});
```

**2)** 📄 `src/layouts/Base.astro` — borra las tres importaciones de `@fontsource-variable/…` y, en su lugar:

```ts
import { Font } from "astro:assets";
```

En el `<head>`, al principio (después de `<meta name="viewport" …>`):

```astro
<Font cssVariable="--font-manrope" preload={[{ subset: "latin", style: "normal" }]} />
<Font cssVariable="--font-newsreader" preload={[{ subset: "latin", style: "normal" }]} />
```

(Solo se precarga lo imprescindible: el alfabeto latino básico, sin cursiva. El resto se descarga cuando hace falta.)

**3)** 📄 `src/styles/base.css` — en `:root`:

```css
/* Antes */
--serif: 'Newsreader Variable', 'Newsreader', Georgia, serif;
--sans: 'Manrope Variable', 'Manrope', 'Helvetica Neue', Arial, sans-serif;
/* Después */
--serif: var(--font-newsreader);
--sans: var(--font-manrope);
```

**4)** Quita los paquetes que ya no se usan:

```bash
npm uninstall @fontsource-variable/manrope @fontsource-variable/newsreader
```

⚠️ El proveedor `fontsource` descarga las fuentes **al compilar**: el ordenador o el servidor de despliegue necesitan conexión (Vercel y Netlify la tienen).

✅ `npm run build` sin errores. En `dist/index.html` aparecen dos `<link rel="preload" … as="font">`. Recorre la web: la tipografía debe verse **igual que antes**, incluidas las cursivas («su vivienda», «Compare.»).

### ☐ 2.2 CSS dentro del HTML (sin petición que bloquee el pintado)

Lighthouse estima ~900 ms de mejora en 4G: el navegador no pinta nada hasta descargar `Base.css` (35 KB). En una web pequeña como esta compensa incrustarlo en cada página.

📄 `astro.config.mjs`:

```js
export default defineConfig({
    // …
    build: {
        inlineStylesheets: 'always',
    },
});
```

✅ `npm run build` → en `dist/_astro/` ya no hay `.css`, y `dist/index.html` lleva un `<style>`. Repite Lighthouse: el aviso *Render-blocking requests* debe desaparecer y bajar el FCP.

### ☐ 2.3 Precarga de páginas al pasar el ratón

Astro puede descargar la página de destino cuando el ratón pasa por encima de un enlace (o, en móvil, al tocarlo). Al hacer clic, la página ya está ahí.

📄 `astro.config.mjs`:

```js
export default defineConfig({
    // …
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'hover',
    },
});
```

✅ `npm run build && npm run preview` → DevTools → *Network* → pasa el ratón por «Servicios» en el menú sin hacer clic: aparece una petición a `/servicios/`.

### ☐ 2.4 Tamaño de la foto del collage

📄 `src/components/Editorial.astro` — la foto grande ocupa el 78 % de una columna (≈ 31 % de la pantalla en escritorio y el ancho completo menos márgenes en móvil). Con `40vw` se descargaba una versión mayor de la necesaria (~26 KB de más):

```astro
<!-- Antes -->
sizes="(max-width: 767px) 100vw, 40vw"
<!-- Después -->
sizes="(max-width: 767px) calc(100vw - 36px), 31vw"
```

✅ Lighthouse: desaparece el aviso *Improve image delivery* de esa imagen.

**→ Commit de la fase 2.**

---

## Fase 3 · Accesibilidad

### ☐ 3.1 Contraste de colores

Tres textos no llegan al contraste mínimo (4,5:1 en texto normal, 3:1 en texto grande):

📄 `src/styles/scroll-story.css`

```css
/* Lista lateral de «No firme a ciegas»: los elementos no activos (3,1:1) */
.edit-list li {
    padding: 5px 0;
    opacity: 0.75; /* antes 0.5 */
    transition: opacity 0.3s;
}

/* «Compare.» en cursiva (2,5:1) */
.edit h2 em {
    font-style: italic;
    color: #5d7390; /* antes #8a9bb2 */
}
```

📄 `src/styles/base.css`

```css
/* Título «Contenido» del índice legal (4,47:1) */
.legal-toc-t {
    /* … */
    opacity: 0.75; /* antes 0.6 */
}
```

✅ Lighthouse → *Accessibility*: desaparece *Background and foreground colors do not have a sufficient contrast ratio*. Comprueba que el resaltado de la lista lateral sigue notándose al hacer scroll; si te parece poco, añade `font-weight: 700;` a `.edit-list li.on`.

### ☐ 3.2 Títulos del pie en orden

El pie usa `<h4>` sin `h2`/`h3` delante, y los lectores de pantalla navegan por niveles de título.

📄 `src/components/Footer.astro` — cambia los cuatro `<h4>…</h4>` por `<h2>…</h2>`.

📄 `src/styles/base.css` — el selector `.foot h4` pasa a `.foot h2`, y como los `h2` usan la tipografía con serifa, fija la fuente:

```css
.foot h2 {
    margin: 0 0 12px;
    color: var(--gold);
    font: 700 12px/1.4 var(--sans);
    letter-spacing: 0.14em;
    text-transform: uppercase;
}
```

✅ El pie se ve igual. Lighthouse: desaparece *Heading elements are not in a sequentially-descending order*.

### ☐ 3.3 Nombre del enlace del logotipo

El enlace del logotipo tiene `aria-label="Cabrera Kapital, inicio"`, pero el texto visible es «CK Cabrera Kapital». Quien usa control por voz dice lo que ve («pulsa Cabrera Kapital») y no coincide.

📄 `src/components/Header.astro`

En el archivo está repartido en varias líneas (hacia la línea 25):

```astro
<!-- Antes -->
        <a
            class="brand"
            href={ruta("inicio", lang)}
            aria-label={t.header.inicio}
        >
            <span class="logo">CK</span>Cabrera Kapital
        </a>
<!-- Después: se borra la línea del aria-label y el «CK» lleva aria-hidden -->
        <a
            class="brand"
            href={ruta("inicio", lang)}
        >
            <span class="logo" aria-hidden="true">CK</span>Cabrera Kapital
        </a>
```

La clave `header.inicio` deja de usarse: puedes borrarla de `es.ts` y `en.ts`.

### ☐ 3.4 Errata en el suavizado de fuentes

📄 `src/styles/base.css`, en `body`:

```css
-webkit-font-smoothing: antialiased; /* antes «antialised»: el navegador ignoraba la línea */
```

✅ `npm run check` sin errores. Lighthouse → *Accessibility* debe llegar a 100 en todas las páginas.

**→ Commit de la fase 3.**

---

## Fase 4 · Cabeceras del hosting

Haz **solo el paso de tu hosting**. Conseguirás:
- caché de un año para `/_astro/*` (los archivos llevan una huella en el nombre: si cambian, cambia el nombre);
- cabeceras de seguridad básicas;
- que las URL sin barra final redirijan a la versión con barra, como espera Astro (`trailingSlash: 'always'`), sin duplicar direcciones.

### ☐ 4.1 Si publicas en Vercel

Crea 📄 `vercel.json` en la raíz:

```json
{
    "trailingSlash": true,
    "headers": [
        {
            "source": "/_astro/(.*)",
            "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
        },
        {
            "source": "/(.*)",
            "headers": [
                { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
                { "key": "X-Content-Type-Options", "value": "nosniff" },
                { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
                { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
                { "key": "X-Frame-Options", "value": "SAMEORIGIN" }
            ]
        }
    ]
}
```

### ☐ 4.2 Si publicas en Netlify

Crea 📄 `netlify.toml` en la raíz:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    X-Frame-Options = "SAMEORIGIN"
```

(Netlify ya redirige a la URL con barra final con su opción *Pretty URLs*, activada por defecto.)

✅ Tras desplegar, en [securityheaders.com](https://securityheaders.com) pon tu dominio: debe salir al menos una **A**. En DevTools → *Network*, un archivo de `/_astro/` muestra `cache-control: public, max-age=31536000, immutable`.

⚠️ `Strict-Transport-Security` con `preload` obliga a usar HTTPS en el dominio y en **todos sus subdominios**. Si algún subdominio (por ejemplo, el correo web) no tiene HTTPS, quita `includeSubDomains; preload`.

**→ Commit de la fase 4.**

---

## Fase 5 · Limpieza y comprobaciones

### ☐ 5.1 Archivo sin uso

Borra `public/img/scene-ciudad.svg`: desde las ilustraciones nuevas de las filas no lo usa nada.

```bash
grep -rn "scene-ciudad" src public   # no debe devolver nada antes de borrarlo
```

### ☐ 5.2 Dominio del correo

El correo es `financiacion@cabrerakapital.com` y la web va en `cabrerakapital.es`. Confirma cuál es el correcto y, si hace falta, cámbialo en `src/data/contacto.ts` (se actualiza en toda la web y en los datos estructurados).

### ☐ 5.3 Comprobación final

```bash
npm run check    # 0 errores
npm run build    # sin avisos
npm run preview
```

1. Repite Lighthouse (paso 0.2) en Inicio, Servicios y una página legal, y compara con la tabla del principio.
2. Recorre todas las páginas en español e inglés, en escritorio y en móvil: tipografías, cursivas, colores del pie y de la sección «No firme a ciegas».
3. Abre una URL inexistente, en español y en inglés (paso 1.5).

**→ Commit de la fase 5** y fusiona: `git checkout main && git merge seo-rendimiento`.

---

## Al publicar

- ☐ `PUBLIC_INDEXAR=true` en el hosting (con el paso 1.3, el `robots.txt` cambia solo).
- ☐ Dar de alta el dominio en [Google Search Console](https://search.google.com/search-console) y enviar `https://cabrerakapital.es/sitemap-index.xml`.
- ☐ Crear o reclamar la ficha de **Google Business Profile** con la misma dirección, teléfono y horario que la web (deben coincidir exactamente), y añadir su enlace en `sameAs` (paso 1.7).
- ☐ Comprobar la portada en [Rich Results Test](https://search.google.com/test/rich-results).
- ☐ Borrar este archivo o no incluirlo en `main`.
