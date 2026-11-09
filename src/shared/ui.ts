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

