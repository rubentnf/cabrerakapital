import { gsap } from 'gsap';

/** El logotipo gigante del pie sube a su sitio mientras se llega al final de la página. */
export function initFooter() {
    gsap.fromTo(
        '.bigwm b',
        { yPercent: 32 },
        {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true },
        },
    );
}