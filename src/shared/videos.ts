import { escapeHtml } from './ui';

/**
 * Reels publicados por @dotinha.tosadora. Os arquivos ficam em public/videos e são
 * gerados por scripts/build-videos.sh a partir dos downloads em videos-instagram/.
 * O take é o trecho curto e mudo que roda no item ativo dos carrosséis.
 */
export type Reel = {
  id: string;
  /** Nome do conteúdo, usado nos cards e no título do modal. */
  title: string;
  /** Descrição do que o vídeo mostra, usada como texto alternativo da capa. */
  label: string;
  /** Data de publicação no Instagram, no horário de Brasília, no formato AAAA-MM-DD. */
  published: string;
  /** Duração do take, em segundos. */
  take: number;
};

export const reels: Record<string, Reel> = {
  DexdqWWPZJa: { id: 'DexdqWWPZJa', title: 'Banho da Kira', label: 'Vitória dá banho na Kira, uma cachorra preta de porte grande', published: '2026-10-21', take: 7 },
  Db9m0XHR9Wg: { id: 'Db9m0XHR9Wg', title: 'Primeiro dia da Pet South America 2026', label: 'Vitória percorre os corredores da feira Pet South America 2026', published: '2026-08-12', take: 6 },
  Dbq80l8vYnE: { id: 'Dbq80l8vYnE', title: 'Abrindo recebidos da Pross', label: 'Vitória abre uma caixa de produtos recebidos da Pross', published: '2026-08-05', take: 4 },
  'DaEf0-5xv9u': { id: 'DaEf0-5xv9u', title: 'Retoque de cor na cauda', label: 'Spitz branco com a cauda colorida de rosa', published: '2026-06-26', take: 6.8 },
  DY0rCRUx7P4: { id: 'DY0rCRUx7P4', title: 'Banho de um goldão', label: 'Vitória dá banho em um golden retriever', published: '2026-05-26', take: 6 },
  DcESkYsxehd: { id: 'DcESkYsxehd', title: 'Estande da Pross na Pet South America', label: 'Produtos de banho e tosa no estande da Pross, na feira Pet South America', published: '2026-08-15', take: 6 },
  DcAWvG0uu_a: { id: 'DcAWvG0uu_a', title: 'Estande da Pet Nutrition', label: 'Vitória segura uma bandana no estande da Pet Nutrition, na feira Pet South America', published: '2026-08-14', take: 6 },
  DbTd0mqRbNr: { id: 'DbTd0mqRbNr', title: 'Yorkshire no primeiro horário', label: 'Yorkshire sonolento em pé na mesa de tosa', published: '2026-07-27', take: 6 },
};

/** Ordem do hero: o primeiro item é o primeiro a aparecer. */
export const heroReels = ['DexdqWWPZJa', 'DaEf0-5xv9u', 'Dbq80l8vYnE', 'DY0rCRUx7P4', 'Db9m0XHR9Wg'].map(id => reels[id]);

/** Ordem da seção de conteúdo, definida por Lucas. */
export const contentReels = ['DexdqWWPZJa', 'DcESkYsxehd', 'DaEf0-5xv9u', 'DcAWvG0uu_a', 'Db9m0XHR9Wg', 'Dbq80l8vYnE', 'DbTd0mqRbNr', 'DY0rCRUx7P4'].map(id => reels[id]);

export const reelPaths = (reel: Reel) => ({
  thumb: `/videos/${reel.id}-thumb.webp`,
  takeWebm: `/videos/${reel.id}-take.webm`,
  takeMp4: `/videos/${reel.id}-take.mp4`,
  full: `/videos/${reel.id}.webm`,
  instagram: `https://www.instagram.com/reel/${reel.id}/`,
});

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Capa e take sobrepostos. O vídeo só recebe as fontes quando o item fica ativo,
 * para que os itens inativos carreguem apenas a imagem.
 */
export function reelMedia(reel: Reel, className: string, imageAttributes = ''): string {
  const paths = reelPaths(reel);
  return `<span class="reel-media ${className}"><img class="reel-media__thumb" src="${paths.thumb}" alt="${escapeHtml(reel.label)}" width="540" height="960" ${imageAttributes} />` +
    `<video class="reel-media__take" muted playsinline loop preload="none" aria-hidden="true" tabindex="-1" data-webm="${paths.takeWebm}" data-mp4="${paths.takeMp4}"></video></span>`;
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

/** Inicia o take do item ativo. Com movimento reduzido, a capa estática permanece. */
export function playTake(container: Element | null | undefined): void {
  const video = container?.querySelector<HTMLVideoElement>('.reel-media__take');
  if (!video || reducedMotion.matches) return;
  if (!video.childElementCount) {
    video.innerHTML = `<source src="${video.dataset.webm}" type="video/webm" /><source src="${video.dataset.mp4}" type="video/mp4" />`;
    video.addEventListener('playing', () => video.closest('.reel-media')?.classList.add('is-playing'));
    video.load();
  }
  video.currentTime = 0;
  video.play().catch(() => {});
}

export function stopTake(container: Element | null | undefined): void {
  const video = container?.querySelector<HTMLVideoElement>('.reel-media__take');
  if (!video) return;
  video.pause();
  video.closest('.reel-media')?.classList.remove('is-playing');
}
