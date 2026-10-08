import { gsap } from 'gsap';
import { $, $$ } from '../utils';

/** Animaciones de entrada reutilizables, activadas por atributos data-* en el HTML. */
export function initReveals() {
    // Titular de portada de páginas interiores, palabra a palabra
    const h = $('[data-split]');
    if (h) {
        const palabras = (h.textContent ?? '').trim().split(/\s+/);
        h.innerHTML = palabras
            .map(
                (x) =>
                    `<span style="display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.12em"><span class="w" style="display:inline-block">${x}</span></span>`,
            )
            .join(' ');
        gsap.from($$('.w', h), { yPercent: 110, duration: 1, ease: 'power3.out', stagger: 0.07 });
    }
    gsap.from($$('[data-fade]'), {
        y: 20,
        opacity: 0,
        duration: 0.9,
        delay: 0.3,
        stagger: 0.1,
        ease: 'power2.out',
    });

    // Portada interior con formas que se mueven
    const hero = $('.hero');
    if (hero) {
        const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to($('.d1', hero), {
            yPercent: 40,
            xPercent: -10,
            scale: 1.25,
            ease: 'none',
            scrollTrigger: st,
        });
        gsap.to($('.d2', hero), { yPercent: -80, rotate: 120, ease: 'none', scrollTrigger: st });
        gsap.to($('.d3', hero), { yPercent: -140, xPercent: 60, ease: 'none', scrollTrigger: st });
        gsap.to($('.d2', hero), {
            y: '+=14',
            duration: 3.2,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
        });
    }

    $$('[data-rise]').forEach((e) =>
        gsap.from(e, {
            y: 36,
            opacity: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: { trigger: e, start: 'top 90%' },
        }),
    );
    $$('[data-stag]').forEach((g) =>
        gsap.from(g.children, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: { trigger: g, start: 'top 88%' },
        }),
    );
    $$('[data-why]').forEach((g) =>
        $$('.card', g).forEach((c, i) =>
            gsap.from(c, {
                y: 60,
                opacity: 0,
                rotate: i % 2 ? 2 : -2,
                duration: 0.9,
                ease: 'power3.out',
                delay: (i % 4) * 0.06,
                scrollTrigger: { trigger: c, start: 'top 92%' },
            }),
        ),
    );
    $$('[data-num]').forEach((n) =>
        gsap.from(n, {
            scale: 0.4,
            opacity: 0,
            transformOrigin: '0 100%',
            duration: 0.8,
            ease: 'back.out(1.8)',
            scrollTrigger: { trigger: n, start: 'top 92%' },
        }),
    );
    $$('[data-ents]').forEach((g) =>
        gsap.from(g.children, {
            scale: 0.7,
            opacity: 0,
            stagger: { each: 0.03, from: 'random' },
            duration: 0.6,
            ease: 'back.out(1.4)',
            scrollTrigger: { trigger: g, start: 'top 88%' },
        }),
    );
    $$('[data-count]').forEach((c) => {
        const o = { v: 0 };
        gsap.to(o, {
            v: Number(c.dataset.count),
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: c, start: 'top 92%', once: true },
            onUpdate: () => (c.textContent = String(Math.round(o.v))),
        });
    });
    $$('[data-row]').forEach((r) => {
        gsap.fromTo(
            r,
            { '--ln': 0 },
            {
                '--ln': 1,
                duration: 1.1,
                ease: 'power3.out',
                scrollTrigger: { trigger: r, start: 'top 90%' },
            },
        );
        gsap.from($('.ico', r), {
            scale: 0,
            rotate: -90,
            duration: 0.8,
            ease: 'back.out(1.6)',
            scrollTrigger: { trigger: r, start: 'top 90%' },
        });
        gsap.from($('h3', r), {
            x: -30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: r, start: 'top 90%' },
        });
    });
    $$('[data-par]').forEach((e) =>
        gsap.to(e, {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: { trigger: e, start: 'top bottom', end: 'bottom top', scrub: true },
        }),
    );
    $$('[data-person]').forEach((p) => {
        const ph = $('.ph', p),
            b = p.lastElementChild as HTMLElement;
        gsap.from(ph, {
            x: -80,
            opacity: 0,
            rotate: -3,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: p, start: 'top 82%' },
        });
        gsap.from($$('.eyebrow,h2,.pill,p', b), {
            y: 30,
            opacity: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: p, start: 'top 76%' },
        });
    });
    $$('[data-clip]').forEach((e) =>
        gsap.fromTo(
            e,
            { clipPath: 'inset(10% 14% 10% 14% round 28px)', scale: 1.06 },
            {
                clipPath: 'inset(0% 0% 0% 0% round 22px)',
                scale: 1,
                ease: 'none',
                scrollTrigger: { trigger: e, start: 'top 92%', end: 'center 50%', scrub: true },
            },
        ),
    );

    const cta = $('.cta');
    if (cta)
        gsap.from($$('.cta h2, .cta .btn'), {
            y: 26,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: cta, start: 'top 80%' },
        });
}
