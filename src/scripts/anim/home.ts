import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, splitWords } from '../utils';

/**
 * Inicio: hero fijado (islas -> logotipo gigante -> cielo con la frase) y los tres pasos fijados.
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
        // Recorrido ajustado a la duración de la secuencia (≈9 unidades) para que no haya tramos sin
        // cambios: si se alarga la secuencia, alargar también `end` en la misma proporción.
        gsap.set('.sky', { yPercent: 105, opacity: 1 });
        /** Distancia del centro de las islas al centro de la escena (posición sin animar). */
        const alCentro = () => {
            const islas = $<HTMLElement>('[data-depth="islas"]');
            if (!islas) return { x: 0, y: 0 };
            return {
                x: escena.clientWidth / 2 - (islas.offsetLeft + islas.offsetWidth / 2),
                y: escena.clientHeight / 2 - (islas.offsetTop + islas.offsetHeight / 2),
            };
        };
        const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
                trigger: '.scene',
                start: 'top top+=70',
                end: movil ? '+=240%' : '+=300%',
                scrub: 0.6,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            },
        });
        tl.to('.hero-copy', { opacity: 0, y: -60, filter: 'blur(10px)', duration: 2 }, 0)
            .to('[data-depth="city"]', { yPercent: 40, opacity: 0, duration: 2.5 }, 0.5)
            .to('.skybg', { opacity: 1, duration: 2.5 }, 1)
            .to('[data-depth="sun"]', { opacity: 0, duration: 1.5 }, 1)
            // Mientras se va el texto, las islas se desplazan al centro de la pantalla y se acercan, como
            // al descender en avión; se funden justo cuando aparece el logotipo gigante en ese centro.
            // El desplazamiento se mide (y se vuelve a medir al cambiar el tamaño de la ventana)
            .to(
                '[data-depth="islas"]',
                {
                    x: () => alCentro().x,
                    y: () => alCentro().y,
                    scale: 1.3,
                    transformOrigin: '50% 50%',
                    duration: 2.6,
                    ease: 'power1.inOut',
                },
                0.4,
            )
            .to('[data-depth="islas"]', { opacity: 0, duration: 1 }, 3)
            .fromTo(
                '.wm',
                { opacity: 0, scale: 0.9, filter: 'blur(16px)' },
                { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.6 },
                3,
            )
            .fromTo('.wm small', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 3.8)
            // Logotipo completo un instante y sale mientras el panel ya está subiendo (sin huecos vacíos)
            .to('.wm', { scale: 1.25, opacity: 0, y: -80, filter: 'blur(10px)', duration: 1.4 }, 5)
            .to('.sky', { yPercent: 0, duration: 1.6 }, 4.9)
            .fromTo('.sky-in', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 5.9);

        const frase = $('[data-skywords]');
        // --k enciende cada palabra (color en scroll-story.css, válido en modo claro y oscuro).
        // `amount` reparte el encendido en un tramo fijo, sea cual sea el número de palabras
        if (frase)
            tl.fromTo(splitWords(frase), { '--k': 0 }, { '--k': 1, stagger: { amount: 2.4 }, duration: 0.4 }, 6.3);

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
                    id: 'pasos',
                trigger: '#chev',
                    start: 'top top+=70',
                    end: '+=160%',
                    scrub: 0.6,
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                },
            });
            // Pausas cortas al principio y al final: lo justo para leer el primer y el último paso
            ct.to({}, { duration: 0.25 });
            for (let k = 1; k < 3; k++) {
                const at = 0.25 + (k - 1) * 1.3;
                ct.to(cst[k - 1], { opacity: 0, y: -24, duration: 0.5 }, at)
                    .to(cvs[k], { opacity: 1, scale: 1, filter: 'grayscale(0)', duration: 0.7 }, at)
                    .fromTo(cst[k], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, at + 0.4);
            }
        }

        // ---------- 3) «Siga bajando» sin cortes ----------
        // Al empezar a bajar, el aviso de la portada cede el sitio a uno fijo abajo de la pantalla, que
        // sigue visible por la frase, las cifras y la oficina hasta la pausa final de los tres pasos.
        const portada = $('.scene .scroll-cue');
        const fijo = $('.cue-fijo');
        if (fijo) {
            const ver = (el: Element | null, si: boolean) => el && gsap.to(el, { autoAlpha: si ? 1 : 0, duration: 0.25 });
            const pasos = ScrollTrigger.getById('pasos');
            ScrollTrigger.create({
                start: 10,
                // Hasta poco antes de soltar los tres pasos (o, si no están, al final de la portada)
                end: () => (pasos ? pasos.end - window.innerHeight * 0.15 : tl.scrollTrigger!.end),
                onEnter: () => (ver(portada, false), ver(fijo, true)),
                onLeave: () => ver(fijo, false),
                onEnterBack: () => ver(fijo, true),
                onLeaveBack: () => (ver(fijo, false), ver(portada, true)),
            });
        }
    });

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
        // En móvil el marco es más estrecho: con menos zoom se ve a los dos socios
        const zoom = window.matchMedia('(max-width: 767px)').matches ? 1.08 : 1.25;
        gsap.fromTo(
            '.frame-inner',
            { scale: zoom, yPercent: -4 },
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
            { '--k': 0 },
            {
                '--k': 1,
                stagger: 0.1,
                ease: 'none',
                scrollTrigger: { trigger: mt, start: 'top 78%', end: 'bottom 45%', scrub: true },
            },
        );
    }
}
