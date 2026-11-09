import './hero.css';
import { assets } from '../shared/assets';
import { createCarousel } from '../shared/carousel';
import { brandLogo } from '../shared/brand-logo';
import type Swiper from 'swiper';
import { openVideo } from '../shared/modal';
import { escapeHtml } from '../shared/ui';
import { heroReels, playTake, reelMedia, reelPaths, stopTake } from '../shared/videos';

const group = 'hero-desktop';
const asset = (name: string) => assets(group, name);
const navigation = [
  ['resultados', 'Resultados', 'imgPhosphorChartLineUpDuotone'],
  ['publico', 'Público', 'imgPhosphorUsersDuotone'],
  ['conteudos', 'Conteúdos', 'imgPhosphorStackDuotone'],
  ['parcerias', 'Parcerias', 'imgPhosphorHandshakeDuotone'],
];
const pillars = [
  ['imgPhosphorScissorsDuotone', 'Rotina de banho e tosa, do início ao fim.'],
  ['imgPhosphorPawPrintDuotone', 'Cuidados com pets, com atenção aos detalhes.'],
  ['imgPhosphorHeartDuotone', 'Vida de tosadora, com técnica e personalidade.'],
];

function logo(): string {
  return brandLogo('hero-logo', '#apresentacao', 'Dotinha Tosadora, início');
}

export function render(): string {
  return `<section class="hero" id="apresentacao" aria-labelledby="hero-title">
    <div class="hero-card">
      <picture class="hero-decoration hero-decoration--top" aria-hidden="true"><source media="(max-width:799px)" srcset="${assets('hero-mobile', 'imgPeloOriginalCantoSuperior')}" /><img src="${asset('imgDecoracaoPeloDaIdentidade1')}" alt="" /></picture>
      <picture class="hero-decoration hero-decoration--bottom" aria-hidden="true"><source media="(max-width:799px)" srcset="${assets('hero-mobile', 'imgPeloOriginalRecorteMobile')}" /><img src="${asset('imgDecoracaoPeloDaIdentidade')}" alt="" /></picture>
      <header class="hero-header">
        ${logo()}
        <nav class="hero-nav" aria-label="Seções do mídia kit">${navigation.map(([id, text, icon]) => `<a class="hero-nav__link${id === 'parcerias' ? ' hero-nav__link--contact' : ''}" href="#${id}"><img src="${asset(icon)}" alt="" /><span>${text}</span></a>`).join('')}</nav>
      </header>
      <div class="hero-body">
        <div class="hero-copy">
          <div class="hero-introduction">
            <h1 class="hero-title" id="hero-title">Vitória Dota</h1>
            <p class="hero-profession">Tosadora profissional e criadora de conteúdo</p>
            <p class="hero-biography">Sou a Vitória Dota, a Dotinha. Tenho 5 anos de experiência com banho e tosa e compartilho minha rotina, os cuidados e as descobertas de quem trabalha com animais.</p>
            <p class="hero-biography">Minha vivência com diferentes raças, portes e pelagens traz contexto para apresentar produtos e marcas dentro de uma rotina real de cuidado.</p>
          </div>
          <ul class="hero-pillars">${pillars.map(([icon, text]) => `<li><img src="${asset(icon)}" alt="" /><span>${text}</span></li>`).join('')}</ul>
        </div>
        <div class="hero-carousel-shell">
          <div class="hero-carousel swiper" tabindex="0" aria-label="Portfólio de banho e tosa. Use as setas para navegar.">
            <div class="hero-track swiper-wrapper">${[...heroReels, ...heroReels].map((reel, i) => `<div class="hero-slide swiper-slide" data-hero-index="${i % heroReels.length}" data-swiper-autoplay="${Math.round(reel.take * 1000)}">${reelMedia(reel, 'hero-cover', i === 0 ? 'fetchpriority="high"' : 'loading="lazy"')}<button class="hero-video-play" type="button" aria-label="Assistir ao vídeo: ${escapeHtml(reel.title)}"><img src="/assets/phosphor-play-duotone.svg" width="28" height="28" alt="" /></button></div>`).join('')}</div>
          </div>
          <div class="hero-progress"><svg class="hero-progress__ring" width="52" height="52" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="20" fill="none" stroke="currentColor" stroke-opacity=".18" stroke-width="3" /><circle class="hero-progress__stroke" cx="26" cy="26" r="20" pathLength="100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="100" /></svg><button class="hero-autoplay-toggle" type="button" aria-label="Pausar troca automática de imagens" hidden><img class="hero-autoplay-toggle__icon" src="/assets/phosphor-pause-duotone.svg" width="18" height="18" alt="" /></button></div>
        </div>
      </div>
    </div>
  </section>`;
}

