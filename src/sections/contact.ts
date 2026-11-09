import './contact.css';
import { assets } from '../shared/assets';
import { eyebrow, escapeHtml, sectionTitle } from '../shared/ui';

const formats = [
  { title: 'Reels', description: 'Vídeos com roteiro, gravação e edição para integrar a marca ao conteúdo.' },
  { title: 'Stories', description: 'Sequências para apresentar o produto, demonstrar seu uso e convidar à ação.' },
  { title: 'Eventos e experiências', description: 'Coberturas que aproximam o público das experiências com a marca.' },
  { title: 'TikTok', description: 'Publicação ou adaptação de vídeos, conforme as entregas da campanha.' },
];

const channels = [
  { name: 'WhatsApp', address: '(11) 98032-8462', href: 'https://wa.me/5511980328462', icon: 'imgIconeOriginalWhatsApp', primary: true },
  { name: 'Instagram', address: '@dotinha.tosadora', href: 'https://www.instagram.com/dotinha.tosadora/', icon: 'imgIconeOriginalInstagram', primary: false },
  { name: 'TikTok', address: '@dotinha.tosadora', href: 'https://www.tiktok.com/@dotinha.tosadora', icon: 'imgIconeOriginalTikTok', primary: false },
];

function renderChannels(): string {
  return channels.map(channel => `<a class="contact-channel${channel.primary ? ' contact-channel--primary' : ''}" href="${channel.href}" target="_blank" rel="noopener noreferrer">
    <picture class="contact-channel-icon"><source media="(max-width: 799px)" srcset="${assets('contact-mobile', channel.icon)}" /><img src="${assets('contact-desktop', channel.icon)}" alt="" width="32" height="32" /></picture>
    <span class="contact-channel-copy"><span class="contact-channel-name">${escapeHtml(channel.name)}</span><span class="contact-channel-address">${escapeHtml(channel.address)}</span></span>
    <span class="sr-only"> (abre em nova aba)</span>
  </a>`).join('');
}

function renderBrand(): string {
  // Cada peça é o vetor original da marca, na composição fornecida pelo Figma.
  const vectors = ['imgVector', 'imgVector1', 'imgVector2', 'imgVector3', 'imgVector4', 'imgVector5', 'imgVector6', 'imgVector7'];
  return `<footer class="contact-footer">
    <div class="contact-brand contact-brand--desktop" role="img" aria-label="Dotinha">${vectors.map((vector, i) => `<span class="contact-brand-piece contact-brand-piece--${i}"><img src="${assets('contact-desktop', vector)}" alt="" loading="lazy" /></span>`).join('')}</div>
    <div class="contact-brand contact-brand--mobile" role="img" aria-label="Dotinha"><img src="${assets('contact-mobile', 'imgGroup3')}" alt="" loading="lazy" /></div>
  </footer>`;
}

export function render(): string {
  const title = sectionTitle('Vamos criar juntos?', 'contact-title');
  return `<section class="contact" id="parcerias" aria-label="Parcerias e contato">
    <div class="contact-shell">
      <div class="contact-body">
        <header class="contact-header">${eyebrow('PARCERIAS', true)}${title}</header>
        <div class="contact-formats" aria-label="Possibilidades de parceria">
          ${formats.map(format => `<article class="contact-format"><h3>${escapeHtml(format.title)}</h3><p>${escapeHtml(format.description)}</p></article>`).join('')}
        </div>
        <div class="contact-commercial">
          <div class="contact-mascot" aria-hidden="true"><picture><source media="(max-width: 799px)" srcset="${assets('contact-mobile', 'imgGroup1')}" /><img src="${assets('contact-desktop', 'imgGroup')}" alt="" loading="lazy" /></picture></div>
          <div class="contact-box">
            <h3 class="contact-box-title">Conte sua ideia</h3>
            <p class="contact-brief">Compartilhe o objetivo da campanha, as entregas desejadas e o prazo para receber uma proposta.</p>
            <div class="contact-channels" aria-label="Canais de contato">${renderChannels()}</div>
            <p class="contact-conditions">Escopo, valores, prazos e direitos de uso no orçamento separado.</p>
          </div>
        </div>
        ${renderBrand()}
      </div>
    </div>
  </section>`;
}

export function init(_root: HTMLElement): () => void {
  return () => {};
}
