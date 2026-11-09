import './audience.css';
import { assets } from '../shared/assets';
import { eyebrow, escapeHtml, mountTabs, platformTabs, sectionTitle } from '../shared/ui';

type Platform = 'instagram' | 'tiktok';
type AudienceCard = {
  label: string;
  icon: string;
  value: string;
  description: string;
  column: string;
  rows: Array<{ label: string; value: string }>;
  location?: boolean;
};
type AudienceData = { cards: AudienceCard[]; source: string };

// Os dois painéis mantêm suas próprias fontes e campos pendentes.
// Substitua apenas os dados da plataforma correspondente após a conferência.
const audienceData: Record<Platform, AudienceData> = {
  instagram: {
    cards: [
      { label: 'GÊNERO', icon: 'imgPhosphorGenderIntersexDuotone', value: '[00%]', description: '[Grupo predominante]', column: 'Grupo', rows: [{ label: '[Grupo 1]', value: '[00%]' }, { label: '[Grupo 2]', value: '[00%]' }] },
      { label: 'FAIXA ETÁRIA', icon: 'imgPhosphorCalendarDotsDuotone', value: '[00 a 00]', description: 'anos · [00%] da audiência', column: 'Faixa etária', rows: [{ label: '[Faixa 1]', value: '[00%]' }, { label: '[Faixa 2]', value: '[00%]' }, { label: '[Faixa 3]', value: '[00%]' }] },
      { label: 'LOCALIZAÇÃO', icon: 'imgPhosphorMapPinDuotone', value: '[00%]', description: 'do público está no Brasil', column: 'Localização', location: true, rows: [{ label: '[Cidade / UF]', value: '[00%]' }, { label: '[Cidade / UF]', value: '[00%]' }, { label: '[Cidade / UF]', value: '[00%]' }] },
    ],
    source: 'Fonte: Instagram Insights · Público: [seguidores / contas alcançadas] · Consulta em [dd/mm/aaaa]',
  },
  tiktok: {
    cards: [
      { label: 'GÊNERO', icon: 'imgPhosphorGenderIntersexDuotone', value: '[00%]', description: '[Grupo predominante]', column: 'Grupo', rows: [{ label: '[Grupo 1]', value: '[00%]' }, { label: '[Grupo 2]', value: '[00%]' }] },
      { label: 'FAIXA ETÁRIA', icon: 'imgPhosphorCalendarDotsDuotone', value: '[00 a 00]', description: 'anos · [00%] da audiência', column: 'Faixa etária', rows: [{ label: '[Faixa 1]', value: '[00%]' }, { label: '[Faixa 2]', value: '[00%]' }, { label: '[Faixa 3]', value: '[00%]' }] },
      { label: 'LOCALIZAÇÃO', icon: 'imgPhosphorMapPinDuotone', value: '[00%]', description: 'do público está no Brasil', column: 'Localização', location: true, rows: [{ label: '[Cidade / UF]', value: '[00%]' }, { label: '[Cidade / UF]', value: '[00%]' }, { label: '[Cidade / UF]', value: '[00%]' }] },
    ],
    source: 'Fonte: TikTok Analytics · Público: [base da audiência] · Consulta em [dd/mm/aaaa]',
  },
};

function renderCard(card: AudienceCard, index: number, platform: Platform): string {
  const labelId = `audience-${platform}-card-${index}`;
  return `<article class="audience-card${card.location ? ' audience-card--location' : ''}" aria-labelledby="${labelId}">
    <h3 class="audience-pill" id="${labelId}"><img src="${assets('audience-desktop', card.icon)}" alt="" width="22" height="22" /><span>${escapeHtml(card.label)}</span></h3>
    <p class="audience-value">${escapeHtml(card.value)}</p>
    <p class="audience-description">${escapeHtml(card.description)}</p>
    <table class="audience-table" aria-label="Distribuição por ${escapeHtml(card.column.toLocaleLowerCase('pt-BR'))}">
      <thead><tr><th scope="col">${escapeHtml(card.column)}</th><th scope="col">Audiência</th></tr></thead>
      <tbody>${card.rows.map(row => `<tr><th scope="row">${escapeHtml(row.label)}</th><td>${escapeHtml(row.value)}</td></tr>`).join('')}</tbody>
    </table>
  </article>`;
}

function renderPanel(platform: Platform): string {
  const data = audienceData[platform];
  return `<div class="audience-panel" id="audience-panel-${platform}" data-platform-panel="${platform}" role="tabpanel" aria-labelledby="audience-tab-${platform}"${platform === 'tiktok' ? ' hidden' : ''}>
    <div class="audience-cards">${data.cards.map((card, i) => renderCard(card, i, platform)).join('')}</div>
    <p class="audience-source">${escapeHtml(data.source)}</p>
  </div>`;
}

export function render(): string {
  const title = sectionTitle('Quem me acompanha', 'audience-title');
  const tabs = platformTabs('audience', true).replace(
    `<img src="${assets('results-desktop', 'imgPhosphorTiktokLogoDuotone')}" alt="" />`,
    `<img class="audience-tab-icon--dark" src="${assets('results-desktop', 'imgPhosphorTiktokLogoDuotone')}" alt="" /><img class="audience-tab-icon--light" src="${assets('audience-desktop', 'imgPhosphorTiktokLogoDuotone')}" alt="" />`,
  );
  return `<section class="audience" id="publico" aria-label="Público">
    <div class="container audience-container">
      <header class="audience-header">
        <div class="audience-intro">
          ${eyebrow('PÚBLICO', true)}
          ${title}
          <p class="audience-lead">Um retrato da audiência para encontrar marcas com interesses em comum.</p>
        </div>
        ${tabs}
      </header>
      ${renderPanel('instagram')}
      ${renderPanel('tiktok')}
    </div>
  </section>`;
}

export function init(root: HTMLElement): () => void {
  const section = root.matches('#publico') ? root : root.querySelector<HTMLElement>('#publico');
  return section ? mountTabs(section) : () => {};
}
