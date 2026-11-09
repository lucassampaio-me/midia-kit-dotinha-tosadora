import './content.css';
import { assets } from '../shared/assets';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { openVideo } from '../shared/modal';
import { eyebrow, escapeHtml, sectionTitle } from '../shared/ui';

type FeaturedContent = {
  title: string;
  description: string;
  cover: string;
  result: string;
  published: string;
  consulted: string;
  category: string;
  videoUrl?: string;
};

// Covers and publication metrics remain provisional, as marked in Figma.
const featuredContent: FeaturedContent[] = [
  {
    title: 'Bastidores do cuidado',
    description: 'Minha rotina de trabalho mostra os cuidados e os detalhes que fazem parte do banho e da tosa.',
    cover: 'imgCapaEmFoco916',
    result: '[Resultado da publicação]',
    published: '[data]',
    consulted: '[data]',
    category: '[Orgânico / parceria]',
  },
  {
    title: 'Transformações',
    description: 'O antes e depois valoriza a técnica, o resultado do trabalho e a individualidade de cada animal.',
    cover: 'imgVideoLateral2',
    result: '[Resultado da publicação]',
    published: '[data]',
    consulted: '[data]',
    category: '[Orgânico / parceria]',
  },
  {
    title: 'Produtos na rotina',
    description: 'A experiência prática ajuda a apresentar produtos e acessórios em situações reais de uso.',
    cover: 'imgVideoLateral1',
    result: '[Resultado da publicação]',
    published: '[data]',
    consulted: '[data]',
    category: '[Orgânico / parceria]',
  },
];

const wrapIndex = (index: number): number => ((index % featuredContent.length) + featuredContent.length) % featuredContent.length;
// Two invisible buffer items let the circular sequence recycle outside the stage.
const offsets = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

function renderSlide(offset: number, slot: number): string {
  const index = wrapIndex(offset);
  const item = featuredContent[index];
  return '<article class="content-slide" data-content-offset="' + offset + '" data-content-index="' + index + '" aria-label="' + escapeHtml(item.title) + '">' +
    '<button class="content-cover" type="button" aria-label="Colocar em foco: ' + escapeHtml(item.title) + '"><img src="' + assets('content-desktop', item.cover) + '" alt="Capa provisória de ' + escapeHtml(item.title) + '" width="270" height="480" loading="lazy" /></button>' +
    '<div class="content-card-reveal"><div class="content-card"><h3 id="content-item-' + slot + '">' + escapeHtml(item.title) + '</h3>' +
    '<p class="content-description">' + escapeHtml(item.description) + '</p>' +
    '<p class="content-result">' + escapeHtml(item.result) + '</p>' +
    '<div class="content-metadata"><p>Publicado em ' + escapeHtml(item.published) + ' · Acumulado até ' + escapeHtml(item.consulted) + '</p><p>' + escapeHtml(item.category) + '</p></div>' +
    '<button class="content-video" type="button" data-content-video="' + index + '" aria-label="Visualizar vídeo: ' + escapeHtml(item.title) + '">Visualizar vídeo</button></div></div></article>';
}

export function render(): string {
  const title = sectionTitle('Um pouco do meu universo', 'content-title', 'content-heading');
  return '<section class="content" id="conteudos" aria-labelledby="content-heading">' +
    '<header class="content-header container">' + eyebrow('CONTEÚDO') + title +
    '<p class="content-introduction">Experiência profissional, cuidado e personalidade em diferentes histórias.</p></header>' +
    '<div class="content-stage" role="region" aria-roledescription="carrossel" aria-label="Conteúdos em destaque">' +
    '<div class="content-carousel">' + offsets.map(renderSlide).join('') + '</div>' +
    '<div class="content-controls"><button class="content-arrow content-prev" type="button" aria-label="Conteúdo anterior">' +
    '<img src="' + assets('content-desktop', 'imgPhosphorArrowLeftDuotone') + '" alt="" width="24" height="24" /></button>' +
    '<div class="content-pagination" aria-label="Selecionar conteúdo">' + featuredContent.map((item, index) =>
      '<button class="content-dot" type="button" data-content-page="' + index + '" aria-label="Colocar em foco: ' + escapeHtml(item.title) + '"></button>').join('') + '</div>' +
    '<button class="content-arrow content-next" type="button" aria-label="Próximo conteúdo">' +
    '<img src="' + assets('content-desktop', 'imgPhosphorArrowRightDuotone') + '" alt="" width="24" height="24" /></button></div>' +
    '<p class="content-status sr-only" aria-live="polite" aria-atomic="true"></p></div></section>';
}

