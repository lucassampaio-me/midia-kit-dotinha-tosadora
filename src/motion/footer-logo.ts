import { assets } from '../shared/assets';
import { animateLogo } from './logo';

const pieces = [
  [69.28,4.59,13.54,87.6], [84.84,21.28,15.16,78.79],
  [53.37,16.15,13.49,76.02], [33.16,2.66,11.28,91.08],
  [45.26,28.43,5.7,63.73], [45.64,.05,5.73,25.4],
  [0,2.91,15.84,89.26], [17.66,21.24,15.28,76.76],
];
const zones = [
  [[.35,.07],[.83,.22],[.33,.76]], [[.8,.08],[.92,.55],[.2,.95]],
  [[.8,.05],[.35,.7]], [[.35,.06],[.2,.72]], [[.05,.4]],
  [[.1,.16]], [[.76,.05],[.05,.66]], [[.12,.12],[.2,.92]],
];

/** Aplica o estudo aprovado mantendo os assets estáticos como fallback. */
export function initFooterLogo(root: HTMLElement): () => void {
  const breakpoint = matchMedia('(max-width:799px)');
  const events = new AbortController();
  let generation = 0;
  let cleanup = () => {};
  const load = async () => {
    const current = ++generation;
    cleanup(); cleanup = () => {};
    const mobile = breakpoint.matches;
    const host = root.querySelector<HTMLElement>(`.contact-brand--${mobile ? 'mobile' : 'desktop'}`);
    if (!host) return;
    try {
      const names = mobile ? [assets('contact-mobile', 'imgGroup3')] : pieces.map((_, i) => assets('contact-desktop', i ? `imgVector${i}` : 'imgVector'));
      const sources = await Promise.all(names.map(async url => {
        const response = await fetch(url, {signal: events.signal});
        if (!response.ok) throw new Error('Falha ao carregar o lettering.');
        return new DOMParser().parseFromString(await response.text(), 'image/svg+xml').documentElement;
      }));
      if (current !== generation) return;
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('viewBox', mobile ? sources[0].getAttribute('viewBox')! : '0 0 1312 289');
      svg.setAttribute('aria-hidden', 'true');
      svg.classList.add('contact-brand__motion');
      const addLetter = (path: Element, index: number, parent: Element) => {
        const letter = document.createElementNS(ns, 'g');
        letter.dataset.letter = String(index);
        letter.dataset.fur = JSON.stringify(zones[index]);
        path.removeAttribute('id'); letter.append(path); parent.append(letter);
      };
      if (mobile) {
        sources[0].querySelectorAll('path').forEach((path, i) => addLetter(path, i, svg));
      } else {
        sources.forEach((source, i) => {
          const [x,y,w,h] = pieces[i];
          const [,,sw,sh] = source.getAttribute('viewBox')!.split(' ').map(Number);
          const outer = document.createElementNS(ns, 'g');
          outer.setAttribute('transform', `translate(${x*13.12} ${y*2.89}) scale(${w*13.12/sw} ${h*2.89/sh})`);
          source.querySelectorAll('path').forEach(path => addLetter(path, i, outer));
          svg.append(outer);
        });
      }
      host.append(svg); host.classList.add('contact-brand--animated');
      const motion = animateLogo(svg);
      const observer = new IntersectionObserver(([entry]) => motion.pause(!entry.isIntersecting));
      observer.observe(host);
      cleanup = () => { observer.disconnect(); motion.destroy(); svg.remove(); host.classList.remove('contact-brand--animated'); };
    } catch (error) {
      if (!events.signal.aborted) console.error('Não foi possível animar o lettering do rodapé.', error);
    }
  };
  breakpoint.addEventListener('change', () => { void load(); }, {signal: events.signal});
  void load();
  return () => { ++generation; events.abort(); cleanup(); };
}
