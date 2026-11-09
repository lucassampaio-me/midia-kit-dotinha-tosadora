import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/a11y';
export type { SwiperOptions } from 'swiper/types';
export function createCarousel(element: HTMLElement, options: SwiperOptions): Swiper {
 return new Swiper(element,{ modules:[Navigation,Pagination,Keyboard,A11y,Autoplay],a11y:{enabled:true,prevSlideMessage:'Conteúdo anterior',nextSlideMessage:'Próximo conteúdo',paginationBulletMessage:'Ir para conteúdo {{index}}'},keyboard:{enabled:true,onlyInViewport:true},...options });
}

