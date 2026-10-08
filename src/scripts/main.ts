import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from './utils';
import { initNav } from './nav';
import { rollify } from './rollify';
import { fitWordmark } from './wordmark';
import { initSimulador } from './simulador';
import { initFormulario } from './formulario';
import { initHome } from './anim/home';
import { initEditorial } from './anim/editorial';
import { initRows } from './anim/rows';
import { initFooter } from './anim/footer';
import { initReveals } from './anim/reveals';
import { initMagnet } from './anim/magnet';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true }); // evita saltos cuando la barra del navegador móvil se oculta

// Funciones que no dependen del movimiento
initNav();
rollify();
fitWordmark();
initSimulador();
initFormulario();

// Animaciones: solo si la persona no ha pedido movimiento reducido
if (!reducedMotion()) {
    gsap.to('.prog', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    });
    initHome();
    initEditorial();
    initRows();
    initFooter();
    initReveals();
    initMagnet();
}