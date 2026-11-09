import { assets } from './assets';
export function escapeHtml(value: string): string {
 return value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
}
export function eyebrow(label: string, light = false): string {
 return '<p class="section-eyebrow'+(light?' section-eyebrow--light':'')+'">'+escapeHtml(label)+'</p>';
}
export function sectionTitle(text: string, className='', id=''): string {
 return '<h2'+(id?' id="'+escapeHtml(id)+'"':'')+' class="section-title '+escapeHtml(className)+'">'+escapeHtml(text)+'</h2>';
}
export function platformTabs(id: string, light = false): string {
 return '<div class="platform-tabs'+(light?' platform-tabs--light':'')+'" role="tablist" aria-label="Plataforma">'+(['instagram','tiktok'] as const).map((p,i)=>'<button type="button" role="tab" data-platform="'+p+'" id="'+id+'-tab-'+p+'" aria-controls="'+id+'-panel-'+p+'" aria-selected="'+(i===0)+'" tabindex="'+(i===0?'0':'-1')+'"><img src="'+assets('results-desktop',p==='instagram'?'imgPhosphorInstagramLogoDuotone':'imgPhosphorTiktokLogoDuotone')+'" alt="" />'+(p==='instagram'?'Instagram':'TikTok')+'</button>').join('')+'</div>';
}
export function mountTabs(root: HTMLElement): () => void {
 const controller=new AbortController();
 root.querySelectorAll<HTMLElement>('[role="tablist"]').forEach(list=>{
  const tabs=Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const activate=(tab:HTMLButtonElement, focus=false)=>{
   tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;const panel=root.querySelector<HTMLElement>('#'+t.getAttribute('aria-controls'));if(panel){panel.hidden=!active;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',t.id);}});
   if(focus)tab.focus();
  };
  tabs.forEach((tab,i)=>{
   tab.addEventListener('click',()=>activate(tab),{signal:controller.signal});
   tab.addEventListener('keydown',event=>{
    let n=i;if(event.key==='ArrowRight')n=(i+1)%tabs.length;else if(event.key==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;else if(event.key==='Home')n=0;else if(event.key==='End')n=tabs.length-1;else return;
    event.preventDefault();activate(tabs[n],true);
   },{signal:controller.signal});
  });
  if(tabs[0])activate(tabs[0]);
 });
 return ()=>controller.abort();
}


/**
 * No celular, repete as abas de plataforma acima do menu inferior enquanto a seção
 * está na tela e as abas originais já saíram dela. Some pouco antes da próxima seção.
 */
export function mountFloatingTabs(section: HTMLElement): () => void {
 const original=Array.from(section.querySelectorAll<HTMLButtonElement>('.platform-tabs [role="tab"]'));
 if(!original.length)return()=>{};
 const controller=new AbortController();
 const signal=controller.signal;
 const bar=document.createElement('div');
 bar.className='platform-float';
 bar.setAttribute('role','group');
 bar.setAttribute('aria-label','Plataforma');
 bar.inert=true;
 const buttons=original.map(tab=>{
  const button=document.createElement('button');
  button.type='button';
  button.innerHTML=tab.innerHTML;
  button.addEventListener('click',()=>{tab.click();sync();},{signal});
  bar.append(button);
  return button;
 });
 section.append(bar);
 const sync=()=>original.forEach((tab,i)=>buttons[i].setAttribute('aria-pressed',tab.getAttribute('aria-selected')??'false'));
 original.forEach(tab=>tab.addEventListener('click',sync,{signal}));
 sync();
 const mobile=matchMedia('(max-width: 799px)');
 const tablist=original[0].closest<HTMLElement>('.platform-tabs')!;
 let frame=0;
 const update=()=>{
  frame=0;
  const nav=document.querySelector<HTMLElement>('.hero-nav');
  const navTop=nav?nav.getBoundingClientRect().top:innerHeight;
  bar.style.bottom=Math.max(innerHeight-navTop+10,16)+'px';
  // A próxima seção começa a surgir quando o fim desta chega perto da base da tela.
  const visible=mobile.matches&&tablist.getBoundingClientRect().bottom<0&&section.getBoundingClientRect().bottom>innerHeight+48;
  bar.classList.toggle('is-visible',visible);
  bar.inert=!visible;
 };
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
 addEventListener('scroll',schedule,{passive:true,signal});
 addEventListener('resize',schedule,{signal});
 mobile.addEventListener('change',schedule,{signal});
 update();
 return()=>{controller.abort();cancelAnimationFrame(frame);bar.remove();};
}
