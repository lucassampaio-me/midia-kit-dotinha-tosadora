import './content.css';
import { assets } from '../shared/assets';
import { contentReels, formatDate, playTake, reelMedia, reelPaths, stopTake } from '../shared/videos';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { openVideo } from '../shared/modal';
import { eyebrow, escapeHtml, sectionTitle } from '../shared/ui';

type ContentCopy = { description: string; result: string; category: string };

// Métricas acumuladas desde a publicação até a consulta, transcritas em
// prints-posts-selecionados/metricas.md. Os nomes seguem os indicadores do Instagram.
const consulted = '09/11/2026';
const copy: Record<string, ContentCopy> = {
  DexdqWWPZJa: {
    description: 'O banho da Kira, uma cachorra de porte grande, virou um momento divertido na banheira. É o vídeo de maior repercussão entre os selecionados e representa um pico viral, não a entrega habitual do perfil.',
    result: '8.260.931 visualizações, 814 mil curtidas e 39,1 mil compartilhamentos.',
    category: 'Publicação própria',
  },
  DY0rCRUx7P4: {
    description: 'Um golden retriever grande e pesado passa pelo banho completo, da lavagem à secagem, em um vídeo que mostra a rotina real de quem trabalha com cães de porte grande.',
    result: '856.011 visualizações, 64,5 mil curtidas e 2,7 mil compartilhamentos.',
    category: 'Publicação própria',
  },
  DbTd0mqRbNr: {
    description: 'Um yorkshire sonolento na mesa de tosa mostra, com humor, como é atender o primeiro horário do pet shop. O vídeo teve a maior taxa de compartilhamentos entre os selecionados: 3,7%.',
    result: '550.465 visualizações, 54,5 mil curtidas e 13,9 mil compartilhamentos.',
    category: 'Publicação própria',
  },
  'DaEf0-5xv9u': {
    description: 'O retoque de cor rosa na cauda de um spitz mostra a técnica de coloração e apresenta o produto usado em uma situação real de trabalho. Quem assiste fica em média 56 segundos no vídeo.',
    result: '45.154 visualizações, 3 mil curtidas e 233 compartilhamentos.',
    category: 'Publicação própria',
  },
  DcESkYsxehd: {
    description: 'Na visita ao estande da Pross na Pet South America, Vitória mostra os produtos de banho e tosa da marca e o espaço montado para os profissionais do setor.',
    result: '45.219 visualizações, 378 curtidas e 25 compartilhamentos.',
    category: 'Colaboração com @pross.groomer',
  },
  Db9m0XHR9Wg: {
    description: 'Os bastidores do primeiro dia da Pet South America 2026, uma das principais feiras do setor pet, com os estandes e as novidades que chamaram a atenção de Vitória.',
    result: '41.075 visualizações, 889 curtidas e 152 compartilhamentos.',
    category: 'Publicação própria',
  },
  DcAWvG0uu_a: {
    description: 'Na visita ao estande da Pet Nutrition, Vitória apresenta o lançamento da linha Vie e participa das ativações preparadas pela marca para o público da feira.',
    result: '39.063 visualizações, 401 curtidas e 7 compartilhamentos.',
    category: 'Colaboração com @petnutritionbr',
  },
  Dbq80l8vYnE: {
    description: 'Vitória abre a caixa de produtos que recebeu da Pross e mostra os itens um a um, no formato de recebidos que apresenta a marca dentro da rotina de quem trabalha com banho e tosa.',
    result: '30.012 visualizações, 556 curtidas e 36 compartilhamentos.',
    category: 'Colaboração com @pross.groomer',
  },
};

const wrapIndex = (index: number): number => ((index % contentReels.length) + contentReels.length) % contentReels.length;
// Two invisible buffer items let the circular sequence recycle outside the stage.
const offsets = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

function slideContent(index: number): string {
  const reel = contentReels[index];
  const text = copy[reel.id];
  const position = 'Conteúdo ' + (index + 1) + ' de ' + contentReels.length;
  return '<button class="content-cover" type="button" aria-label="Colocar em foco: ' + escapeHtml(reel.title) + '">' + reelMedia(reel, 'content-cover__media', 'loading="lazy" draggable="false"') + '</button>' +
    '<div class="content-card-reveal"><div class="content-card"><h3>' + escapeHtml(reel.title) + '</h3>' +
    '<p class="content-description">' + escapeHtml(text.description) + '</p>' +
    '<p class="content-result">' + escapeHtml(text.result) + '</p>' +
    '<div class="content-metadata"><p>Publicado em ' + formatDate(reel.published) + ' · Acumulado até ' + consulted + '</p><p>' + escapeHtml(text.category) + '</p></div>' +
    '<button class="content-video" type="button" data-content-video="' + index + '" aria-label="Visualizar vídeo: ' + escapeHtml(reel.title) + ' (' + position + ')">Visualizar vídeo</button></div></div>';
}

