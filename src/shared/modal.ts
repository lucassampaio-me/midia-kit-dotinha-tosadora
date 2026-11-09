import { escapeHtml } from './ui';
let active: HTMLDialogElement | null=null;
/**
 * url: arquivo de vídeo (MP4/WebM) para o player nativo, ou link de uma publicação.
 * link: endereço da publicação original, exibido abaixo do player.
 */
export function openVideo({title,poster,url,link}:{title:string;poster:string;url?:string;link?:string}): void {
 active?.close();
 const trigger=document.activeElement instanceof HTMLElement?document.activeElement:null;
 const dialog=document.createElement('dialog');
 dialog.className='video-modal';dialog.setAttribute('aria-labelledby','video-modal-title');dialog.setAttribute('data-lenis-prevent','');
 const safe=(value?:string)=>{if(!value)return undefined;const parsed=new URL(value,location.href);return parsed.protocol==='https:'||parsed.protocol==='http:'?value:undefined;};
 const video=safe(url);
 const original=safe(link)??(video && !/\.(mp4|webm)(\?|$)/i.test(video)?video:undefined);
 const direct=video && /\.(mp4|webm)(\?|$)/i.test(video);
 const linkMarkup=original?'<a class="video-modal__link" href="'+escapeHtml(original)+'" target="_blank" rel="noopener noreferrer">Ver no Instagram</a>':'';
 let content='<img class="video-modal__poster" src="'+escapeHtml(poster)+'" alt="" />'+(original?linkMarkup:'<p>O vídeo desta publicação ainda será disponibilizado.</p>');
 if(direct){
  const type=/\.webm(\?|$)/i.test(video!)?'video/webm':'video/mp4';
  content='<video controls playsinline autoplay preload="metadata" poster="'+escapeHtml(poster)+'"><source src="'+escapeHtml(video!)+'" type="'+type+'" /><p>Este navegador não reproduz o vídeo aqui. Assista pela publicação original.</p></video>'+linkMarkup;
 }
 dialog.innerHTML='<button type="button" class="video-modal__close" aria-label="Fechar vídeo">Fechar ✕</button><h2 id="video-modal-title">'+escapeHtml(title)+'</h2>'+content;
 const previous=document.documentElement.style.overflow;
 document.documentElement.style.overflow='hidden';
 dialog.addEventListener('close',()=>{dialog.querySelector('video')?.pause();dialog.remove();document.documentElement.style.overflow=previous;active=null;document.dispatchEvent(new CustomEvent('dotinha:modal',{detail:{open:false}}));trigger?.focus({preventScroll:true});},{once:true});
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();const e=event as MouseEvent;if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.querySelector('button')!.addEventListener('click',()=>dialog.close());
 document.body.append(dialog);active=dialog;dialog.showModal();document.dispatchEvent(new CustomEvent('dotinha:modal',{detail:{open:true}}));
}