export function init(root: HTMLElement): () => void {
  const element = root.querySelector<HTMLElement>('.hero-carousel');
  if (!element) return () => {};
  const events = new AbortController();
  let visible = true;
  let modalOpen = false;
  // Só o slide ativo toca o take, e apenas com o carrossel visível e sem modal aberto.
  const syncTakes = (instance: Swiper) => {
    instance.slides.forEach((slide, index) => {
      if (index === instance.activeIndex && visible && !modalOpen && !document.hidden) playTake(slide);
      else stopTake(slide);
    });
  };
  const swiper = createCarousel(element, {
    slidesPerView: 'auto',
    spaceBetween: 24,
    // Dois conjuntos mantêm capas suficientes para o loop com vizinhas visíveis.
    loop: true,
    speed: 0,
    autoplay: false,
    grabCursor: true,
    on: {
      slideChange(instance) {
        instance.slides.forEach(slide => {
          const play = slide.querySelector<HTMLButtonElement>('.hero-video-play');
          if (play) play.tabIndex = slide === instance.slides[instance.activeIndex] ? 0 : -1;
          slide.setAttribute('aria-label', `Vídeo ${Number(slide.dataset.heroIndex) + 1} de ${heroReels.length}`);
        });
        syncTakes(instance);
      },
    },
  });
  syncTakes(swiper);
  element.addEventListener('click', event => {
    const play = event.target instanceof Element ? event.target.closest<HTMLElement>('.hero-video-play') : null;
    const slide = play?.closest<HTMLElement>('.hero-slide');
    if (!slide) return;
    const reel = heroReels[Number(slide.dataset.heroIndex)];
    const paths = reelPaths(reel);
    openVideo({ title: reel.title, poster: paths.thumb, url: paths.full, link: paths.instagram });
  }, { signal: events.signal });
  document.addEventListener('dotinha:modal', event => { modalOpen = Boolean((event as CustomEvent<{ open: boolean }>).detail.open); syncTakes(swiper); }, { signal: events.signal });
  document.addEventListener('visibilitychange', () => syncTakes(swiper), { signal: events.signal });
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncTakes(swiper); }, { threshold: 0.2 });
  observer.observe(element);
  return () => {
    events.abort();
    observer.disconnect();
    swiper.slides.forEach(stopTake);
    swiper.destroy(true, true);
  };
}

