# Cabrera Kapital · cabrerakapital.es

Rediseño de la web de **Cabrera Kapital**, agencia de intermediación de crédito inmobiliario y financiación para empresas en La Laguna (Tenerife), inscrita en el Banco de España con el número E593.

Es un sitio estático de 6 páginas con animaciones de scroll. El texto de la web está redactado en «ustedes».

## Stack

- [Astro 5](https://astro.build) (salida estática, `trailingSlash: 'always'`, mapa del sitio con `@astrojs/sitemap`)
- [GSAP 3](https://gsap.com) + ScrollTrigger para las animaciones
- TypeScript en modo estricto
- Tipografías autoalojadas con Fontsource: Manrope (texto) y Newsreader (titulares)
- CSS propio, sin framework

## Puesta en marcha

Requiere Node 20 o superior.

```bash
npm install
cp .env.example .env     # opcional en local
npm run dev              # http://localhost:4321
```

| Comando           | Qué hace                                    |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga          |
| `npm run build`   | Genera el sitio estático en `dist/`         |
| `npm run preview` | Sirve `dist/` para probar la versión final  |

## Páginas

| Ruta                 | Contenido                                              |
| -------------------- | ------------------------------------------------------ |
| `/`                  | Portada animada: hero, manifiesto, pasos, servicios    |
| `/servicios/`        | Servicios y proceso de trabajo                         |
| `/equipo/`           | Socios, foto del equipo y acreditaciones               |
| `/porque-nosotros/`  | Motivos y entidades colaboradoras                      |
| `/simulador/`        | Simulador de cuota (sistema francés)                   |
| `/contacto/`         | Formulario y datos de contacto                         |

## Estructura

```text
public/              favicon, robots.txt e ilustraciones SVG de reserva
src/
├─ assets/
│  ├─ photos/        fotos reales (oficina, olegario, alejandro, equipo)
│  └─ logos/         logos de las entidades, un archivo por banco
├─ data/             textos en datos: menú, servicios, entidades, motivos
├─ styles/           base.css (tokens y base) y scroll-story.css (portada animada)
├─ scripts/          funciones de la web y anim/ con las animaciones GSAP
├─ layouts/          Base.astro (SEO, cabecera, pie y carga de scripts)
├─ components/       secciones reutilizables
└─ pages/            una página por ruta
```

## Variables de entorno

Copia `.env.example` a `.env`. En producción se definen en el panel del hosting.

| Variable               | Para qué sirve                                                                  |
| ---------------------- | ------------------------------------------------------------------------------- |
| `PUBLIC_INDEXAR`       | `true` permite indexar la web; `false` añade `noindex`. Por defecto `false`.    |
| `PUBLIC_FORMSPREE_URL` | URL del formulario de [Formspree](https://formspree.io). Vacía = modo demostración. |

## Contenido

- **Textos**: los que se repiten están en `src/data/`; el resto, dentro de cada página o componente.
- **Fotos**: se guardan en `src/assets/photos/` con el nombre `oficina`, `olegario`, `alejandro` o `equipo` (jpg, jpeg, png, webp o avif). Si el archivo existe se usa, optimizado por Astro; si no, se muestra una ilustración.
- **Logos de entidades**: en `src/assets/logos/`, con el nombre de la entidad en minúsculas, sin tildes y con guiones (`laboral-kutxa.svg`). Si falta alguno se muestra el nombre en texto. Solo deben usarse con permiso de cada entidad.

## Accesibilidad

Con `prefers-reduced-motion: reduce` se desactivan las animaciones de scroll y la portada se muestra como una página normal. Los elementos decorativos llevan `aria-hidden`.

## Antes de publicar

- [ ] Definir `PUBLIC_INDEXAR=true` y `PUBLIC_FORMSPREE_URL` en el hosting.
- [ ] Cambiar `public/robots.txt` a `Allow: /` y añadir la línea `Sitemap: https://cabrerakapital.es/sitemap-index.xml`.
- [ ] Rellenar los textos pendientes: `grep -rnE "pendiente|confirmar|Aquí ir" src`.
- [ ] Crear las páginas legales (aviso legal, privacidad y cookies, información previa, independencia) y enlazarlas desde el pie.
- [ ] Confirmar la dirección (número de portal) y el permiso de uso de logos y sellos.
- [ ] Sustituir las ilustraciones por las fotos reales del equipo y la oficina.

## Despliegue

Compatible con Vercel o Netlify: comando `npm run build`, carpeta de salida `dist`.

## Licencia

Código y contenidos de uso privado para Cabrera Kapital. Todos los derechos reservados.
