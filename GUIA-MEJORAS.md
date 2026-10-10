# Guía de mejoras — Cabrera Kapital

Guía paso a paso para aplicar todas las correcciones de la revisión del proyecto.
Está ordenada de menor a mayor riesgo: **haz las fases en orden** y comprueba cada una antes de pasar a la siguiente.

Cada paso indica:
- 📄 **Archivo** que hay que tocar
- ✏️ **Qué cambiar** (antes → después)
- ✅ **Cómo comprobarlo**

> Consejo: abre la vista previa de este archivo en VS Code (`Ctrl+Shift+V`) y marca las casillas a medida que avances.

---

## Fase 0 · Preparación

### ☐ 0.1 Crea una rama de trabajo

```bash
git checkout -b mejoras
```

Así, si algo sale mal, `main` sigue intacta. Al final de cada fase haz un commit (por ejemplo `git commit -am "fix: fase 1 errores"`).

### ☐ 0.2 Instala el comprobador de tipos de Astro

`astro build` **no** revisa los tipos de los archivos `.astro`; por eso no avisó de los errores de la fase 1. Instala el comprobador:

```bash
npm i -D @astrojs/check typescript
```

📄 `package.json` — añade un script `check`:

```json
"scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "astro": "astro"
},
```

✅ Ejecuta `npm run check`. **Debería mostrar errores** en `Oficina.astro` (`chip`), `EntidadesSec.astro` (`nota`) y `views/Porque.astro` (`entNota`). Es lo esperado: los arreglas en la fase 1. A partir de ahora, ejecuta `npm run check` al terminar cada fase.

---

## Fase 1 · Errores (prioridad alta)

### ☐ 1.1 El botón del mapa no funciona

📄 `src/scripts/mapa.ts` (línea 6). El script busca un atributo distinto al que tiene el botón en `Mapa.astro` (`data-mapa-btn`).

```ts
// Antes
const boton = caja.querySelector('[data-map-btn]');
// Después
const boton = caja.querySelector('[data-mapa-btn]');
```

✅ `npm run dev` → `/contacto/` → pulsa «Cargar mapa»: debe aparecer el mapa de Google.

### ☐ 1.2 Oficina: texto vacío y `alt` sin traducir

📄 `src/components/Oficina.astro`

1. Borra la línea del chip (la clave `chip` ya no existe en los diccionarios):
   ```astro
   <span class="chip">{t.chip}</span>
   ```
2. Cambia el `alt` escrito a mano por el traducido:
   ```astro
   <!-- Antes -->
   alt="Fachada de la oficina de Cabrera Kapital en La Laguna"
   <!-- Después -->
   alt={t.alt}
   ```
3. Quita `aria-hidden="true"` del `<div class="frame-inner" id="frame-inner">`. Ahora es una foto real con descripción, y `aria-hidden` impide que los lectores de pantalla la anuncien.

📄 `src/styles/base.css` — busca `.chip {` (hacia la línea 1316) y borra el bloque entero, porque ya no se usa.

✅ En `/` y `/en/`, la sección de la oficina muestra solo el título, sin cápsula vacía.

### ☐ 1.3 Entidades (portada): nota vacía

📄 `src/components/EntidadesSec.astro` — borra la línea:

```astro
<p class="note">{t.nota}</p>
```

### ☐ 1.4 Por qué nosotros: nota vacía

📄 `src/views/Porque.astro` (línea 27) — la clave `entNota` no existe en los diccionarios. Tienes dos opciones:

- **A (recomendada):** borra la línea `<p class="note">{p.entNota}</p>`.
- **B:** si quieres una nota ahí, añade `entNota: '…'` dentro de `porque: { … }` en **`es.ts` y `en.ts`**.

✅ `npm run check` ya no debe mostrar errores.

### ☐ 1.5 Coma que falta en el CSS

📄 `src/styles/base.css` (línea 531, dentro de `.card { … }`)

```css
/* Antes: regla inválida, el navegador la ignora */
transition: transform 0.4s box-shadow 0.4s;
/* Después */
transition: transform 0.4s, box-shadow 0.4s;
```

✅ Al pasar el ratón por una tarjeta (`/porque-nosotros/`), sube y la sombra aparece **suavemente**, no de golpe.

### ☐ 1.6 Marcadores provisionales visibles

**a) Correo pendiente** · 📄 `src/views/Contacto.astro` (línea 124). Aprovecha para convertirlo en enlace:

```astro
<!-- Antes -->
<b>{contacto.correo} [pendiente: correo corporativo]</b>
<!-- Después -->
<b><a href={`mailto:${contacto.correo}`}>{contacto.correo}</a></b>
```

Si el correo definitivo es otro, cámbialo solo en `src/data/contacto.ts`.

**b) Reseñas de ejemplo** · 📄 `src/data/resenas.ts`. Mientras no tengas las reseñas reales, deja la lista vacía y la sección se ocultará sola:

