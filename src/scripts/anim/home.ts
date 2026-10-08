import { gsap } from 'gsap';
import { $, $$, splitWords } from '../utils';

/**
 * Inicio: hero fijado (Teide -> logotipo gigante -> cielo con la frase) y los tres pasos fijados.
 * gsap.matchMedia permite recortar el recorrido en móvil sin duplicar código.
 */
export function initHome() {
    const escena = $('.scene');
    if (!escena) return;

    gsap.from($$('.hero-copy h1 .line > span'), {
        yPercent: 105,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.1,
    });

    const mm = gsap.matchMedia();
    // OJO: matchMedia solo ejecuta la función si al menos UNA condición se cumple, así que se definen las dos.
    mm.add({ escritorio: '(min-width: 768px)', movil: '(max-width: 767px)' }, (ctx) => {
        const movil = ctx.conditions?.movil;

        // ---------- 1) Hero fijado ----------
        gsap.set('.sky', { yPercent: 105, opacity: 1 });
        const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
                trigger: '.scene',
                start: 'top top+=70',
                end: movil ? '+=380%' : '+=480%',
                scrub: 0.6,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
            },
        });
        tl.to('.hero-copy', { opacity: 0, y: -60, filter: 'blur(10px)', duration: 2 }, 0)
            .to('.scroll-cue', { opacity: 0, duration: 0.6 }, 0)
            .to('[data-depth="city"]', { yPercent: 40, opacity: 0, duration: 2.5 }, 0.5)
            .to('.skybg', { opacity: 1, duration: 2.5 }, 1)
            .to('[data-depth="sun"]', { opacity: 0, duration: 1.5 }, 1)
            .to(
                '[data-depth="teide"]',
                { yPercent: -4, scale: 1.12, transformOrigin: '50% 100%', duration: 3 },
                0,
            )
            .to('[data-depth="teide"]', { opacity: 0, duration: 1.2 }, 2.6)
            .to('[data-depth="cloudsBack"]', { yPercent: -40, duration: 3 }, 0)
            .to('[data-depth="cloudsFront"]', { yPercent: -90, scale: 1.15, duration: 3 }, 0)
            .fromTo(
                '.wm',
                { opacity: 0, scale: 0.9, filter: 'blur(16px)' },
                { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 2 },
                3,
            )
            .fromTo('.wm small', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, 4)
            .to('.wm', { scale: 1.04, duration: 1.5 }, 5)
            .to('.wm', { scale: 1.25, opacity: 0, y: -80, filter: 'blur(10px)', duration: 1.8 }, 6.6)
            .to('.sky', { yPercent: 0, duration: 2 }, 6.4)
            .fromTo('.sky-in', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2 }, 8);

        const frase = $('[data-skywords]');
        if (frase) tl.to(splitWords(frase), { color: '#0a2240', stagger: 0.09, duration: 0.5 }, 9);

        // ---------- 2) Tres pasos fijados ----------
        const cvs = $$('.cv'),
            cst = $$('.cs');
        if (cvs.length === 3 && cst.length === 3) {
            gsap.set(cvs, { opacity: 0.16, scale: 0.9, filter: 'grayscale(1)' });
            gsap.set(cst, { opacity: 0, y: 24 });
            gsap.set(cst[0], { opacity: 1, y: 0 });
            gsap.set(cvs[0], { opacity: 1, scale: 1, filter: 'grayscale(0)' });
            const ct = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: '#chev',
                    start: 'top top+=70',
                    end: '+=200%',
                    scrub: 0.6,
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                },
            });
            ct.to({}, { duration: 0.6 });
            for (let k = 1; k < 3; k++) {
                const at = 0.6 + (k - 1) * 1.4;
                ct.to(cst[k - 1], { opacity: 0, y: -24, duration: 0.5 }, at)
                    .to(cvs[k], { opacity: 1, scale: 1, filter: 'grayscale(0)', duration: 0.7 }, at)
                    .fromTo(cst[k], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, at + 0.4);
            }
            ct.to({}, { duration: 0.6 });
        }
    });

    // ---------- 3) Estadísticas (contadores) ----------
    // (se animan en reveals.ts con [data-count])

    // ---------- 4) Marco de la oficina que se expande ----------
    if ($('#frame')) {
        gsap.fromTo(
            '#frame',
            { clipPath: 'inset(8% 8% 8% 8% round 28px)' },
            {
                clipPath: 'inset(0% 0% 0% 0% round 0px)',
                ease: 'none',
                scrollTrigger: { trigger: '#frame', start: 'top 90%', end: 'center 50%', scrub: true },
            },
        );
        gsap.fromTo(
            '.frame-inner',
            { scale: 1.25, yPercent: -4 },
            {
                scale: 1,
                yPercent: 4,
                ease: 'none',
                scrollTrigger: { trigger: '#frame', start: 'top bottom', end: 'bottom top', scrub: true },
            },
        );
        gsap.from('.frame-cap > *', {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: '#frame', start: 'center 70%' },
        });
    }

    // ---------- 5) Frase del manifiesto (solo la copia móvil sin cielo) ----------
    const mt = $('[data-words]');
    if (mt) {
        gsap.fromTo(
            splitWords(mt),
            { color: '#b9c4d2' },
            {
                color: '#0a2240',
                stagger: 0.1,
                ease: 'none',
                scrollTrigger: { trigger: mt, start: 'top 78%', end: 'bottom 45%', scrub: true },
            },
        );
    }
}
