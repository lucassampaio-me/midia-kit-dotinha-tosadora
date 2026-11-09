import './results.css';
import { assets } from '../shared/assets';
import { eyebrow, escapeHtml, mountFloatingTabs, mountTabs, platformTabs, sectionTitle } from '../shared/ui';

type Platform = 'instagram' | 'tiktok';
type Metric = {
  label: string;
  value: string;
  description: string;
  icon: string;
  tone: 'peach' | 'soft';
};
type Phase = { label: string; value: string; description: string };
type Viral = {
  lead: string;
  // Valores diários consultados no painel, em datas pontuais (dia/mês).
  points: Array<{ date: string; value: number }>;
  viralDate: string;
  chartLabel: string;
  phases: Phase[];
  followers: { before: string; after: string; description: string };
  note: string;
};
type Habitual = {
  label: string;
  tag: string;
  value: string;
  description: string;
  note: string;
  icon: string;
  tone: 'pink' | 'brown';
};
type ResultsPlatform = {
  period: string;
  totals: Metric[];
  viral: Viral;
  habitual: Habitual[];
  source: string;
};

// Dados conferidos nos prints de prints-dados-redes/, recebidos em 9/11/2026.
// Instagram: painel profissional, 30 dias. TikTok: Análise, 28 dias.
const resultsData: Record<Platform, ResultsPlatform> = {
  instagram: {
    period: 'Últimos 30 dias: de 10/10 a 8/11/2026.',
    totals: [
      { label: 'Visualizações', value: '9,0 mi', description: 'Exibições de todos os conteúdos no período. Uma mesma pessoa pode ser contada mais de uma vez.', icon: 'imgPhosphorEyeDuotone', tone: 'peach' },
      { label: 'Visualizadores', value: '5,6 mi', description: 'Contas que viram pelo menos um conteúdo do perfil no período.', icon: 'imgPhosphorChartLineUpDuotone', tone: 'soft' },
      { label: 'Seguidores', value: '27,1 mil', description: 'Total ao fim do período, com 22,2 mil seguidores líquidos conquistados nesses 30 dias.', icon: 'imgPhosphorUsersDuotone', tone: 'peach' },
      { label: 'Visitas ao perfil', value: '80 mil', description: 'Visitas de quem quis conhecer mais do trabalho depois de ver um conteúdo.', icon: 'imgPhosphorUsersDuotone', tone: 'soft' },
    ],
    viral: {
      lead: 'Em 21/10, o Reels do banho da Kira viralizou. O pico passou, mas o alcance diário do perfil ficou em outro patamar.',
      points: [
        { date: '10/10', value: 992 }, { date: '15/10', value: 2939 }, { date: '18/10', value: 3804 },
        { date: '22/10', value: 3_700_000 }, { date: '25/10', value: 523_000 }, { date: '28/10', value: 158_000 },
        { date: '31/10', value: 203_000 }, { date: '03/11', value: 95_000 }, { date: '06/11', value: 120_000 },
        { date: '08/11', value: 119_000 },
      ],
      viralDate: '21/10',
      chartLabel: 'Gráfico das visualizações diárias no Instagram entre 10/10 e 8/11. A linha fica perto de zero até 18/10, sobe para 3,7 milhões em 22/10 e depois se estabiliza entre 95 mil e 203 mil por dia.',
      phases: [
        { label: 'Antes', value: '992 a 3,8 mil', description: 'visualizações por dia, de 10/10 a 18/10' },
        { label: 'Pico', value: '3,7 mi', description: 'visualizações em 22/10' },
        { label: 'Depois', value: '95 mil a 203 mil', description: 'visualizações por dia, de 28/10 a 8/11' },
      ],
      followers: { before: '5,0 mil', after: '27,1 mil', description: 'seguidores no início e no fim do período' },
      note: 'O Reels soma 8,3 mi de visualizações até 9/11. Um resultado assim não é a expectativa de entrega de uma campanha: para isso, veja o desempenho habitual abaixo.',
    },
    habitual: [
      { label: 'REELS', tag: 'DESEMPENHO HABITUAL', value: '46 mil visualizações', description: 'Mediana de 14 Reels publicados entre 26/05 e 26/09, antes do viral. Resultados acumulados até 9/11/2026.', note: 'Dois desses Reels já tinham passado de 500 mil visualizações: 856 mil (26/05) e 550 mil (27/07).', icon: 'imgPhosphorVideoCameraDuotone', tone: 'pink' },
      { label: 'STORIES', tag: 'DESEMPENHO HABITUAL', value: '1,5 mil por tela', description: 'Mediana de 39 telas publicadas entre 22/10 e 7/11, medidas depois de completar 24 horas.', note: 'A amostra considera stories publicados com a base atual de seguidores, depois do viral.', icon: 'imgPhosphorStackDuotone', tone: 'brown' },
    ],
    source: 'Fonte: painel profissional do Instagram, consultado em 9/11/2026. Nenhum conteúdo foi impulsionado. Resultados anteriores não garantem o desempenho de futuras publicações.',
  },
  tiktok: {
    period: 'Últimos 28 dias: de 11/10 a 7/11/2026.',
    totals: [
      { label: 'Visualizações', value: '1,8 mi', description: 'Visualizações das publicações no período. Uma mesma pessoa pode ser contada mais de uma vez.', icon: 'imgPhosphorEyeDuotone', tone: 'peach' },
      { label: 'Curtidas', value: '248,1 mil', description: 'Curtidas recebidas pelos vídeos ao longo dos 28 dias.', icon: 'imgPhosphorChartLineUpDuotone', tone: 'soft' },
      { label: 'Compartilhamentos', value: '4 mil', description: 'Vezes em que alguém enviou um vídeo do perfil para outra pessoa.', icon: 'imgPhosphorStackDuotone', tone: 'peach' },
      { label: 'Seguidores', value: '7.489', description: 'Total ao fim do período, com 6,4 mil seguidores líquidos conquistados nesses 28 dias.', icon: 'imgPhosphorUsersDuotone', tone: 'soft' },
    ],
    viral: {
      lead: 'O mesmo vídeo do banho da Kira também viralizou no TikTok. Depois do pico, as visualizações diárias seguiram muito acima do que eram antes.',
      points: [
        { date: '12/10', value: 140 }, { date: '16/10', value: 89 }, { date: '21/10', value: 448 },
        { date: '22/10', value: 491_900 }, { date: '24/10', value: 167_800 }, { date: '27/10', value: 63_400 },
        { date: '29/10', value: 53_700 }, { date: '31/10', value: 70_200 }, { date: '03/11', value: 35_100 },
        { date: '06/11', value: 41_200 },
      ],
      viralDate: '21/10',
      chartLabel: 'Gráfico das visualizações diárias no TikTok entre 11/10 e 7/11. A linha fica perto de zero até 21/10, sobe para 491,9 mil em 22/10 e depois se estabiliza entre 35 mil e 70 mil por dia.',
      phases: [
        { label: 'Antes', value: '89 a 448', description: 'visualizações por dia, de 12/10 a 21/10' },
        { label: 'Pico', value: '491,9 mil', description: 'visualizações em 22/10' },
        { label: 'Depois', value: '35 mil a 70 mil', description: 'visualizações por dia, de 27/10 a 6/11' },
      ],
      followers: { before: '1,1 mil', after: '7.489', description: 'seguidores no início e no fim do período' },
      note: 'O vídeo teve 1,3 mi de visualizações nesses 28 dias. Um resultado assim não é a expectativa de entrega de uma campanha.',
    },
    habitual: [
      { label: 'PARA VOCÊ', tag: 'ORIGEM', value: '92,3% do tráfego', description: 'A maior parte das visualizações veio da página Para você, que mostra os vídeos para quem ainda não segue o perfil.', note: 'Outros 7,3% vieram de quem abriu o próprio perfil.', icon: 'imgPhosphorChartLineUpDuotone', tone: 'pink' },
      { label: 'VÍDEOS ANTIGOS', tag: 'NOVO ALCANCE', value: '4,9 mil a 15 mil', description: 'Visualizações de cada um de oito vídeos publicados entre 3/07 e 27/09, somadas apenas nesses 28 dias.', note: 'Quem chegou pelo viral também assistiu a conteúdos antigos do perfil.', icon: 'imgPhosphorVideoCameraDuotone', tone: 'brown' },
    ],
    source: 'Fonte: Análise do TikTok, consultada em 9/11/2026. Nenhum conteúdo foi impulsionado. Resultados anteriores não garantem o desempenho de futuras publicações.',
  },
};

