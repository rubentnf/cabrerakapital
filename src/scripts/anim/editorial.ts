import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$ } from '../utils';

/** Sección "No firme a ciegas": titular por líneas, imágenes con parallax y lista que se resalta. */
export function initEditorial() {
    const ed = $('#edit');
    if (!ed) return;

    gsap.from($$('.ln > span', ed), {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.14,
        ease: 'power4.out',
        scrollTrigger: { trigger: ed, start: 'top 60%' },
    });

    $$('.fi', ed).forEach((f) => {
        const v = Number(f.dataset.speed) || 0;
        gsap.fromTo(
            f,
            { y: -v * 0.5 },
            {
                y: v * 0.5,
                ease: 'none',
                scrollTrigger: { trigger: ed, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
            },
        );
    });

    const li = $$('.edit-list li', ed);
    ScrollTrigger.create({
        trigger: ed,
        start: 'top 60%',
        end: 'bottom 40%',
        onUpdate: (st) => {
            const k = Math.min(li.length - 1, Math.floor(st.progress * li.length));
            li.forEach((x, n) => x.classList.toggle('on', n === k));
        },
    });
}