/** Activated by the motion phase, after the complete static page is mounted. */
export function enableHeroAutoplay(root: HTMLElement): () => void {
  const element = root.querySelector<HTMLElement & { swiper?: Swiper }>('.hero-carousel');
  const shell = root.querySelector<HTMLElement>('.hero-carousel-shell');
  const button = shell?.querySelector<HTMLButtonElement>('.hero-autoplay-toggle');
  const ring = shell?.querySelector<SVGCircleElement>('.hero-progress__stroke');
  const icon = button?.querySelector<HTMLImageElement>('.hero-autoplay-toggle__icon');
  const swiper = element?.swiper;
  if (!element || !shell || !button || !swiper) return () => {};

  const events = new AbortController();
  let disposed = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const previousSpeed = swiper.params.speed;
  const previousAutoplay = swiper.params.autoplay;
  let userPaused = false;
  let hovered = element.matches(':hover');
  let focused = Boolean(element.contains(document.activeElement));
  let visible = shell.getBoundingClientRect().top < innerHeight && shell.getBoundingClientRect().bottom > 0;
  let modalOpen = Boolean(document.querySelector('dialog[open]'));

  swiper.params.speed = 850;
  swiper.params.autoplay = {
    delay: 4000,
    disableOnInteraction: true,
    waitForTransition: true,
    stopOnLastSlide: false,
    pauseOnMouseEnter: false,
  };
  const blocked = () => userPaused || hovered || focused || !visible || modalOpen || document.hidden || reduced.matches;
  const resetProgress = () => {
    if (ring) ring.style.strokeDashoffset = '100';
  };
  const updateControl = () => {
    button.disabled = reduced.matches;
    if (icon) icon.src = `/assets/phosphor-${userPaused || reduced.matches ? 'play' : 'pause'}-duotone.svg`;
    button.setAttribute('aria-label', reduced.matches ? 'Troca automática desativada pela preferência de movimento reduzido' : userPaused ? 'Retomar troca automática de imagens' : 'Pausar troca automática de imagens');
    button.setAttribute('aria-pressed', String(userPaused));
  };
  const sync = () => {
    if (disposed || swiper.destroyed) return;
    if (reduced.matches) {
      if (swiper.autoplay.running) swiper.autoplay.stop();
      swiper.params.speed = 0;
      resetProgress();
    } else {
      swiper.params.speed = 850;
      if (blocked()) {
        if (swiper.autoplay.running && !swiper.autoplay.paused) swiper.autoplay.pause();
      } else if (!swiper.autoplay.running) {
        resetProgress();
        swiper.autoplay.start();
      } else if (swiper.autoplay.paused) {
        swiper.autoplay.resume();
      }
    }
    updateControl();
  };
  const onTimeLeft = (_instance: Swiper, _timeLeft: number, percentage: number) => {
    if (ring) ring.style.strokeDashoffset = String(Math.min(1, Math.max(0, percentage)) * 100);
  };
  const enforcePause = () => {
    if (!disposed && !swiper.destroyed && blocked() && swiper.autoplay.running && !swiper.autoplay.paused) swiper.autoplay.pause();
  };
  const manualInteraction = () => {
    userPaused = true;
    sync();
  };
  swiper.on('autoplayTimeLeft', onTimeLeft);
  swiper.on('autoplayResume', enforcePause);
  swiper.on('sliderFirstMove', manualInteraction);
  button.hidden = false;
  button.addEventListener('click', () => { userPaused = !userPaused; sync(); }, { signal: events.signal });
  element.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; sync(); } }, { signal: events.signal });
  element.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') { hovered = false; sync(); } }, { signal: events.signal });
  shell.addEventListener('focusin', () => { focused = element.contains(document.activeElement); sync(); }, { signal: events.signal });
  shell.addEventListener('focusout', () => { queueMicrotask(() => { focused = element.contains(document.activeElement); sync(); }); }, { signal: events.signal });
  element.addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') manualInteraction(); }, { signal: events.signal });
  document.addEventListener('visibilitychange', sync, { signal: events.signal });
  reduced.addEventListener('change', sync, { signal: events.signal });
  document.addEventListener('dotinha:modal', event => { modalOpen = Boolean((event as CustomEvent<{ open: boolean }>).detail.open); sync(); }, { signal: events.signal });
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: 0 });
  observer.observe(shell);
  sync();
  return () => {
    disposed = true;
    events.abort();
    observer.disconnect();
    swiper.off('autoplayTimeLeft', onTimeLeft);
    swiper.off('autoplayResume', enforcePause);
    swiper.off('sliderFirstMove', manualInteraction);
    if (!swiper.destroyed) {
      swiper.autoplay.stop();
      swiper.params.speed = previousSpeed;
      swiper.params.autoplay = previousAutoplay;
    }
    button.hidden = true;
    resetProgress();
  };
}