```ts
export const resenas: Resena[] = [];
```

Cuando las tengas, añádelas con este formato (y rellena `puntuacion` y `total` en `google` si quieres mostrar la nota media):

```ts
{ nombre: 'María G.', texto: 'Texto tal cual en Google…', estrellas: 5, fecha: 'hace 2 meses' },
```

✅ Busca restos de marcadores en todo el proyecto:

```bash
grep -rn "pendiente\|\[Pegar\|\[Nombre\|\[Aquí" src --include=*.astro --include=*.ts
```

Solo debería quedar `regNota` en los diccionarios (es un texto intencionado).

### ☐ 1.7 Tipo de las pestañas del menú

📄 `src/components/Header.astro` (línea 12). `ids` tiene el tipo `PaginaId[]`, que incluye `"faq"`, pero el diccionario `nav` no tiene pestaña `faq`. Por eso TypeScript da el error `ts(7053)` en `t.nav[id]`.

```ts
// Antes
const ids: PaginaId[] = [
// Después: solo las páginas que tienen pestaña en el menú
const ids: (keyof typeof t.nav)[] = [
```

Si algún día añades `faq` al menú, basta con añadir su texto a `nav` en `es.ts` y `en.ts`.

✅ `npm run check` sin errores.

**→ Commit de la fase 1.**

---

## Fase 2 · Limpieza (sin riesgo)

### ☐ 2.1 Código muerto en `servicios.ts`

📄 `src/data/servicios.ts` — sustituye **todo** el contenido por:

```ts
/** Ilustración de cada fila (s1 Teide, s2 catedral, s3 ciudad). Los textos viven en src/i18n/*.ts (clave "filas", mismo orden). */
export const escenas = ['s2', 's3', 's1', 's2', 's3'] as const;
```

(Se van la interfaz `Fila`, que nadie usa, y el bloque comentado.)

### ☐ 2.2 Animaciones de elementos que no existen

📄 `src/scripts/anim/reveals.ts` — borra el bloque completo que empieza por `$$('[data-row]').forEach((r) => {` (líneas 111–136). No hay ningún `data-row` ni `.ico` en el HTML.

📄 `src/scripts/anim/home.ts` — borra estas dos líneas de comentario (98–99), que no aportan nada:

```ts
// ---------- 3) Estadísticas (contadores) ----------
// (se animan en reveals.ts con [data-count])
```

(Si quieres, renumera los comentarios siguientes: 4 → 3 y 5 → 4.)

### ☐ 2.3 CSS sin usar en `base.css`

Son restos del prototipo anterior. **Antes de borrar cada clase**, confirma que no se usa:

```bash
grep -rnw "NOMBRE" src --include=*.astro --include=*.ts
```

(Cambia `NOMBRE` por `page`, `svrow`, etc. Si no sale nada en `class=` ni en scripts, se puede borrar.)

📄 `src/styles/base.css` — usa `Ctrl+F` para localizar cada selector:

| Clase | Qué borrar |
|---|---|
| `.page` | Bloques `.page {` y `.page.on {` |
| `.dot` | `.dot {`, `.card:hover .dot {`, `.card.sim .dot {`, `.card.sim:hover .dot {` |
| `.sim` | `.card.sim {`, `.card.sim p {` |
| `.home-hero` | `.home-hero {`, `.home-hero h1 {`, `.home-hero p.lead {` |
| `.hgrid` | Bloque `.hgrid {` y, en la media query de ~línea 1021, **solo la línea** `.hgrid,` del grupo `.hgrid, .garant, .simg, …` |
| `.herophoto` | Bloque `.herophoto {` y el de la media query (~línea 1081) |
| `.stats` / `.stat` | `.stats {`, `.stats .wrap {` (dos veces, una en media query), `.stat b {`, `.stat>span {` |
| `.tag` | Bloque `.tag {` |
| `.svrow` / `.ico` | Todos los bloques `.svrow…` (incluidos `.svrow>.tag` y los de la media query) y `.ico {` |
| `.legal-in` | `.legal-in {`, `.legal-in h1 {` |
| `.hdr` | En `@media print` (~línea 1844), **solo la línea** `.hdr,` |

⚠️ **Cuidado con los grupos de selectores** (varios selectores separados por comas): borra solo la línea de la clase, no el bloque entero. Si una media query se queda vacía (`@media (…) { }`), bórrala también.

✅ Recorre todas las páginas en escritorio y en móvil (DevTools → modo dispositivo) y comprueba que nada ha cambiado de aspecto.

### ☐ 2.4 `langDe` llamado dos veces

📄 `src/views/Contacto.astro` (líneas 8–10):

