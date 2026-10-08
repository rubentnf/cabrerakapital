import { gsap } from 'gsap';

/** Botones dorados que "siguen" ligeramente al ratón. Solo en dispositivos con puntero fino. */
export function initMagnet() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const sel = '.btn.gold, .btn.line';
    document.addEventListener('mousemove', (e) => {
        const b = (e.target as HTMLElement).closest<HTMLElement>(sel);
        if (!b) return;
        const r = b.getBoundingClientRect();
        gsap.to(b, {
            x: (e.clientX - r.left - r.width / 2) * 0.18,
            y: (e.clientY - r.top - r.height / 2) * 0.3,
            duration: 0.3,
        });
    });
    document.addEventListener('mouseout', (e) => {
        const b = (e.target as HTMLElement).closest<HTMLElement>(sel);
        if (b) gsap.to(b, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,.5)' });
    });
}