// O grupo results-desktop tem a pilha em creme; nos cards claros, usamos a versão marrom do hero.
const darkIcons: Record<string, string> = { imgPhosphorStackDuotone: 'hero-desktop' };

function pill(label: string, icon?: string): string {
  return '<span class="results-pill">' +
    (icon ? '<img src="' + assets(darkIcons[icon] ?? 'results-desktop', icon) + '" alt="" width="22" height="22" />' : '') +
    '<span>' + escapeHtml(label) + '</span></span>';
}

function dayIndex(date: string): number {
  const [day, month] = date.split('/').map(Number);
  return new Date(2026, month - 1, day).getTime() / 86_400_000;
}

/** Desenha a linha com os valores diários consultados, em escala linear. */
function renderChart(viral: Viral): string {
  const width = 600;
  const height = 220;
  const top = 12;
  const start = dayIndex(viral.points[0].date);
  const span = dayIndex(viral.points[viral.points.length - 1].date) - start;
  const max = Math.max(...viral.points.map(point => point.value));
  const x = (date: string) => ((dayIndex(date) - start) / span) * width;
  const y = (value: number) => top + (1 - value / max) * (height - top);
  const coords = viral.points.map(point => x(point.date).toFixed(1) + ' ' + y(point.value).toFixed(1));
  const line = 'M' + coords.join(' L');
  const area = line + ' L' + width + ' ' + height + ' L0 ' + height + ' Z';
  const marker = x(viral.viralDate).toFixed(1);
  const first = viral.points[0].date;
  const last = viral.points[viral.points.length - 1].date;
  return '<figure class="results-chart">' +
    '<div class="results-chart-plot"><svg viewBox="0 0 ' + width + ' ' + height + '" preserveAspectRatio="none" role="img" aria-label="' + escapeHtml(viral.chartLabel) + '">' +
    '<path class="results-chart-area" d="' + area + '" />' +
    '<line class="results-chart-marker" x1="' + marker + '" x2="' + marker + '" y1="0" y2="' + height + '" />' +
    '<path class="results-chart-line" d="' + line + '" />' +
    '</svg>' +
    '<span class="results-chart-dots" aria-hidden="true">' + viral.points.map(point =>
      '<span style="left:' + (x(point.date) / width * 100).toFixed(2) + '%;top:' + (y(point.value) / height * 100).toFixed(2) + '%"></span>',
    ).join('') + '</span></div>' +
    '<figcaption class="results-chart-axis"><span>' + escapeHtml(first) + '</span><span>Viral em ' + escapeHtml(viral.viralDate) + '</span><span>' + escapeHtml(last) + '</span></figcaption>' +
    '<p class="results-chart-legend">Cada ponto é o total de um dia, conferido no painel. Entre os pontos, a linha só liga os valores.</p>' +
    '</figure>';
}