```ts
// Antes
const t = useT(langDe(Astro.url.pathname));
const c = t.contacto;
const lang = langDe(Astro.url.pathname);
// Después
const lang = langDe(Astro.url.pathname);
const t = useT(lang);
const c = t.contacto;
```

### ☐ 2.5 Correo como enlace en el pie

📄 `src/components/Footer.astro` (línea 26):

```astro
<!-- Antes -->
<div>{contacto.correo}</div>
<!-- Después -->
<div><a href={`mailto:${contacto.correo}`}>{contacto.correo}</a></div>
```

### ☐ 2.6 (Opcional) Estilos en línea repetidos

Lista los estilos en línea:

```bash
grep -rn 'style="' src --include=*.astro
```

Los más repetidos son `margin-bottom:32px` y `align-self:flex-start`. Añade al final de `base.css`:

```css
/* utilidades */
.mb-32 { margin-bottom: 32px; }
.self-start { align-self: flex-start; }
```

Y sustituye, por ejemplo:

```astro
<h2 data-rise style="margin-bottom:32px">  →  <h2 data-rise class="mb-32">
<a class="btn gold" style="align-self:flex-start" …>  →  <a class="btn gold self-start" …>
```

**→ Commit de la fase 2.**

---

## Fase 3 · Refactorización

### ☐ 3.1 El CTA monta él mismo el botón de teléfono

Hoy cada página pasa el texto del teléfono, y no todas igual: Inicio y Servicios muestran solo el número; el resto, «Llamar 606…». Lo unificamos dentro del componente.

📄 `src/components/Cta.astro` — sustituye el frontmatter y el segundo botón:

```astro
---
import { contacto } from "../data/contacto";
import { langDe, ruta, useT } from "../i18n";

interface Props {
    title: string;
    text: string;
    cta: string;
}
const { title, text, cta } = Astro.props;
const lang = langDe(Astro.url.pathname);
const t = useT(lang);
const tel = contacto.telefonos[0];
---
```

```astro
<a class="btn line" href={`tel:${tel.tel}`}>
    {`${t.cta.llamar} ${tel.visible}`}
</a>
```

📄 Después, en **cada vista** que usa `<Cta>` (`Inicio`, `Equipo`, `Faq`, `Porque`, `Servicios` y `Simulador` en `src/views/`):

1. Borra la línea `phone={…}`.
2. Si `contacto` ya no se usa en ese archivo, borra también `import { contacto } from "../data/contacto";`.

✅ `npm run check` sin errores; todas las páginas muestran «Llamar 606 395 427» (o «Call…» en inglés).

### ☐ 3.2 Nombres de los socios en los datos, no en un ternario

📄 `src/views/Equipo.astro`

```ts
// Antes
const socios = [
    { foto: "olegario", d: e.olegario },
    { foto: "alejandro", d: e.alejandro },
];
// Después (los nombres propios no se traducen)
const socios = [
    { foto: "olegario", nombre: "Olegario Cabrera García", d: e.olegario },
    { foto: "alejandro", nombre: "Alejandro Cabrera Martín", d: e.alejandro },
];
```

Y en el HTML:

```astro
<!-- Antes -->
<h2>
    {s.foto === "olegario"
        ? "Olegario Cabrera García"
        : "Alejandro Cabrera Martín"}
</h2>
<!-- Después -->
<h2>{s.nombre}</h2>
```

### ☐ 3.3 Búsqueda de imágenes compartida + logos optimizados

`Foto.astro` y `Entidades.astro` repiten el mismo código para buscar archivos por nombre. Además, los logos se sirven como PNG originales, sin optimizar.

**1)** Crea 📄 `src/utils/assets.ts`:

```ts
import type { ImageMetadata } from 'astro';

type Glob = Record<string, { default: ImageMetadata }>;

/** "../assets/photos/olegario.jpeg" → "olegario" */
const nombreDe = (ruta: string) => ruta.split('/').pop()!.replace(/\.[^.]+$/, '');

/** Convierte el resultado de import.meta.glob en un mapa nombre → imagen */
const porNombre = (glob: Glob) =>
    new Map(Object.entries(glob).map(([ruta, m]) => [nombreDe(ruta), m.default]));

/** Fotos de src/assets/photos, por nombre de archivo sin extensión */
export const fotos = porNombre(
    import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp,avif}', { eager: true }),
);

/** Logos de src/assets/logos, por nombre de archivo sin extensión */
export const logos = porNombre(
    import.meta.glob('../assets/logos/*.{svg,png,webp,jpg,jpeg}', { eager: true }),
);

/** "Laboral Kutxa" → "laboral-kutxa" (minúsculas, sin tildes, con guiones) */
export const slug = (s: string) =>
    s
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
```

**2)** 📄 `src/components/Foto.astro` — sustituye el bloque `const todas = …` y `const hit = …` por:

```ts
import { fotos } from "../utils/assets";
// …
const img = fotos.get(name);
```

y el HTML por:

