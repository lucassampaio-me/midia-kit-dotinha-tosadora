import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { enableHeroAutoplay } from '../sections/hero';
import { initHeroFur } from './hero-fur';
import { initFooterLogo } from './footer-logo';

/** Prepara as entradas fora da tela antes que a rolagem possa revelá-las. */
export function initAnimations(root: HTMLElement): () => void {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const stopHeroAutoplay = enableHeroAutoplay(root);
  const stopHeroFur = initHeroFur(root);
  const stopFooterLogo = initFooterLogo(root);
  const media = gsap.matchMedia();
  const seen = new WeakSet<HTMLElement>();
  let heroSeen = false;
  const groups = Array.from(root.querySelectorAll<HTMLElement>(
    '.results-header, .results-totals, .results-viral, .results-habitual, .audience-header, .audience-cards, .audience-activity, .content-header, .contact-header, .contact-formats, .contact-box, .contact-footer',
  ));

  media.add('(prefers-reduced-motion: no-preference)', () => {
    const events = new AbortController();
    const activeTweens = new Map<HTMLElement, gsap.core.Tween>();
    const finishFocusedGroup = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      for (const [group, tween] of activeTweens) {
        if (group.contains(event.target)) {
          seen.add(group);
          tween.progress(1).pause();
        }
      }
    };
    root.addEventListener('focusin', finishFocusedGroup, { signal: events.signal });

    const hero = root.querySelector<HTMLElement>('.hero');
    let heroSplit: SplitText | undefined;
    if (hero && !heroSeen && hero.getBoundingClientRect().bottom > 0 && !location.hash && !hero.contains(document.activeElement)) {
      heroSeen = true;
      heroSplit = SplitText.create(hero.querySelector<HTMLElement>('.hero-title')!, { type: 'words,chars', aria: 'auto' });
      const entrance = gsap.timeline({
        defaults: { duration: .65, ease: 'power3.out', clearProps: 'opacity,transform' },
        onComplete: () => heroSplit?.revert(),
      });
      entrance
        .from('.hero-logo', { opacity: 0, y: -12 }, 0)
        .from('.hero-nav', { opacity: 0, y: -12 }, .08)
        .from(heroSplit.chars, { opacity: 0, yPercent: 40, stagger: .035 }, .18)
        .from('.hero-profession', { opacity: 0, y: 20 }, .48)
        .from('.hero-biography', { opacity: 0, y: 18, stagger: .1 }, .58)
        .from('.hero-pillars li', { opacity: 0, y: 16, stagger: .09 }, .78)
        .from('.hero-carousel-shell', { opacity: 0, x: 36, duration: .85 }, .35);
      hero.addEventListener('focusin', () => entrance.progress(1).pause(), { signal: events.signal });
    }

    for (const group of groups) {
      if (seen.has(group) || group.closest('[hidden]')) continue;
      // Conteúdo já visível e destinos de acesso direto não desaparecem.
      if (group.getBoundingClientRect().top < innerHeight) {
        seen.add(group);
        continue;
      }
      const children = Array.from(group.children).filter((child): child is HTMLElement =>
        child instanceof HTMLElement && !child.hidden && getComputedStyle(child).display !== 'none',
      );
      const targets = children.length === 0 ? [group] : children;
      gsap.set(targets, { y: 24, opacity: 0 });
      const tween = gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: .7,
        stagger: .08,
        ease: 'power2.out',
        paused: true,
        clearProps: 'opacity,transform',
        onComplete: () => { activeTweens.delete(group); },
      });
      activeTweens.set(group, tween);
      ScrollTrigger.create({
        trigger: group,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          if (seen.has(group)) return;
          seen.add(group);
          if (group.contains(document.activeElement)) tween.progress(1).pause();
          else tween.play();
        },
      });
    }
    return () => {
      events.abort();
      heroSplit?.revert();
      activeTweens.clear();
    };
  }, root);

  let disposed = false;
  let refreshFrame = 0;
  const layoutEvents = new AbortController();
  const scheduleRefresh = () => {
    if (disposed || refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      if (!disposed) ScrollTrigger.refresh();
    });
  };
  const resize = new ResizeObserver(scheduleRefresh);
  resize.observe(root);
  root.addEventListener('load', scheduleRefresh, { capture: true, signal: layoutEvents.signal });
  void document.fonts.ready.then(scheduleRefresh);
  scheduleRefresh();

  return () => {
    disposed = true;
    cancelAnimationFrame(refreshFrame);
    layoutEvents.abort();
    resize.disconnect();
    media.revert();
    stopHeroAutoplay();
    stopHeroFur();
    stopFooterLogo();
  };
}
