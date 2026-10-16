import { $ } from './utils';

/**
 * Sección «Opiniones» (components/Resenas.astro): pide a /api/resenas (server/resenas.mjs) la nota, el
 * total y las reseñas de Google. Con `modo: 'google'` sustituye las reseñas de la lista manual; con
 * 'manual', solo actualiza la nota y el total. Si Google no responde, se queda lo que venía en la página.
 */
type Resena = {
    nombre: string;
    enlaceAutor: string | null;
    foto: string | null;
    texto: string;
    estrellas: number;
    fecha: string;
};
type Datos = { ok: boolean; puntuacion: number | null; total: number | null; enlace: string | null; resenas: Resena[] };

const crear = <K extends keyof HTMLElementTagNameMap>(tag: K, clase = '', texto = '') => {
    const el = document.createElement(tag);
    if (clase) el.className = clase;
    if (texto) el.textContent = texto;
    return el;
};

/** Tarjeta de una reseña (mismo marcado que las de la lista manual). Todo como texto: sin innerHTML. */
function tarjeta(r: Resena, textoGoogle: string) {
    const li = crear('li', 'card opin');
    const estrellas = crear('span', 'stars', '★'.repeat(Math.max(1, Math.min(5, r.estrellas))));
    estrellas.setAttribute('role', 'img');
    estrellas.setAttribute('aria-label', `${r.estrellas} / 5`);
    const quien = crear('div', 'opin-quien');
    const av = crear('span', 'opin-av');
    av.setAttribute('aria-hidden', 'true');
    if (r.foto) {
        const img = crear('img');
        img.src = r.foto;
        img.alt = '';
        img.width = img.height = 40;
        img.loading = 'lazy';
        img.referrerPolicy = 'no-referrer';
        av.append(img);
    } else av.textContent = r.nombre.replace(/[^\p{L}]/gu, '').charAt(0).toUpperCase() || '·';
    // Google pide enlazar al perfil del autor
    const nombre = r.enlaceAutor ? crear('a', '', r.nombre) : crear('b', '', r.nombre);
    if (nombre instanceof HTMLAnchorElement) {
        nombre.href = r.enlaceAutor!;
        nombre.target = '_blank';
        nombre.rel = 'noopener noreferrer';
    }
    const datos = crear('div');
    datos.append(nombre, crear('small', '', r.fecha ? `${textoGoogle} · ${r.fecha}` : textoGoogle));
    quien.append(av, datos);
    li.append(estrellas, crear('p', 'opin-t', r.texto), quien);
    return li;
}

/** «Leer más» en las reseñas que no caben en sus 6 líneas. */
function leerMas(sec: HTMLElement) {
    const { leerMas: mas = '', leerMenos: menos = '' } = sec.dataset;
    sec.querySelectorAll<HTMLElement>('.opin').forEach((card) => {
        const texto = card.querySelector<HTMLElement>('.opin-t');
        if (!texto || card.querySelector('.opin-mas') || texto.scrollHeight <= texto.clientHeight + 2) return;
        const b = crear('button', 'opin-mas', mas);
        b.type = 'button';
        b.setAttribute('aria-expanded', 'false');
        b.addEventListener('click', () => {
            const abierta = card.classList.toggle('abierta');
            b.textContent = abierta ? menos : mas;
            b.setAttribute('aria-expanded', String(abierta));
        });
        texto.after(b);
    });
}

export async function initResenas() {
    const sec = $<HTMLElement>('[data-resenas]');
    if (!sec) return;
    const { resenas: modo, lang = 'es', textoGoogle = '' } = sec.dataset;
    if (!sec.hidden) leerMas(sec);

    let datos: Datos;
    try {
        const r = await fetch(`/api/resenas?lang=${lang}`, { headers: { Accept: 'application/json' } });
        if (!r.ok) return;
        datos = await r.json();
        if (!datos.ok) return;
    } catch {
        return;
    }

    // Nota media y total
    if (datos.puntuacion !== null) {
        $('[data-puntuacion]', sec)!.textContent = datos.puntuacion.toFixed(1);
        $('[data-nota]', sec)!.hidden = false;
    }
    if (datos.total !== null) {
        $('[data-total-n]', sec)!.textContent = String(datos.total);
        $('[data-total]', sec)!.hidden = false;
    }
    if (datos.enlace) $<HTMLAnchorElement>('[data-enlace]', sec)!.href = datos.enlace;

    // Reseñas
    if (modo === 'google' && datos.resenas.length) {
        $('[data-pista]', sec)!.replaceChildren(...datos.resenas.map((r) => tarjeta(r, textoGoogle)));
        sec.hidden = false;
        leerMas(sec);
        // Los botones del carrusel se recalculan con el nuevo contenido
        dispatchEvent(new Event('resize'));
    }
}