```astro
{
    img ? (
        <Image src={img} alt={alt} widths={widths} sizes={sizes} loading={loading} class="foto" />
    ) : (
        <slot />
    )
}
```

**3)** 📄 `src/components/Entidades.astro` — sustituye todo el frontmatter por:

```astro
---
// Muestra el nombre de cada entidad; si existe su logo en src/assets/logos/<slug>.(svg|png|webp|jpg) se usa el logo.
// slug = nombre en minúsculas, sin tildes y con guiones: "Laboral Kutxa" -> laboral-kutxa.png
import { Image } from "astro:assets";
import { entidades } from "../data/entidades";
import { logos, slug } from "../utils/assets";
---
```

y, dentro del `.map`, cambia `logoDe(e)` por `logos.get(slug(e))` y el `<img>` por:

```astro
<Image src={l} alt={e} width={240} loading="lazy" />
```

(240 px es el doble del tamaño máximo en pantalla: nítido en pantallas retina y mucho más ligero.)

✅ `npm run build` → en `dist/_astro/` los logos aparecen como `.webp`. Las fotos del equipo y de la oficina siguen viéndose bien.

### ☐ 3.4 Las páginas legales ya no fingen ser «faq»

Ahora `Legal.astro` pasa `page="faq"` solo para que no se marque ninguna pestaña del menú. Haremos que `page` sea opcional de verdad y que `Base` calcule las rutas alternativas una sola vez.

📄 `src/layouts/Base.astro`

```ts
// Antes
const { title, description, page = "inicio", alt } = Astro.props;
// …
const alts = alt ?? { es: ruta(page, "es"), en: ruta(page, "en") };
// Después
const { title, description, page, alt } = Astro.props;
// …
const alts = alt ?? { es: ruta(page ?? "inicio", "es"), en: ruta(page ?? "inicio", "en") };
```

Y en el HTML:

```astro
<Header page={page} alts={alts} />
```

📄 `src/components/Header.astro`

```ts
interface Props {
    page?: PaginaId;
    alts: { es: string; en: string };
}
const { page, alts } = Astro.props;
```

y las dos veces que aparece `<LangSwitch page={page} alt={alt} />` → `<LangSwitch alts={alts} />`.

📄 `src/components/LangSwitch.astro`

```ts
import { langDe, useT } from "../i18n";

interface Props {
    alts: { es: string; en: string };
}
const { alts } = Astro.props;
```

y los `href`: `href={alts.es}` y `href={alts.en}`.

📄 `src/views/Legal.astro` — borra el comentario `<!-- page="faq": … -->` y la línea `page="faq"`.

📄 `src/views/Inicio.astro` — como `page` ya no vale «inicio» por defecto, añádelo:

```astro
<Base title={t.title} description={t.description} page="inicio">
```

✅ En `/`, «Inicio» queda marcado en el menú; en `/legal/aviso-legal/` no se marca nada, y el cambio de idioma lleva a `/en/legal/aviso-legal/`.

### ☐ 3.5 El «19» de entidades, calculado

El número está escrito a mano en 4 textos por idioma. Si la lista cambia, se desfasan.

📄 `src/i18n/es.ts` — al principio del archivo:

```ts
import { entidades } from '../data/entidades';
const nEntidades = entidades.length;
```

Y cambia cada texto con el número a plantilla con comillas invertidas (líneas ~150, 254, 337 y 342):

```ts
// Antes
titulo: 'Trabajamos con 19 entidades financieras.',
// Después
titulo: `Trabajamos con ${nEntidades} entidades financieras.`,
```

📄 Repite lo mismo en `src/i18n/en.ts` (líneas ~152, 249, 332 y 337).

✅ Búsqueda rápida: `grep -n "19 " src/i18n/*.ts` ya no debe devolver textos de entidades.

### ☐ 3.6 Hero: SVG más corto generado con datos

📄 `src/components/Hero.astro` — unas 30 vetas de nieve y 6 grietas son el mismo `<path>` repetido. Muévelas a arrays en el frontmatter:

```ts
// Perfil de la montaña (se usa dos veces: recorte y relleno)
const perfil =
    "M-500 452 L0 430 C150 420 300 380 450 300 C560 240 680 150 770 90 C785 78 800 70 815 72 C830 74 845 84 870 104 C980 190 1100 270 1240 330 C1360 380 1480 410 1600 420 L1600 660 L-500 660 Z";

// Grietas oscuras de la ladera
const grietas = [
    "M790 84 L690 400 L706 400 L798 84Z",
    "M776 96 L600 380 L616 380 L784 96Z",
    // … copia aquí los 6 «d» con fill="#6b3f26"
];

// Vetas de nieve: [d, opacidad]
const nieve: [string, number][] = [
    ["M840 94 L798 171 L803 171 L843 94Z", 0.77],
    ["M855 102 L812 180 L818 180 L858 102Z", 0.61],
    // … copia aquí todos los paths con fill="#dfe6ec"
];
```

