import { escapeHtml } from './ui';
let active: HTMLDialogElement | null=null;
export function openVideo({title,poster,url}:{title:string;poster:string;url?:string}): void {
 active?.close();
 const trigger=document.activeElement instanceof HTMLElement?document.activeElement:null;
 const dialog=document.createElement('dialog');
 dialog.className='video-modal';dialog.setAttribute('aria-labelledby','video-modal-title');dialog.setAttribute('data-lenis-prevent','');
 const direct=url && /\.(mp4|webm)(\?|$)/i.test(url);
 let content='<img class="video-modal__poster" src="'+escapeHtml(poster)+'" alt="" /><p>O vídeo desta publicação ainda será disponibilizado.</p>';
 if(url){const parsed=new URL(url,location.href);if(parsed.protocol==='https:'||parsed.protocol==='http:') content=direct?'<video controls playsinline autoplay src="'+escapeHtml(url)+'" poster="'+escapeHtml(poster)+'"></video>':'<img class="video-modal__poster" src="'+escapeHtml(poster)+'" alt="" /><a href="'+escapeHtml(url)+'" target="_blank" rel="noopener noreferrer">Abrir publicação original</a>';}
 dialog.innerHTML='<button type="button" class="video-modal__close" aria-label="Fechar vídeo">Fechar ✕</button><h2 id="video-modal-title">'+escapeHtml(title)+'</h2>'+content;
 const previous=document.documentElement.style.overflow;
 document.documentElement.style.overflow='hidden';
 dialog.addEventListener('close',()=>{dialog.querySelector('video')?.pause();dialog.remove();document.documentElement.style.overflow=previous;active=null;document.dispatchEvent(new CustomEvent('dotinha:modal',{detail:{open:false}}));trigger?.focus({preventScroll:true});},{once:true});
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();const e=event as MouseEvent;if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.querySelector('button')!.addEventListener('click',()=>dialog.close());
 document.body.append(dialog);active=dialog;dialog.showModal();document.dispatchEvent(new CustomEvent('dotinha:modal',{detail:{open:true}}));
}

