// Página estática de orçamento: reaproveita fontes, cores e o logo do mídia kit.
import '../styles.css';
import './budget.css';
import { brandLogo } from '../shared/brand-logo';

const slot = document.querySelector<HTMLElement>('[data-brand-logo]');
if (slot) slot.outerHTML = brandLogo('budget-brands__dotinha', '/', 'Dotinha Tosadora, ver o mídia kit');