Y en el SVG:

```astro
<clipPath id="tcl"><path d={perfil}></path></clipPath>
…
<path d={perfil} fill="url(#tr)"></path>
…
{grietas.map((d) => <path d={d} fill="#6b3f26" opacity=".45" clip-path="url(#tcl)" />)}
…
{nieve.map(([d, o]) => <path d={d} fill="#dfe6ec" opacity={o} />)}
```

Haz lo mismo con las 10 `<line>` de la balconada (x = 674, 680, … 728):

```astro
{Array.from({ length: 10 }, (_, i) => 674 + i * 6).map((x) => (
    <line x1={x} y1="124" x2={x} y2="140" />
))}
```

⚠️ Mantén el **orden** de los elementos: en SVG, lo que va después se pinta encima.

✅ Compara la portada antes y después (haz una captura antes de empezar): debe verse idéntica.

### ☐ 3.7 Simulador: IDs genéricos → atributos `data-*`

`#i`, `#p` y `#t` son IDs fáciles de pisar con otros elementos.

📄 `src/views/Simulador.astro`

- `<div class="wrap simg" …>` → añade `data-simulador`.
- En los `input`: `id="i"` → `data-sim="importe"`, `id="p"` → `data-sim="plazo"`, `id="t"` → `data-sim="tipo"`.
- En las salidas: `id="vi"` → `data-out="importe"`, `id="vp"` → `data-out="plazo"`, `id="vt"` → `data-out="tipo"`, `id="cuota"` → `data-out="cuota"`, `id="tot"` → `data-out="total"`, `id="int"` → `data-out="intereses"`.

📄 `src/scripts/simulador.ts` — sustituye todo el archivo:

```ts
import { gsap } from 'gsap';
import { $, reducedMotion } from './utils';

/** Simulador de cuota (sistema francés). Solo se activa si la página lo contiene. */
export function initSimulador() {
    const caja = $('[data-simulador]');
    if (!caja) return;

    const campo = (n: string) => $<HTMLInputElement>(`[data-sim="${n}"]`, caja)!;
    const salida = (n: string) => $(`[data-out="${n}"]`, caja)!;
    const importe = campo('importe');
    const plazo = campo('plazo');
    const tipo = campo('tipo');

    const en = caja.dataset.lang === 'en';
    const anios = caja.dataset.anios ?? 'años';
    const eur = (v: number) =>
        en ? '€' + Math.round(v).toLocaleString('en-GB') : Math.round(v).toLocaleString('es-ES') + ' €';

    const mostrado = { c: 0, t: 0, i: 0 };
    const pintar = () => {
        salida('cuota').textContent = eur(mostrado.c);
        salida('total').textContent = eur(mostrado.t);
        salida('intereses').textContent = eur(mostrado.i);
    };

    const calcular = () => {
        const im = +importe.value;
        const n = +plazo.value * 12;
        const ti = +tipo.value;
        const m = ti / 1200;
        const cuota = m ? (im * m) / (1 - Math.pow(1 + m, -n)) : im / n;

        salida('importe').textContent = eur(im);
        salida('plazo').textContent = `${plazo.value} ${anios}`;
        salida('tipo').textContent = (en ? ti.toFixed(1) : ti.toFixed(1).replace('.', ',')) + ' %';

        const destino = { c: cuota, t: cuota * n, i: cuota * n - im };
        if (reducedMotion()) {
            Object.assign(mostrado, destino);
            pintar();
        } else {
            gsap.to(mostrado, { ...destino, duration: 0.6, ease: 'power2.out', overwrite: true, onUpdate: pintar });
        }
    };

    [importe, plazo, tipo].forEach((el) => el.addEventListener('input', calcular));
    calcular();
}
```

(De paso, el código deja de consultar el DOM al cargar el módulo: ahora solo lo hace dentro de `initSimulador`.)

✅ `/simulador/` y `/en/calculator/`: al mover los tres deslizadores, las cifras cambian como antes.

### ☐ 3.8 No reconstruir HTML desde texto (`innerHTML`)

`rollify`, `splitWords` y `[data-split]` leen el texto y lo vuelven a meter como HTML: un `&` o `<` en un texto rompería la página. Los crearemos como nodos.

📄 `src/scripts/utils.ts` — sustituye `splitWords`:

```ts
/**
 * Divide un texto en palabras envueltas en <span class="w"> para animarlas una a una.
 * Con `mascara`, cada palabra va además dentro de un <span class="split-mask"> que la recorta.
 */
export function splitWords(el: HTMLElement, mascara = false): HTMLElement[] {
    const palabras = (el.textContent ?? '').trim().split(/\s+/);
    const spans = palabras.map((p) => {
        const w = document.createElement('span');
        w.className = 'w';
        w.textContent = p;
        return w;
    });
    const nodos = spans.map((w) => {
        if (!mascara) return w;
        const m = document.createElement('span');
        m.className = 'split-mask';
        m.append(w);
        return m;
    });
    el.replaceChildren(...nodos.flatMap((n, i) => (i ? [' ', n] : [n])));
    return spans;
}
```

