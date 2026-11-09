import './results.css';
import { assets } from '../shared/assets';
import { eyebrow, escapeHtml, mountTabs, platformTabs, sectionTitle } from '../shared/ui';

type Metric = {
  label: string;
  value: string;
  description: string;
  icon: string;
  tone: 'peach' | 'soft';
};
type Habitual = {
  label: string;
  value: string;
  description: string;
  note: string;
  icon: string;
  tone: 'pink' | 'brown';
};
type ResultsPlatform = {
  totals: Metric[];
  habitual: Habitual[];
  source: string;
};

// Keep each platform's data independent. Bracketed values have not been validated.
const resultsData: Record<'instagram' | 'tiktok', ResultsPlatform> = {
  instagram: {
    totals: [
      { label: 'Seguidores', value: '[00 mil]', description: 'Total na data da consulta.', icon: 'imgPhosphorUsersDuotone', tone: 'peach' },
      { label: 'Visualizações', value: '[00 mil]', description: 'Exibições durante o período.', icon: 'imgPhosphorEyeDuotone', tone: 'soft' },
      { label: '[Indicador de alcance]', value: '[00 mil]', description: '[Nome e definição do Insights].', icon: 'imgPhosphorChartLineUpDuotone', tone: 'peach' },
    ],
    habitual: [
      { label: 'REELS', value: '[00 mil] visualizações', description: 'Mediana de [N] Reels publicados entre [data] e [data]. Resultados consultados em [data].', note: '[Informar se houve impulsionamento na amostra.]', icon: 'imgPhosphorVideoCameraDuotone', tone: 'pink' },
      { label: 'STORIES', value: '[00 mil] por tela', description: 'Mediana de [N] telas publicadas entre [data] e [data], medidas após completar 24 horas.', note: '[Informar se houve impulsionamento na amostra.]', icon: 'imgPhosphorStackDuotone', tone: 'brown' },
    ],
    source: 'Fonte: Instagram Insights · Resultados anteriores não garantem o desempenho de futuras publicações.',
  },
  tiktok: {
    totals: [
      { label: 'Seguidores', value: '[Pendente]', description: 'Total na data da consulta.', icon: 'imgPhosphorUsersDuotone', tone: 'peach' },
      { label: 'Visualizações', value: '[Pendente]', description: 'Exibições durante o período.', icon: 'imgPhosphorEyeDuotone', tone: 'soft' },
      { label: '[Indicador TikTok]', value: '[Pendente]', description: '[Nome e definição no TikTok].', icon: 'imgPhosphorChartLineUpDuotone', tone: 'peach' },
    ],
    habitual: [
      { label: 'VÍDEOS', value: '[Dados pendentes]', description: '[Amostra, período e método de medição do TikTok a conferir.]', note: '[Informar eventual impulsionamento.]', icon: 'imgPhosphorVideoCameraDuotone', tone: 'pink' },
      { label: 'FORMATOS', value: '[Dados pendentes]', description: '[Amostra, período e método de medição do TikTok a conferir.]', note: '[Informar eventual impulsionamento.]', icon: 'imgPhosphorStackDuotone', tone: 'brown' },
    ],
    source: 'Fonte: TikTok Analytics · Dados pendentes de conferência · Consulta em [dd/mm/aaaa]',
  },
};

function pill(label: string, icon?: string): string {
  return '<span class="results-pill">' +
    (icon ? '<img src="' + assets('results-desktop', icon) + '" alt="" width="22" height="22" />' : '') +
    '<span>' + escapeHtml(label) + '</span></span>';
}

function renderPlatform(platform: 'instagram' | 'tiktok'): string {
  const data = resultsData[platform];
  return '<div class="results-panel" id="results-panel-' + platform + '" data-platform-panel="' + platform +
    '" role="tabpanel" aria-labelledby="results-tab-' + platform + '" tabindex="0"' + (platform === 'tiktok' ? ' hidden' : '') + '>' +
    '<div class="results-totals">' + data.totals.map(metric =>
      '<article class="results-card results-card--' + metric.tone + '">' +
      '<h3 class="results-card-label">' + pill(metric.label, metric.icon) + '</h3>' +
      '<p class="results-total">' + escapeHtml(metric.value) + '</p>' +
      '<p class="results-total-description">' + escapeHtml(metric.description) + '</p></article>',
    ).join('') + '</div>' +
    '<div class="results-habitual">' + data.habitual.map(metric =>
      '<article class="results-card results-card--habitual results-card--' + metric.tone + '">' +
      '<div class="results-card-tags"><h3 class="results-card-label">' + pill(metric.label, metric.icon) + '</h3>' +
      pill('DESEMPENHO HABITUAL') + '</div>' +
      '<p class="results-habitual-value">' + escapeHtml(metric.value) + '</p>' +
      '<p class="results-habitual-description">' + escapeHtml(metric.description) + '</p>' +
      '<p class="results-method-note">' + escapeHtml(metric.note) + '</p></article>',
    ).join('') + '</div>' +
    '<p class="results-source">' + escapeHtml(data.source) + '</p></div>';
}

export function render(): string {
  const title = sectionTitle('Conteúdo que encontra pessoas', 'results-title', 'results-heading');
  return '<section class="results" id="resultados" aria-labelledby="results-heading"><div class="results-inner container">' +
    '<header class="results-header"><div class="results-intro">' + eyebrow('RESULTADOS') +
    title +
    '<p class="results-period">Período: [dd/mm/aaaa] a [dd/mm/aaaa] · Últimos 30 dias.</p></div>' +
    platformTabs('results') + '</header>' +
    renderPlatform('instagram') + renderPlatform('tiktok') + '</div></section>';
}

export function init(root: HTMLElement): () => void {
  const section = root.matches('#resultados') ? root : root.querySelector<HTMLElement>('#resultados');
  return section ? mountTabs(section) : () => {};
}

