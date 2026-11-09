import { animateLogo } from './logo';

/** Sobrepõe os vetores animados aos mesmos assets responsivos do hero. */
export function initHeroFur(root: HTMLElement): () => void {
  const surface = root.querySelector<HTMLElement>('.hero-card');
  if (!surface) return () => {};
  const pictures = [...surface.querySelectorAll<HTMLPictureElement>('.hero-decoration')];
  const breakpoint = matchMedia('(max-width:799px)');
  const events = new AbortController();
  let generation = 0;
  let cleanup: (() => void)[] = [];
  const clear = () => { cleanup.forEach(dispose => dispose()); cleanup = []; };
  const load = async () => {
    const current = ++generation;
    clear();
    await Promise.all(pictures.map(async (picture, index) => {
      const image = picture.querySelector('img')!;
      const source = [...picture.querySelectorAll('source')].find(source => matchMedia(source.media).matches);
      const url = source?.srcset || image.src;
      try {
        const response = await fetch(url, {signal: events.signal});
        if (!response.ok) return;
        const xml = await response.text();
        if (current !== generation) return;
        const svg = document.importNode(new DOMParser().parseFromString(xml, 'image/svg+xml').documentElement, true) as unknown as SVGSVGElement;
        svg.removeAttribute('width'); svg.removeAttribute('height');
        svg.setAttribute('aria-hidden', 'true');
        svg.classList.add('hero-decoration__motion');
        // Cada cópia mantém referências próprias para máscaras e recortes.
        svg.querySelectorAll('[id]').forEach(node => {
          const old = node.id;
          const id = `hero-fur-${index}-${current}-${old.replace(/[^a-z0-9]/gi, '')}`;
          svg.querySelectorAll('*').forEach(element => {
            [...element.attributes].forEach(attribute => {
              if (attribute.value.includes(`url(#${old})`)) element.setAttribute(attribute.name, attribute.value.replaceAll(`url(#${old})`, `url(#${id})`));
            });
          });
          node.id = id;
        });
        const zones = Array.from({length: 24}, (_, i) => {
          const angle = i * Math.PI / 12;
          return [.5 + Math.cos(angle)*.46, .5 + Math.sin(angle)*.46];
        });
        svg.querySelectorAll('path:not(defs path)').forEach((path, i) => {
          const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          group.dataset.letter = String(i);
          group.dataset.furMode = 'tips';
          group.dataset.fur = JSON.stringify(zones);
          path.before(group); group.append(path);
        });
        picture.append(svg);
        image.style.visibility = 'hidden';
        const motion = animateLogo(svg, surface, .3);
        cleanup.push(() => { motion.destroy(); svg.remove(); image.style.removeProperty('visibility'); });
      } catch (error) {
        if (!events.signal.aborted) console.error('Não foi possível animar o grafismo do hero.', error);
      }
    }));
  };
  breakpoint.addEventListener('change', () => { void load(); }, {signal: events.signal});
  void load();
  return () => { ++generation; events.abort(); clear(); };
}