📄 `src/scripts/anim/reveals.ts` — el bloque de `[data-split]` queda así:

```ts
const h = $('[data-split]');
if (h) gsap.from(splitWords(h, true), { yPercent: 110, duration: 1, ease: 'power3.out', stagger: 0.07 });
```

(Añade `splitWords` al import: `import { $, $$, splitWords } from '../utils';`.)

📄 `src/styles/base.css` — añade los estilos que antes iban en línea:

```css
.split-mask {
    display: inline-block;
    overflow: hidden;
    vertical-align: top;
    padding-bottom: 0.12em;
}

.split-mask > .w {
    display: inline-block;
}
```

📄 `src/scripts/rollify.ts` — sustituye el cuerpo del `forEach`:

```ts
$$('.btn, .links a').forEach((el) => {
    if (el.children.length) return;
    const texto = (el.textContent ?? '').trim();
    const a = document.createElement('span');
    a.textContent = texto;
    const b = a.cloneNode(true) as HTMLElement;
    b.setAttribute('aria-hidden', 'true');
    const rl = document.createElement('span');
    rl.className = 'rl';
    rl.append(a, b);
    el.replaceChildren(rl);
});
```

✅ Los títulos de las páginas interiores siguen entrando palabra a palabra; los botones siguen «rodando» al pasar el ratón; la frase del cielo de la portada se sigue coloreando.

### ☐ 3.9 (Opcional) Tipado de `Legal.astro`

📄 `src/views/Legal.astro` — sustituye el `any`:

```ts
import type { MarkdownInstance } from "astro";
// …
const archivos = import.meta.glob<MarkdownInstance<Record<string, unknown>>>("../legal/*.md", { eager: true });
```

Sobre el PDF: `existsSync(process.cwd() …)` funciona mientras ejecutes `astro build` desde la raíz del proyecto (lo normal, también en Vercel). Puedes dejarlo así. La alternativa robusta sería mover los PDF a `src/legal/` e importarlos con `import.meta.glob('../legal/*.pdf', { eager: true, query: '?url', import: 'default' })`, pero entonces **cambian sus URLs** (pasan a `/_astro/…`). Decide si te compensa.

**→ Commit de la fase 3.**

---

## Fase 4 · Rendimiento

### ☐ 4.1 Carrusel de entidades: parar cuando no se ve

Ahora el bucle `requestAnimationFrame` corre siempre, también en escritorio y con el carrusel fuera de pantalla.

📄 `src/scripts/carrusel-entidades.ts` — sustituye desde `new IntersectionObserver(…)` hasta el final del `forEach`:

```ts
let raf = 0;
const paso = (t: number) => {
    const dt = ultimo ? Math.min(t - ultimo, 100) / 1000 : 0;
    ultimo = t;
    if (t >= reanudarEn) {
        pos += VELOCIDAD * dt;
        const p = periodo();
        if (pos >= p) pos -= p;
        el.scrollLeft = pos;
    }
    raf = requestAnimationFrame(paso);
};

// El bucle solo corre en móvil, con el carrusel en pantalla y sin movimiento reducido
const actualizar = () => {
    const activo = mq.matches && visible && !reducedMotion();
    if (activo && !raf) {
        ultimo = 0;
        raf = requestAnimationFrame(paso);
    } else if (!activo && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
    }
};

new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    actualizar();
}).observe(el);
mq.addEventListener('change', actualizar);
```

(Borra también la línea `if (reducedMotion()) return;`, que ya está incluida en `actualizar`.)

✅ En escritorio: DevTools → *Performance* → graba 5 s en reposo: no debe aparecer actividad continua de *Animation Frame Fired*. En móvil (modo dispositivo), el carrusel sigue avanzando solo.

### ☐ 4.2 Logos optimizados

Ya está hecho en el paso **3.3** (`<Image>` en `Entidades.astro`).

### ☐ 4.3 Botones «imán» con `quickTo`

📄 `src/scripts/anim/magnet.ts` — sustituye todo el archivo:

