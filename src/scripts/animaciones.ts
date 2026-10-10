import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHome } from './anim/home';
import { initEditorial } from './anim/editorial';
import { initRows } from './anim/rows';
import { initFooter } from './anim/footer';
import { initReveals } from './anim/reveals';
import { initMagnet } from './anim/magnet';

/** Todo lo que usa GSAP. main.ts lo carga aparte, solo en las páginas que tienen animaciones. */
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true }); // evita saltos cuando la barra del navegador móvil se oculta

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
