import { reducedMotion } from './utils';
import { initNav } from './nav';
import { rollify } from './rollify';
import { initSimulador } from './simulador';
import { initFormulario } from './formulario';
import { initCarruselEntidades } from './carrusel-entidades';
import { initMapa } from './mapa';
import { initCookies } from './cookies';
import { initCarrusel } from './carrusel';
import { initDesliza } from './desliza';
import { initTema } from './tema';

// Funciones que no dependen del movimiento
initTema();
initNav();
rollify();
initSimulador();
initFormulario();
initCookies();
initMapa();
initCarruselEntidades();
initCarrusel();
initDesliza();

// Animaciones (y GSAP, que es lo que más pesa): solo si la persona no ha pedido movimiento
// reducido y la página no las desactiva (<Base animaciones={false}>, por ejemplo los textos legales)
// Si el archivo no llega (red móvil que se corta, una publicación nueva mientras la página estaba
// abierta…), se reintenta una vez y, si vuelve a fallar, la web pasa a su versión estática: la misma
// que ven quienes piden movimiento reducido, con todo el contenido visible y sin capas a medias.
const cargarAnimaciones = (intento = 0): Promise<unknown> =>
    import('./animaciones').catch((error) => {
        if (intento === 0) return new Promise((r) => setTimeout(r, 1500)).then(() => cargarAnimaciones(1));
        console.error('No se han podido cargar las animaciones', error);
        document.documentElement.classList.add('rm');
    });
if (!reducedMotion() && !document.body.hasAttribute('data-sin-animaciones')) cargarAnimaciones();