```ts
import { gsap } from 'gsap';

type Mover = { x: ReturnType<typeof gsap.quickTo>; y: ReturnType<typeof gsap.quickTo> };

/** Botones dorados que "siguen" ligeramente al ratón. Solo en dispositivos con puntero fino. */
export function initMagnet() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const sel = '.btn.gold, .btn.line';
    const movers = new WeakMap<HTMLElement, Mover>();
    const mover = (b: HTMLElement) => {
        let m = movers.get(b);
        if (!m) {
            m = { x: gsap.quickTo(b, 'x', { duration: 0.3 }), y: gsap.quickTo(b, 'y', { duration: 0.3 }) };
            movers.set(b, m);
        }
        return m;
    };

    document.addEventListener('mousemove', (e) => {
        const b = (e.target as HTMLElement).closest<HTMLElement>(sel);
        if (!b) return;
        const r = b.getBoundingClientRect();
        const m = mover(b);
        m.x((e.clientX - r.left - r.width / 2) * 0.18);
        m.y((e.clientY - r.top - r.height / 2) * 0.3);
    });

    document.addEventListener('mouseout', (e) => {
        const b = (e.target as HTMLElement).closest<HTMLElement>(sel);
        // Solo al salir del botón de verdad, no al pasar entre sus <span> internos
        if (!b || b.contains(e.relatedTarget as Node | null)) return;
        const m = mover(b);
        m.x(0);
        m.y(0);
    });
}
```

Además del rendimiento, esto corrige un tirón: antes, al mover el ratón entre los `<span>` que crea `rollify`, el botón «volvía» a su sitio aunque siguieras encima. Lo único que se pierde es el rebote elástico al salir.

### ☐ 4.4 Logotipo del pie: `ResizeObserver` en vez de `resize`

📄 `src/scripts/wordmark.ts` — sustituye todo el archivo:

```ts
/** Ajusta el logotipo gigante del pie para que ocupe exactamente el ancho del contenedor */
export function fitWordmark() {
    const e = document.querySelector<HTMLElement>('.bigwm b');
    const caja = e?.parentElement;
    if (!e || !caja) return;

    const fit = () => {
        e.style.fontSize = '100px';
        const ancho = e.scrollWidth;
        if (ancho > 0) e.style.fontSize = `${((100 * caja.clientWidth) / ancho) * 0.995}px`;
    };

    // Solo se recalcula cuando cambia el ancho de la caja (no en cada evento de resize)
    let anchoCaja = 0;
    new ResizeObserver(([entrada]) => {
        const w = entrada.contentRect.width;
        if (w !== anchoCaja) {
            anchoCaja = w;
            fit();
        }
    }).observe(caja);
    document.fonts?.ready.then(fit);
}
```

### ☐ 4.5 (Avanzado, opcional) No cargar GSAP en las páginas legales

GSAP + ScrollTrigger son la mayor parte de los ~125 KB del script, y en las páginas legales casi no se usan. Mide antes de empezar:

```bash
npm run build && ls -la dist/_astro/*.js
```

**1)** Crea 📄 `src/scripts/animaciones.ts` con todo lo que usa GSAP:

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHome } from './anim/home';
import { initEditorial } from './anim/editorial';
import { initRows } from './anim/rows';
import { initFooter } from './anim/footer';
import { initReveals } from './anim/reveals';
import { initMagnet } from './anim/magnet';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true }); // evita saltos cuando la barra del navegador móvil se oculta

