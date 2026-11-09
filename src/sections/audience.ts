import './audience.css';
import { assets } from '../shared/assets';
import { eyebrow, escapeHtml, mountFloatingTabs, mountTabs, platformTabs, sectionTitle } from '../shared/ui';

type Platform = 'instagram' | 'tiktok';
type Bar = { label: string; value: number };
type AudienceCard = {
  label: string;
  icon: string;
  value: string;
  description: string;
  listLabel: string;
  bars: Bar[];
  note?: string;
  location?: boolean;
  // Casas decimais exibidas, iguais às do painel de origem.
  digits?: number;
};
type AudienceData = {
  base: string;
  cards: AudienceCard[];
  activity: { title: string; slots: string[] };
  source: string;
};

// Dados conferidos nos prints de prints-dados-redes/, recebidos em 9/11/2026.
// Instagram descreve seguidores; TikTok descreve espectadores dos vídeos no período.
const audienceData: Record<Platform, AudienceData> = {
  instagram: {
    base: 'Base: seguidores do perfil no Instagram, em 9/11/2026.',
    cards: [
      {
        label: 'GÊNERO', icon: 'imgPhosphorGenderIntersexDuotone', value: '60,3%', description: 'dos seguidores são mulheres.',
        listLabel: 'Distribuição por gênero',
        bars: [{ label: 'Mulheres', value: 60.3 }, { label: 'Homens', value: 39.7 }],
      },
      {
        label: 'FAIXA ETÁRIA', icon: 'imgPhosphorCalendarDotsDuotone', value: '42,0%', description: 'têm de 25 a 34 anos, a faixa com mais seguidores.',
        listLabel: 'Distribuição por faixa etária',
        bars: [
          { label: '13 a 17', value: 6.4 }, { label: '18 a 24', value: 21.7 }, { label: '25 a 34', value: 42.0 },
          { label: '35 a 44', value: 18.4 }, { label: '45 a 54', value: 7.8 }, { label: '55 a 64', value: 2.8 },
          { label: '65 ou mais', value: 1.0 },
        ],
      },
      {
        label: 'LOCALIZAÇÃO', icon: 'imgPhosphorMapPinDuotone', value: '97,0%', description: 'dos seguidores estão no Brasil.',
        listLabel: 'Principais cidades', location: true,
        bars: [
          { label: 'São Paulo', value: 11.5 }, { label: 'Rio de Janeiro', value: 3.8 }, { label: 'Curitiba', value: 1.6 },
          { label: 'Belo Horizonte', value: 1.2 }, { label: 'Porto Alegre', value: 1.1 },
        ],
        note: '99,1% usam o Instagram em português.',
      },
    ],
    activity: {
      title: 'Quando os seguidores estão mais ativos',
      slots: ['Sextas, das 18h às 21h', 'Sábados, das 12h às 15h', 'Sábados, das 18h às 21h'],
    },
    source: 'Fonte: painel profissional do Instagram, aba Público, consultada em 9/11/2026.',
  },
  tiktok: {
    base: 'Base: espectadores dos vídeos de 11/10 a 7/11/2026, incluindo quem não segue o perfil.',
    cards: [
      {
        label: 'GÊNERO', icon: 'imgPhosphorGenderIntersexDuotone', value: '61%', description: 'dos espectadores se identificam com o gênero feminino.',
        listLabel: 'Distribuição por gênero', digits: 0,
        bars: [{ label: 'Feminino', value: 61 }, { label: 'Masculino', value: 38 }, { label: 'Outro', value: 1 }],
      },
      {
        label: 'FAIXA ETÁRIA', icon: 'imgPhosphorCalendarDotsDuotone', value: '80,4%', description: 'têm de 18 a 34 anos.',
        listLabel: 'Distribuição por faixa etária',
        bars: [
          { label: '18 a 24', value: 43.9 }, { label: '25 a 34', value: 36.5 }, { label: '35 a 44', value: 12.2 },
          { label: '45 a 54', value: 6.1 }, { label: '55 ou mais', value: 1.3 },
        ],
      },
      {
        label: 'LOCALIZAÇÃO', icon: 'imgPhosphorMapPinDuotone', value: '94,2%', description: 'dos espectadores estão no Brasil.',
        listLabel: 'Principais países', location: true,
        bars: [
          { label: 'Brasil', value: 94.2 }, { label: 'Portugal', value: 5.0 }, { label: 'México', value: 0.3 },
          { label: 'Paraguai', value: 0.2 }, { label: 'Angola', value: 0.2 },
        ],
        note: 'O TikTok informa a localização por país, sem detalhar cidades.',
      },
    ],
    activity: {
      title: 'Quando os espectadores estão mais ativos',
      slots: ['Sábados, das 13h às 14h (últimos 7 dias, até 7/11)'],
    },
    source: 'Fonte: Análise do TikTok, aba Espectadores, consultada em 9/11/2026.',
  },
};

const formatPercent = (value: number, digits = 1) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });

function renderCard(card: AudienceCard, index: number, platform: Platform): string {
  const labelId = `audience-${platform}-card-${index}`;
  return `<article class="audience-card${card.location ? ' audience-card--location' : ''}" aria-labelledby="${labelId}">
    <h3 class="audience-pill" id="${labelId}"><img src="${assets('audience-desktop', card.icon)}" alt="" width="22" height="22" /><span>${escapeHtml(card.label)}</span></h3>
    <p class="audience-value">${escapeHtml(card.value)}</p>
    <p class="audience-description">${escapeHtml(card.description)}</p>
    <p class="audience-list-label">${escapeHtml(card.listLabel)}</p>
    <ul class="audience-bars" aria-label="${escapeHtml(card.listLabel)}">
      ${card.bars.map(bar => `<li class="audience-bar">
        <span class="audience-bar-label">${escapeHtml(bar.label)}</span>
        <span class="audience-bar-value">${formatPercent(bar.value, card.digits)}%</span>
        <span class="audience-bar-track" aria-hidden="true"><span style="width:${Math.max(bar.value, 0.6)}%"></span></span>
      </li>`).join('')}
    </ul>
    ${card.note ? `<p class="audience-note">${escapeHtml(card.note)}</p>` : ''}
  </article>`;
}

function renderPanel(platform: Platform): string {
  const data = audienceData[platform];
  return `<div class="audience-panel" id="audience-panel-${platform}" data-platform-panel="${platform}" role="tabpanel" aria-labelledby="audience-tab-${platform}"${platform === 'tiktok' ? ' hidden' : ''}>
    <p class="audience-base">${escapeHtml(data.base)}</p>
    <div class="audience-cards">${data.cards.map((card, i) => renderCard(card, i, platform)).join('')}</div>
    <div class="audience-activity">
      <h3 class="audience-activity-title">${escapeHtml(data.activity.title)}</h3>
      <ul class="audience-activity-slots">${data.activity.slots.map(slot => `<li>${escapeHtml(slot)}</li>`).join('')}</ul>
    </div>
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
  if (!section) return () => {};
  const stopTabs = mountTabs(section);
  const stopFloating = mountFloatingTabs(section);
  return () => { stopFloating(); stopTabs(); };
}