function renderSlide(offset: number): string {
  const index = wrapIndex(offset);
  return '<article class="content-slide" data-content-offset="' + offset + '" data-content-index="' + index + '" aria-label="' + escapeHtml(contentReels[index].title) + '">' + slideContent(index) + '</article>';
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
    '<div class="content-pagination" aria-label="Selecionar conteúdo">' + contentReels.map((reel, index) =>
      '<button class="content-dot" type="button" data-content-page="' + index + '" aria-label="Colocar em foco: ' + escapeHtml(reel.title) + '"></button>').join('') + '</div>' +
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
  type Slot = { element: HTMLElement; offset: number; reveal: HTMLElement; card: HTMLElement; cover: HTMLButtonElement };
  const bind = (slot: Pick<Slot, 'element' | 'offset'>): Slot => Object.assign(slot, {
    reveal: slot.element.querySelector<HTMLElement>('.content-card-reveal')!,
    card: slot.element.querySelector<HTMLElement>('.content-card')!,
    cover: slot.element.querySelector<HTMLButtonElement>('.content-cover')!,
  });
  const slots = Array.from(carousel.querySelectorAll<HTMLElement>('.content-slide')).map(element => bind({ element, offset: Number(element.dataset.contentOffset) }));
  // With eight items and nine slots, a recycled slot must receive the item for its new position.
  const refill = (slot: Slot, index: number) => {
    if (Number(slot.element.dataset.contentIndex) === index) return;
    stopTake(slot.cover);
    slot.element.dataset.contentIndex = String(index);
    slot.element.setAttribute('aria-label', contentReels[index].title);
    slot.element.innerHTML = slideContent(index);
    bind(slot);
    applyCard(slot);
  };
  let visible = false;
  let modalOpen = false;
  const syncTakes = () => slots.forEach(slot => {
    if (slot.offset === 0 && visible && !modalOpen && !document.hidden) playTake(slot.cover);
    else stopTake(slot.cover);
  });
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
    section.querySelector<HTMLElement>('.content-status')!.textContent = 'Conteúdo ' + (active + 1) + ' de ' + contentReels.length + ': ' + contentReels[active].title;
    syncTakes();
  };
  const applyCard = (slot: Slot) => {
    gsap.set(slot.reveal, { width: mobile ? Math.min(342, innerWidth - 48) : slot.offset === 0 ? 460 : 0, clipPath: slot.offset === 0 ? 'inset(0% 0% 0% 0%)' : mobile ? 'inset(0% 0% 100% 0%)' : 'inset(0% 100% 0% 0%)' });
    gsap.set(slot.card, { opacity: slot.offset === 0 ? 1 : 0, x: slot.offset === 0 ? 0 : -20, y: 0 });
  };
  const settle = () => {
    carousel.style.height = (mobile ? Math.max(650, 232 * 16 / 9 - 80 + Math.max(...slots.map(slot => slot.card.offsetHeight))) : 480) + 'px';
    slots.forEach(slot => {
      gsap.set(slot.element, geometry(slot.offset));
      applyCard(slot);
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
        refill(slot, wrapIndex(active + slot.offset));
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
      const reel = contentReels[Number(video.dataset.contentVideo)];
      const paths = reelPaths(reel);
      openVideo({ title: reel.title, poster: paths.thumb, url: paths.full, link: paths.instagram });
    } else if (target?.closest('.content-next')) navigate(1);
    else if (target?.closest('.content-prev')) navigate(-1);
    else if (target?.closest('[data-content-page]')) {
      const index = Number(target.closest<HTMLElement>('[data-content-page]')!.dataset.contentPage);
      const delta = wrapIndex(index - active);
      pending = 0;
      navigate(delta > contentReels.length / 2 ? delta - contentReels.length : delta);
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
  document.addEventListener('dotinha:modal', event => { modalOpen = Boolean((event as CustomEvent<{ open: boolean }>).detail.open); syncTakes(); }, { signal: controller.signal });
  document.addEventListener('visibilitychange', syncTakes, { signal: controller.signal });
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncTakes(); }, { threshold: 0.25 });
  observer.observe(carousel);
  const updateMotion = () => {
    if (motionPreference.matches) entered = true;
    refreshLayout();
  };
  motionPreference.addEventListener('change', updateMotion);
  return () => {
    controller.abort();
    observer.disconnect();
    slots.forEach(slot => stopTake(slot.cover));
    motionPreference.removeEventListener('change', updateMotion);
    trigger.kill();
    timeline?.kill();
    gsap.killTweensOf(slots.flatMap(slot => [slot.element, slot.reveal, slot.card]));
  };
}