gsap.to('.prog', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
initHome();
initEditorial();
initRows();
initFooter();
initReveals();
initMagnet();
```

**2)** 📄 `src/scripts/main.ts` — quita los imports de `gsap`, `ScrollTrigger` y `anim/*`, y el bloque `if (!reducedMotion()) { … }`; en su lugar:

```ts
// Animaciones: solo si la persona no ha pedido movimiento reducido y la página no las desactiva
if (!reducedMotion() && !document.body.hasAttribute('data-sin-animaciones')) import('./animaciones');
```

**3)** 📄 `src/layouts/Base.astro` — añade la prop `animaciones?: boolean` (por defecto `true`) y, en el `<body>`:

```astro
<body data-sin-animaciones={animaciones ? undefined : ""}>
```

📄 `src/views/Legal.astro` → `<Base … animaciones={false}>`.

**4)** `simulador.ts` también importa GSAP. Cambia la animación por una importación dinámica:

```ts
// Quita: import { gsap } from 'gsap';
// y dentro de calcular(), en la rama sin movimiento reducido:
import('gsap').then(({ gsap }) =>
    gsap.to(mostrado, { ...destino, duration: 0.6, ease: 'power2.out', overwrite: true, onUpdate: pintar }),
);
```

✅ Vuelve a medir: debe haber un `.js` pequeño (el principal) y otro grande (GSAP) que **no** se descarga en `/legal/…` (compruébalo en DevTools → *Network* → *JS*). Prueba todas las animaciones de nuevo.

**→ Commit de la fase 4.**

---

## Fase 5 · Otras mejoras

### ☐ 5.1 Imagen al compartir (`og:image`)

1. Crea una imagen de **1200 × 630 px** (logotipo y lema sobre fondo azul marino, por ejemplo) y guárdala como `public/og.jpg`.
2. 📄 `src/layouts/Base.astro` — junto a las demás etiquetas `og:`:

```astro
<meta property="og:site_name" content="Cabrera Kapital" />
<meta property="og:image" content={new URL("/og.jpg", site)} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
```

✅ Tras publicar, pega una URL en WhatsApp: debe salir la imagen.

### ☐ 5.2 Descripción de las páginas legales

Ahora usan el título como descripción.

📄 `src/i18n/es.ts`, dentro de `documentos`:

```ts
descripcion: '{titulo} de Cabrera Kapital, intermediario de crédito inmobiliario inscrito en el Banco de España (E593).',
```

📄 `src/i18n/en.ts`, dentro de `documentos`:

```ts
descripcion: '{titulo} of Cabrera Kapital, real-estate credit intermediary registered with the Bank of Spain (E593).',
```

📄 `src/views/Legal.astro`:

```astro
description={t.documentos.descripcion.replace("{titulo}", titulo)}
```

### ☐ 5.3 Menú móvil accesible

📄 `src/i18n/es.ts` y `en.ts`, dentro de `header`: añade `cerrarMenu: 'Cerrar menú'` / `cerrarMenu: 'Close menu'`.

📄 `src/components/Header.astro` — en el `<button class="burger">`:

```astro
<button
    class="burger"
    id="burger"
    aria-label={t.header.abrirMenu}
    aria-expanded="false"
    aria-controls="menu"
    data-abrir={t.header.abrirMenu}
    data-cerrar={t.header.cerrarMenu}
>
```

📄 `src/scripts/nav.ts` — sustituye desde `const set = …` hasta el final:

```ts
const enfocables = () => [burger, ...$$<HTMLElement>('a, button', menu)];

const set = (abierto: boolean, devolverFoco = false) => {
    menu.classList.toggle('open', abierto);
    burger.setAttribute('aria-expanded', String(abierto));
    burger.setAttribute('aria-label', (abierto ? burger.dataset.cerrar : burger.dataset.abrir) ?? '');
    document.body.style.overflow = abierto ? 'hidden' : ''; // sin scroll de fondo con el menú abierto
    if (abierto) menu.querySelector<HTMLElement>('a')?.focus();
    else if (devolverFoco) burger.focus();
};

burger.addEventListener('click', () => set(!menu.classList.contains('open')));
menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) set(false);
});

addEventListener('keydown', (e) => {
    if (!menu.classList.contains('open')) return;
    if (e.key === 'Escape') set(false, true);
    // Tab circula solo entre el botón y los enlaces del menú
    if (e.key === 'Tab') {
        const f = enfocables();
        const i = f.indexOf(document.activeElement as HTMLElement);
        const sig = e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i + 1) % f.length;
        e.preventDefault();
        f[sig].focus();
    }
});
```

(Añade `$$` al import: `import { $, $$ } from './utils';`.)

✅ En modo móvil: abre el menú con el teclado (Tab hasta el botón + Enter), recorre con Tab (no sale del menú) y cierra con Escape (el foco vuelve al botón).

### ☐ 5.4 Protección antispam del formulario

Formspree ignora los envíos que rellenan el campo `_gotcha` (solo lo rellenan los bots).

📄 `src/views/Contacto.astro` — justo antes del `<button type="submit">`:

```astro
<input class="trampa" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true" />
```

📄 `src/styles/base.css`:

```css
.trampa {
    position: absolute;
    left: -9999px;
}
```

### ☐ 5.5 Comprobación final

```bash
npm run check   # 0 errores
npm run build   # compila sin avisos
npm run preview # recorre todas las páginas en ES y EN, escritorio y móvil
```

Lista de páginas que revisar: `/`, `/servicios/`, `/equipo/`, `/porque-nosotros/`, `/simulador/`, `/contacto/`, `/preguntas-frecuentes/`, una legal, y sus versiones `/en/…`.

**→ Commit de la fase 5** y fusiona la rama: `git checkout main && git merge mejoras`.

---

## Antes de publicar la web definitiva

Esto no es código que arreglar, pero conviene no olvidarlo:

- ☐ `public/robots.txt`: cambiar `Disallow: /` por `Allow: /` y añadir `Sitemap: https://cabrerakapital.es/sitemap-index.xml`.
- ☐ Variable de entorno `PUBLIC_INDEXAR=true` en Vercel (si no, todas las páginas llevan `noindex`).
- ☐ Variable `PUBLIC_FORMSPREE_URL` en Vercel (si no, el formulario solo muestra el aviso de demostración).
- ☐ Reseñas reales en `src/data/resenas.ts` (paso 1.6).
- ☐ Correo corporativo definitivo en `src/data/contacto.ts`.
- ☐ Permiso de uso de los sellos oficiales (texto `regNota` de la página de equipo).
- ☐ Borrar este archivo (`GUIA-MEJORAS.md`) o no incluirlo en el commit.
