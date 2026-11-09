import { assets } from '../shared/assets';
import { animateLogo } from '../motion/logo';
import './logo.css';

// Posições relativas da composição original exportada do Figma.
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
export async function mount() {
  const root = document.querySelector<HTMLElement>('#main')!;
  document.title = 'Dotinha | Estudo de movimento';
  root.innerHTML = `<div class="study"><div class="study-copy"><p class="study-label">DOTINHA · ESTUDO DE MOVIMENTO</p><h1>Uma sacudidinha de leve.</h1><p>O lettering balança e os tufos acompanham com um pequeno atraso. A cada 5 segundos, a marca dá uma sacudida suave. Passe o mouse sobre as letras para movimentar os pelos.</p></div><div class="study-stage" aria-busy="true"></div><div class="study-controls"><button id="replay" type="button">Repetir movimento</button><button id="pause" type="button" aria-pressed="false">Pausar</button><label for="intensity">Intensidade <input id="intensity" type="range" min="0.2" max="1.2" step="0.05" value="0.55" /></label></div><p class="study-note" role="status">A preferência de movimento reduzido do dispositivo é respeitada.</p></div>`;
  try {
    const sources = await Promise.all(pieces.map(async (_, i) => {
      const response = await fetch(assets('contact-desktop', i ? `imgVector${i}` : 'imgVector'));
      if (!response.ok) throw new Error('Falha ao carregar o vetor.');
      return new DOMParser().parseFromString(await response.text(), 'image/svg+xml').documentElement;
    }));
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '-50 -30 1412 349');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Dotinha, com movimento sutil de sacudida e dos pelos');
    sources.forEach((source, i) => {
      const [x,y,w,h] = pieces[i];
      const outer = document.createElementNS(ns, 'g');
      const [,,sw,sh] = source.getAttribute('viewBox')!.split(' ').map(Number);
      outer.setAttribute('transform', `translate(${x*13.12} ${y*2.89}) scale(${w*13.12/sw} ${h*2.89/sh})`);
      const letter = document.createElementNS(ns, 'g');
      letter.dataset.letter = String(i); letter.dataset.fur = JSON.stringify(zones[i]);
      source.querySelectorAll('path').forEach(path => { path.removeAttribute('id'); letter.append(path); });
      outer.append(letter); svg.append(outer);
    });
    const stage = root.querySelector('.study-stage')!;
    stage.replaceChildren(svg); stage.setAttribute('aria-busy', 'false');
    const motion = animateLogo(svg);
    const pause = root.querySelector<HTMLButtonElement>('#pause')!;
    const setPaused = (value: boolean) => {
      pause.setAttribute('aria-pressed', String(value));
      pause.textContent = value ? 'Retomar' : 'Pausar'; motion.pause(value);
    };
    pause.addEventListener('click', () => setPaused(pause.getAttribute('aria-pressed') !== 'true'));
    root.querySelector('#replay')!.addEventListener('click', () => { setPaused(false); motion.replay(); });
    root.querySelector<HTMLInputElement>('#intensity')!.addEventListener('input', event => motion.intensity(Number((event.target as HTMLInputElement).value)));
    if (import.meta.hot) import.meta.hot.dispose(() => motion.destroy());
  } catch (error) {
    root.querySelector('.study-note')!.textContent = 'Não foi possível carregar o logo. Recarregue a página para tentar novamente.';
    console.error(error);
  }
}

