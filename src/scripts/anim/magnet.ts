import { gsap } from 'gsap';

type Mover = { x: ReturnType<typeof gsap.quickTo>; y: ReturnType<typeof gsap.quickTo> };

/** Botones dorados que "siguen" ligeramente al ratón. Solo en dispositivos con puntero fino. */
export function initMagnet() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const sel = '.btn.gold, .btn.line';

    // quickTo reutiliza una sola animación por botón en vez de crear una nueva en cada movimiento
    const movers = new WeakMap<HTMLElement, Mover>();
    const mover = (b: HTMLElement) => {
        let m = movers.get(b);
        if (!m) {
            m = { x: gsap.quickTo(b, 'x', { duration: 0.3 }), y: gsap.quickTo(b, 'y', { duration: 0.3 }) };
            movers.set(b, m);
        }
        return m;
    };

    document.addEventListener('mousemove', (e) => {
        const b = (e.target as HTMLElement).closest<HTMLElement>(sel);
        if (!b) return;
        const r = b.getBoundingClientRect();
        const m = mover(b);
        m.x((e.clientX - r.left - r.width / 2) * 0.18);
        m.y((e.clientY - r.top - r.height / 2) * 0.3);
    });

    document.addEventListener('mouseout', (e) => {
        const b = (e.target as HTMLElement).closest<HTMLElement>(sel);
        // Solo al salir del botón de verdad, no al pasar entre sus <span> internos
        if (!b || b.contains(e.relatedTarget as Node | null)) return;
        const m = mover(b);
        m.x(0);
        m.y(0);
    });
}
