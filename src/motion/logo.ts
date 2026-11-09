import { gsap } from 'gsap';
import { findFurTips } from './fur-tips';

/** Balanço do lettering com deformação localizada nos tufos dos paths originais. */
export function animateLogo(svg: SVGSVGElement, surface: Element = svg, swayScale = 1) {
  const letters = [...svg.querySelectorAll<SVGGElement>('[data-letter]')];
  const shapes = letters.flatMap(letter => [...letter.querySelectorAll('path')].map(path => {
    const original = path.getAttribute('d')!;
    const box = path.getBBox();
    const zones = JSON.parse(letter.dataset.fur!) as [number, number][];
    const chunks = [...original.matchAll(/([MLCHVZ])([^MLCHVZ]*)/g)].map(match => ({
      command: match[1], values: (match[2].match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []).map(Number),
    }));
    const tips = letter.dataset.furMode === 'tips' ? findFurTips(chunks) : [];
    // O peso de cada ponto é calculado uma vez; as raízes ficam fora do raio.
    const tipWeights = chunks.map(chunk => chunk.values.map((_, i, values) => {
      const pair = i-i%2;
      return tips.map(tip => {
        const distance = Math.hypot(values[pair]-tip.x, values[pair+1]-tip.y);
        const weight = Math.max(0, 1-(distance/(box.height*.045))**2)**2;
        return {tip, weight};
      }).filter(({weight}) => weight > 0);
    }));
    return { letter, path, original, box, zones, chunks, tips, tipWeights, pointer: { x: .5, y: .5, force: 0, bend: 0 } };
  }));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  let paused = false;
  let intensity = .55;
  let timeline: gsap.core.Timeline | undefined;
  const state = { progress: 0 };
  const reset = () => shapes.forEach(({letter, path, original}) => {
    path.setAttribute('d', original);
    letter.removeAttribute('transform');
  });
  const render = () => shapes.forEach(({letter, path, box, zones, chunks, tips, tipWeights, pointer}, index) => {
    const local = Math.max(0, Math.min(1, (state.progress - index * .018) / .82));
    const envelope = Math.sin(Math.PI * local) ** 2;
    const wave = (Math.sin(local * Math.PI * 6) * envelope + pointer.bend * 2.5) * intensity * swayScale;
    const fur = Math.sin(local * Math.PI * 6 - .85) * envelope * intensity;
    // Todos os comandos são absolutos. Os tufos estão nas curvas C;
    // H/V ficam intactos para preservar as hastes retas das letras.
    path.setAttribute('d', chunks.map(({command, values}, chunkIndex) => {
      if ('HVZ'.includes(command)) return command + values.join(' ');
      return command + values.map((value, i) => {
        if (tips.length) {
          const offset = tipWeights[chunkIndex][i].reduce((sum, {tip, weight}) => {
            const nx = (tip.x-box.x)/box.width, ny = (tip.y-box.y)/box.height;
            const near = Math.exp(-(((nx-pointer.x)/.2)**2+((ny-pointer.y)/.2)**2));
            const auto = Math.sin(local*Math.PI*6-.85-tip.phase*.16)*envelope;
            return sum + weight*(i%2 ? tip.ty : tip.tx)*(auto+near*pointer.force*3);
          }, 0);
          return (value+offset*box.height*.035*intensity).toFixed(4);
        }
        const pair = i - i % 2;
        const nx = (values[pair] - box.x) / box.width;
        const ny = (values[pair + 1] - box.y) / box.height;
        const influence = Math.max(0, ...zones.map(([x,y]) =>
          Math.exp(-(((nx-x)/.12)**2 + ((ny-y)/.14)**2) * 1.5)));
        const nearCursor = Math.exp(-(((nx-pointer.x)/.22)**2 + ((ny-pointer.y)/.28)**2));
        const cursorFur = nearCursor * pointer.force * intensity * 3;
        return (value + (influence * fur + cursorFur) * box.height * (i % 2 ? .006 : .023)).toFixed(4);
      }).join(' ');
    }).join(' '));
    letter.setAttribute('transform', `translate(${wave*1.8} 0) rotate(${wave*.65} ${box.x+box.width/2} ${box.y+box.height*.85})`);
  });
  const clearPointer = () => shapes.forEach(({pointer}) => {
    gsap.killTweensOf(pointer);
    pointer.force = 0; pointer.bend = 0;
  });
  const leave = () => {
    if (paused || reduced.matches || document.hidden) return;
    shapes.forEach(({pointer}) => {
    gsap.to(pointer, {force: 0, bend: 0, duration: .9, ease: 'elastic.out(1, 0.45)', overwrite: true, onUpdate: render});
    });
  };
  surface.addEventListener('pointermove', ((event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || paused || reduced.matches || document.hidden) return;
    shapes.forEach(({letter, box, tips, pointer}) => {
      // O pai conserva a matriz estática, evitando realimentação do próprio balanço.
      const matrix = (letter.parentNode as SVGGraphicsElement).getScreenCTM();
      if (!matrix) return;
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
      const x = (point.x-box.x)/box.width;
      const y = (point.y-box.y)/box.height;
      const dx = Math.max(0, -x, x-1);
      const dy = Math.max(0, -y, y-1);
      const proximity = Math.exp(-(dx*dx + dy*dy)*18);
      const direction = Math.max(-1, Math.min(1, (x-.5)*2));
      const force = tips.length ? Math.sign(direction || 1)*(.65+Math.abs(direction)*.35) : direction*.6+.35;
      gsap.to(pointer, {x, y, force: proximity * force, bend: direction*proximity*.8,
        duration: .28, ease: 'power2.out', overwrite: true, onUpdate: render});
    });
  }) as EventListener, {signal: events.signal});
  surface.addEventListener('pointerleave', leave, {signal: events.signal});
  surface.addEventListener('pointercancel', leave, {signal: events.signal});
  const restart = () => {
    timeline?.kill(); clearPointer(); reset(); state.progress = 0;
    if (reduced.matches) return;
    timeline = gsap.timeline({repeat: -1, repeatDelay: 3.35, paused: paused || document.hidden});
    timeline.to(state, {progress: 1, duration: 1.65, ease: 'none', onUpdate: render});
  };
  const sync = () => {
    if (paused || document.hidden) {
      timeline?.pause(); clearPointer();
      if (!reduced.matches) render();
    } else timeline?.resume();
  };
  reduced.addEventListener('change', restart, {signal: events.signal});
  document.addEventListener('visibilitychange', sync, {signal: events.signal});
  restart();
  return {
    replay: () => { paused = false; restart(); },
    pause: (value: boolean) => { paused = value; sync(); },
    intensity: (value: number) => { intensity = value; if (!reduced.matches) render(); },
    destroy: () => { timeline?.kill(); clearPointer(); events.abort(); reset(); },
  };
}