function renderViral(viral: Viral): string {
  return '<article class="results-viral">' +
    '<div class="results-viral-intro">' +
    '<h3 class="results-card-label">' + pill('ANTES E DEPOIS DO VIRAL', 'imgPhosphorChartLineUpDuotone') + '</h3>' +
    '<p class="results-viral-lead">' + escapeHtml(viral.lead) + '</p></div>' +
    '<div class="results-viral-body">' + renderChart(viral) +
    '<dl class="results-phases">' + viral.phases.map(phase =>
      '<div class="results-phase"><dt>' + escapeHtml(phase.label) + '</dt>' +
      '<dd><strong>' + escapeHtml(phase.value) + '</strong><span>' + escapeHtml(phase.description) + '</span></dd></div>',
    ).join('') +
    '<div class="results-phase results-phase--followers"><dt>Seguidores</dt>' +
    '<dd><strong>' + escapeHtml(viral.followers.before) + ' <span aria-hidden="true">→</span><span class="sr-only"> para </span> ' +
    escapeHtml(viral.followers.after) + '</strong><span>' + escapeHtml(viral.followers.description) + '</span></dd></div>' +
    '</dl></div>' +
    '<p class="results-method-note">' + escapeHtml(viral.note) + '</p></article>';
}

function renderPlatform(platform: Platform): string {
  const data = resultsData[platform];
  return '<div class="results-panel" id="results-panel-' + platform + '" data-platform-panel="' + platform +
    '" role="tabpanel" aria-labelledby="results-tab-' + platform + '" tabindex="0"' + (platform === 'tiktok' ? ' hidden' : '') + '>' +
    '<p class="results-period">' + escapeHtml(data.period) + '</p>' +
    '<div class="results-totals">' + data.totals.map(metric =>
      '<article class="results-card results-card--' + metric.tone + '">' +
      '<h3 class="results-card-label">' + pill(metric.label, metric.icon) + '</h3>' +
      '<p class="results-total">' + escapeHtml(metric.value) + '</p>' +
      '<p class="results-total-description">' + escapeHtml(metric.description) + '</p></article>',
    ).join('') + '</div>' +
    renderViral(data.viral) +
    '<div class="results-habitual">' + data.habitual.map(metric =>
      '<article class="results-card results-card--habitual results-card--' + metric.tone + '">' +
      '<div class="results-card-tags"><h3 class="results-card-label">' + pill(metric.label, metric.icon) + '</h3>' +
      pill(metric.tag) + '</div>' +
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
    '<p class="results-lead">Números dos painéis do Instagram e do TikTok. Cada plataforma mede um período próprio, indicado no topo de cada aba.</p></div>' +
    platformTabs('results') + '</header>' +
    renderPlatform('instagram') + renderPlatform('tiktok') + '</div></section>';
}

export function init(root: HTMLElement): () => void {
  const section = root.matches('#resultados') ? root : root.querySelector<HTMLElement>('#resultados');
  if (!section) return () => {};
  const stopTabs = mountTabs(section);
  const stopFloating = mountFloatingTabs(section);
  return () => { stopFloating(); stopTabs(); };
}
