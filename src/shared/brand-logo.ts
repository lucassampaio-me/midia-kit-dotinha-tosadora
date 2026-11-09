import './brand-logo.css';
import { assets } from './assets';
import { escapeHtml } from './ui';

// Logo do header da home: mascote recortado e peças vetoriais originais do Figma.
const asset = (name: string) => assets('hero-desktop', name);
const insets = [
  '34.05% 46.48% 59.38% 42.71%', '30.45% 52.69% 67.77% 44.17%',
  '29.78% 50.42% 64.68% 43.49%', '30.69% 53.01% 68.19% 44.64%',
  '94.1% 25.55% .27% 70.96%', '94.1% 32.15% .27% 65.15%',
  '94.01% 38.2% .18% 57.82%', '94.1% 45.38% .27% 51.31%',
  '94.1% 51.95% .27% 44.57%', '94.01% 58.52% .18% 38.67%',
  '94.01% 64.51% .18% 31.51%', '94.1% 71.37% .27% 25.73%',
  '60.63% 17.18% 12.51% 69.28%', '65.75% 0 10.09% 84.84%',
  '64.17% 33.14% 12.51% 53.37%', '60.03% 55.56% 12.03% 33.16%',
  '67.94% 49.04% 12.52% 45.26%', '59.23% 48.62% 32.98% 45.64%',
  '60.11% 84.16% 12.52% 0', '65.73% 67.06% 10.73% 17.66%',
];

export function brandLogo(className: string, href: string, label: string): string {
  return `<a class="brand-logo ${escapeHtml(className)}" href="${escapeHtml(href)}" aria-label="${escapeHtml(label)}">
    <span class="brand-logo__mascot-clip" aria-hidden="true"><img src="${asset('imgGroup1')}" alt="" class="brand-logo__mascot" style="mask-image:url('${asset('imgGroup')}')" /></span>
    ${insets.map((inset, i) => `<span class="brand-logo__part" style="inset:${inset}" aria-hidden="true"><img src="${asset(i === 0 ? 'imgVector' : 'imgVector' + i)}" alt="" /></span>`).join('')}
  </a>`;
}