export function init(root: HTMLElement): () => void {
  const section = root.matches('#conteudos') ? root : root.querySelector<HTMLElement>('#conteudos');
  const carousel = section?.querySelector<HTMLElement>('.content-carousel');
  if (!section || !carousel) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  const controller = new AbortController();
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const slots = Array.from(carousel.querySelectorAll<HTMLElement>('.content-slide')).map(element => ({
    element,
    offset: Number(element.dataset.contentOffset),
    reveal: element.querySelector<HTMLElement>('.content-card-reveal')!,
    card: element.querySelector<HTMLElement>('.content-card')!,
    cover: element.querySelector<HTMLButtonElement>('.content-cover')!,
  }));
  const dots = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-content-page]'));
  let active = 0;
  let pending = 0;
  let busy = false;
  let timeline: gsap.core.Timeline | undefined;
  let entered = motionPreference.matches;
  let mobile = innerWidth < 800;
  const geometry = (offset: number) => {
    const distance = Math.abs(offset);
    const coverWidth = mobile ? 232 : 270;
    const gap = 20;
    // Reserve the same gap for every slot, scaling only the side covers to fit.
    const sideScale = mobile ? 1 : Math.min(1, Math.max(.45, ((carousel.clientWidth - 710) / 2 - gap * 3) / 415));
    const widths = mobile ? [232, 155, 120, 94, 72] : [270, 175 * sideScale, 135 * sideScale, 105 * sideScale, 80 * sideScale];
    const scale = widths[Math.min(distance, 4)] / coverWidth;
    let x = mobile ? -116 : -355;
    if (offset > 0) {
      x = mobile ? 116 : 355;
      for (let step = 1; step <= distance; step++) x += gap + (step > 1 ? widths[step - 1] : 0);
    } else if (offset < 0) {
      for (let step = 1; step <= distance; step++) x -= gap + widths[step];
    }
    return { x, y: (coverWidth * 16 / 9) * (1 - scale) / 2, scale, opacity: distance > 3 ? 0 : [1, .65, .4, .23][distance] };
  };
  const sync = () => {
    slots.forEach(slot => {
      const current = slot.offset === 0;
      const hidden = Math.abs(slot.offset) > 3;
      slot.element.dataset.contentOffset = String(slot.offset);
      slot.element.style.zIndex = String(current ? 10 : 5 - Math.abs(slot.offset));
      slot.element.inert = hidden;
      slot.element.setAttribute('aria-hidden', String(hidden));
      slot.reveal.inert = !current;
      slot.reveal.setAttribute('aria-hidden', String(!current));
      slot.cover.tabIndex = current || hidden ? -1 : 0;
      slot.cover.setAttribute('aria-current', String(current));
    });
    dots.forEach((dot, index) => dot.setAttribute('aria-current', String(index === active)));
    section.querySelector<HTMLElement>('.content-status')!.textContent = 'Conteúdo ' + (active + 1) + ' de ' + featuredContent.length + ': ' + featuredContent[active].title;
  };
  const settle = () => {
    carousel.style.height = (mobile ? Math.max(650, 232 * 16 / 9 - 80 + Math.max(...slots.map(slot => slot.card.offsetHeight))) : 480) + 'px';
    slots.forEach(slot => {
      gsap.set(slot.element, geometry(slot.offset));
      gsap.set(slot.reveal, { width: mobile ? Math.min(342, innerWidth - 48) : slot.offset === 0 ? 460 : 0, clipPath: slot.offset === 0 ? 'inset(0% 0% 0% 0%)' : mobile ? 'inset(0% 0% 100% 0%)' : 'inset(0% 100% 0% 0%)' });
      gsap.set(slot.card, { opacity: slot.offset === 0 ? 1 : 0, x: slot.offset === 0 ? 0 : -20, y: 0 });
    });
    sync();
  };
  const advance = () => {
    if (busy || !pending) return;
    busy = true;
    const direction = Math.sign(pending);
    pending -= direction;
    const outgoing = slots.find(slot => slot.offset === 0)!;
    // Never leave keyboard focus inside text that is about to collapse.
    if (outgoing.reveal.contains(document.activeElement)) section.querySelector<HTMLButtonElement>(direction > 0 ? '.content-next' : '.content-prev')!.focus({ preventScroll: true });
    active = wrapIndex(active + direction);
    slots.forEach(slot => {
      slot.offset -= direction;
      if (slot.offset < -4 || slot.offset > 4) {
        slot.offset = direction > 0 ? 4 : -4;
        gsap.set(slot.element, geometry(slot.offset));
      }
    });
    const incoming = slots.find(slot => slot.offset === 0)!;
    sync();
    if (motionPreference.matches) {
      settle();
      busy = false;
      advance();
      return;
    }
    timeline = gsap.timeline({ onComplete: () => { busy = false; settle(); advance(); } });
    timeline.to(outgoing.card, { opacity: 0, x: -20, duration: .16 }, 0)
      .to(outgoing.reveal, { width: mobile ? Math.min(342, innerWidth - 48) : 0, clipPath: mobile ? 'inset(0% 0% 100% 0%)' : 'inset(0% 100% 0% 0%)', duration: .28, ease: 'power2.inOut' }, 0);
    slots.forEach(slot => timeline!.to(slot.element, { ...geometry(slot.offset), duration: .64, ease: 'power3.inOut' }, .1));
    timeline.to(incoming.reveal, { width: mobile ? Math.min(342, innerWidth - 48) : 460, clipPath: 'inset(0% 0% 0% 0%)', duration: .42, ease: 'power3.out' }, .42)
      .to(incoming.card, { opacity: 1, x: 0, duration: .32, ease: 'power2.out' }, .49);
  };
  const navigate = (steps: number) => {
    if (!entered) reveal();
    if (busy && timeline && timeline.data === 'entrance') timeline.progress(1);
    pending = Math.max(-6, Math.min(6, pending + steps));
    advance();
  };
  const reveal = () => {
    if (entered) return;
    entered = true;
    busy = true;
    timeline = gsap.timeline({ data: 'entrance', onComplete: () => { busy = false; settle(); advance(); } });
    [0, -1, 1, -2, 2, -3, 3].forEach((offset, order) => {
      const slot = slots.find(item => item.offset === offset)!;
      const position = geometry(offset);
      timeline!.fromTo(slot.element, { ...position, scale: position.scale * .9, opacity: 0 }, { ...position, duration: .7, ease: 'power3.out' }, order * .12);
    });
  };
  settle();
  if (!entered) gsap.set(slots.map(slot => slot.element), { opacity: 0 });
  const trigger = ScrollTrigger.create({ trigger: carousel, start: 'top 88%', once: true, onEnter: reveal });
  section.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    const video = target?.closest<HTMLButtonElement>('[data-content-video]');
    if (video) {
      const item = featuredContent[Number(video.dataset.contentVideo)];
      openVideo({ title: item.title, poster: assets('content-desktop', item.cover), url: item.videoUrl });
    } else if (target?.closest('.content-next')) navigate(1);
    else if (target?.closest('.content-prev')) navigate(-1);
    else if (target?.closest('[data-content-page]')) {
      const index = Number(target.closest<HTMLElement>('[data-content-page]')!.dataset.contentPage);
      const delta = wrapIndex(index - active);
      pending = 0;
      navigate(delta > featuredContent.length / 2 ? delta - featuredContent.length : delta);
    } else if (target?.closest('.content-cover')) {
      const element = target.closest<HTMLElement>('.content-slide');
      const slot = slots.find(item => item.element === element)!;
      if (slot.offset) { pending = 0; navigate(slot.offset); }
    }
  }, { signal: controller.signal });
  section.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    navigate(event.key === 'ArrowLeft' ? -1 : 1);
  }, { signal: controller.signal });
  // Keep native vertical scrolling while allowing a horizontal touch swipe.
  let pointer: { x: number; y: number; id: number } | undefined;
  let suppressClick = false;
  carousel.addEventListener('pointerdown', event => {
    suppressClick = false;
    if (event.pointerType === 'mouse' || event.target instanceof Element && event.target.closest('.content-card')) return;
    pointer = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }, { signal: controller.signal });
  carousel.addEventListener('pointerup', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pointer = undefined;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) { suppressClick = true; navigate(dx < 0 ? 1 : -1); }
  }, { signal: controller.signal });
  carousel.addEventListener('pointercancel', () => { pointer = undefined; }, { signal: controller.signal });
  carousel.addEventListener('click', event => {
    if (suppressClick) { event.stopPropagation(); event.preventDefault(); suppressClick = false; }
  }, { capture: true, signal: controller.signal });
  section.addEventListener('focusin', () => {
    if (!entered) reveal();
    if (timeline?.data === 'entrance') timeline.progress(1);
  }, { signal: controller.signal });
  const refreshLayout = () => {
    timeline?.kill();
    busy = false;
    pending = 0;
    mobile = innerWidth < 800;
    settle();
    if (!entered) gsap.set(slots.map(slot => slot.element), { opacity: 0 });
  };
  window.addEventListener('resize', refreshLayout, { signal: controller.signal });
  const updateMotion = () => {
    if (motionPreference.matches) entered = true;
    refreshLayout();
  };
  motionPreference.addEventListener('change', updateMotion);
  return () => {
    controller.abort();
    motionPreference.removeEventListener('change', updateMotion);
    trigger.kill();
    timeline?.kill();
    gsap.killTweensOf(slots.flatMap(slot => [slot.element, slot.reveal, slot.card]));
  };
}
