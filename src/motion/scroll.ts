import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

let activeCleanup: (() => void) | null = null;

/** Uma instância e um relógio de scroll para a página inteira. */
export function initScroll(root: HTMLElement): () => void {
  activeCleanup?.();
  gsap.registerPlugin(ScrollTrigger);
  const controller = new AbortController();
  const { signal } = controller;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const temporaryFocusTargets = new Set<HTMLElement>();
  let disposed = false;
  let modalOpen = Boolean(document.querySelector('dialog[open]'));
  let navigation = 0;

  const lenis = new Lenis({
    autoRaf: false,
    smoothWheel: true,
    syncTouch: false,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    lerp: 0.1,
    // Hash e foco são tratados juntos abaixo, sem dois handlers de âncora.
    anchors: false,
    respectReducedMotion: true,
    virtualScroll: ({ deltaX, deltaY, event }) =>
      !event.type.startsWith('touch') && Math.abs(deltaY) >= Math.abs(deltaX),
  });

  const syncTriggers = () => ScrollTrigger.update();
  const unsubscribeScroll = lenis.on('scroll', syncTriggers);
  const tick = (seconds: number) => lenis.raf(seconds * 1000);
  gsap.ticker.lagSmoothing(0);
  gsap.ticker.add(tick);
  if (modalOpen) lenis.stop();

  function targetForHash(hash: string): HTMLElement | null {
    if (!hash || hash === '#') return null;
    let id: string;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return null;
    }
    const target = document.getElementById(id);
    return target && (target === root || root.contains(target)) ? target : null;
  }

  function focusTarget(target: HTMLElement): void {
    if (disposed || !target.isConnected) return;
    const focusable = target.matches('a[href], button, input, select, textarea, [tabindex]');
    if (!focusable) {
      target.setAttribute('tabindex', '-1');
      temporaryFocusTargets.add(target);
      target.addEventListener('blur', () => {
        target.removeAttribute('tabindex');
        temporaryFocusTargets.delete(target);
      }, { once: true, signal });
    }
    target.focus({ preventScroll: true });
  }

  function goTo(target: HTMLElement, immediate: boolean, transferFocus: boolean): void {
    const currentNavigation = ++navigation;
    lenis.resize();
    lenis.scrollTo(target, {
      immediate,
      onComplete: () => {
        if (!disposed && !modalOpen && currentNavigation === navigation && transferFocus) {
          focusTarget(target);
        }
      },
    });
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || modalOpen) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
    const target = targetForHash(url.hash);
    if (!target) return;
    event.preventDefault();
    if (location.hash !== url.hash) history.pushState(history.state, '', url.hash);
    goTo(target, reducedMotion.matches, true);
  }, { signal });

  const syncHash = () => {
    if (disposed || modalOpen) return;
    const target = targetForHash(location.hash);
    if (target) goTo(target, true, true);
  };
  window.addEventListener('hashchange', syncHash, { signal });

  document.addEventListener('dotinha:modal', event => {
    const detail = (event as CustomEvent<{ open: boolean }>).detail;
    modalOpen = Boolean(detail?.open);
    navigation++;
    if (modalOpen) {
      lenis.stop();
    } else {
      // start() sincroniza a posição real, sem retomar a inércia anterior.
      lenis.start();
      lenis.resize();
      syncTriggers();
    }
  }, { signal });

  reducedMotion.addEventListener('change', () => {
    navigation++;
    if (reducedMotion.matches && !modalOpen) {
      lenis.scrollTo(lenis.actualScroll, { immediate: true });
    }
  }, { signal });

  const initialHash = location.hash;
  queueMicrotask(() => {
    if (!disposed && !modalOpen && navigation === 0 && location.hash === initialHash) syncHash();
  });

  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    navigation++;
    controller.abort();
    unsubscribeScroll();
    gsap.ticker.remove(tick);
    lenis.destroy();
    // Este módulo é o único dono dessa configuração global no projeto.
    gsap.ticker.lagSmoothing(500, 33);
    temporaryFocusTargets.forEach(target => target.removeAttribute('tabindex'));
    temporaryFocusTargets.clear();
    if (activeCleanup === cleanup) activeCleanup = null;
  };
  activeCleanup = cleanup;
  return cleanup;
}
