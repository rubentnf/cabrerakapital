import { reducedMotion } from './utils';
import { initNav } from './nav';
import { rollify } from './rollify';
import { initSimulador } from './simulador';
import { initFormulario } from './formulario';
import { initCarruselEntidades } from './carrusel-entidades';
import { initMapa } from './mapa';
import { initCookies } from './cookies';
import { initCarrusel } from './carrusel';

// Funciones que no dependen del movimiento
initNav();
rollify();
initSimulador();
initFormulario();
initCookies();
initMapa();
initCarruselEntidades();
initCarrusel();

// Animaciones (y GSAP, que es lo que más pesa): solo si la persona no ha pedido movimiento
// reducido y la página no las desactiva (<Base animaciones={false}>, por ejemplo los textos legales)
if (!reducedMotion() && !document.body.hasAttribute('data-sin-animaciones')) import('./animaciones');
