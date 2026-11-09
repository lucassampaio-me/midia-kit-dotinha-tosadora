import './styles.css';
import * as hero from './sections/hero';
import * as results from './sections/results';
import * as audience from './sections/audience';
import * as content from './sections/content';
import * as contact from './sections/contact';

const root = document.querySelector<HTMLElement>('#main')!;
const sections = [hero, results, audience, content, contact];
root.innerHTML = sections.map(section => section.render()).join('');
const cleanup = sections.map(section => section.init(root));
let disposed = false;

// A página estática continua disponível se a camada de movimento não carregar.
Promise.all([import('./motion/scroll'), import('./motion/animations')])
  .then(async ([scroll, animations]) => {
    await document.fonts.ready;
    if (disposed) return;
    cleanup.push(scroll.initScroll(root));
    cleanup.push(animations.initAnimations(root));
  })
  .catch(error => console.error('Não foi possível inicializar a camada de movimento.', error));
if (location.hash) {
  requestAnimationFrame(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView());
}
if (import.meta.hot) import.meta.hot.dispose(() => {
  disposed = true;
  cleanup.reverse().forEach(dispose => dispose());
});

