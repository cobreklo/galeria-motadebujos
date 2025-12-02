(function(){
let artworks=[];
const customMeta={};
const manualExtras=[];
const manualPermalinks=[];
manualPermalinks.push('https://www.instagram.com/p/DQ-b4S6Ed9h/');
manualPermalinks.push('https://www.instagram.com/p/DOM184ZDaUL/');
manualPermalinks.push('https://www.instagram.com/p/DN6o6g-DbKS/');
manualPermalinks.push('https://www.instagram.com/p/DNJ5QlQsDQX/');
manualPermalinks.push('https://www.instagram.com/p/DLGlmscMBGD/');
function inferCategory(c){c=(c||'').toLowerCase();if(/cover/.test(c)||/#coverart/.test(c))return 'CoverArt';if(/ilustr/.test(c)||/#ilustracion|#ilustración/.test(c))return 'Ilustración';if(/diseñ|disen/.test(c)||/#diseño/.test(c))return 'Diseño';return 'Ilustración';}
const track=document.getElementById('galleryTrack');
let cards=[];
const GRID_CHUNK=16; let gridPage=1;
function cardHtml(a,i){return `
<button type="button" class="gallery-card group relative aspect-[3/4] overflow-hidden rounded-lg shrink-0 w-[220px] md:w-[260px] lg:w-[300px] snap-center" data-index="${i}" data-alt="${a.alt}" data-title="${a.title}" data-year="${a.year}" data-tech="${a.tech}" data-size="${a.size}" data-src="${a.src}">
 <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-bg="${a.src}"></div>
 <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4">
  <p class="text-white text-base font-bold leading-tight line-clamp-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">${a.title}</p>
 </div>
</button>`;}
function gridCardHtml(a,i){return `
<button type="button" class="group relative aspect-[3/4] overflow-hidden rounded-lg" data-index="${i}" data-alt="${a.alt}" data-title="${a.title}" data-year="${a.year}" data-tech="${a.tech}" data-size="${a.size}" data-src="${a.src}">
 <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-bg="${a.src}"></div>
 <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4">
  <p class="text-white text-base font-bold leading-tight translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">${a.title}</p>
 </div>
</button>`;}
function setupLazy(){
 const io=new IntersectionObserver(entries=>{
  entries.forEach(en=>{
   if(en.isIntersecting){
    const el=en.target; const bg=el.getAttribute('data-bg');
    if(bg){el.style.backgroundImage=`url("${bg}")`; el.removeAttribute('data-bg');}
    io.unobserve(el);
   }
  });
 },{root:null,rootMargin:'600px',threshold:0.01});
 document.querySelectorAll('.bg-cover[data-bg]').forEach(el=>io.observe(el));
}
function render(){
 track.innerHTML=`<div class="spacer shrink-0" aria-hidden="true"></div>${artworks.map((a,i)=>cardHtml(a,i)).join('')}<div class="spacer shrink-0" aria-hidden="true"></div>`;
 cards=[...track.querySelectorAll('.gallery-card')];
 const grid=document.getElementById('galleryGrid');
 const limit=GRID_CHUNK*gridPage;
 grid.innerHTML=artworks.slice(0,limit).map((a,i)=>gridCardHtml(a,i)).join('');
 const toggle=document.getElementById('gridToggle');const more=document.getElementById('gridToggleBtn');const less=document.getElementById('gridLessBtn');
 if(toggle&&more&&less){const maxPage=Math.max(1,Math.ceil(artworks.length/GRID_CHUNK));toggle.classList.toggle('hidden',artworks.length<=GRID_CHUNK);less.classList.toggle('hidden',gridPage<=1);more.disabled=gridPage>=maxPage;}
 cards.forEach(card=>{card.addEventListener('click',()=>{if(window.openIndex)window.openIndex(Number(card.dataset.index));});});
 document.querySelectorAll('#galleryGrid button').forEach(el=>{el.addEventListener('click',()=>{if(window.openIndex)window.openIndex(Number(el.dataset.index));});});
 setupLazy();
}
render();
const gridToggleBtn=document.getElementById('gridToggleBtn');const gridLessBtn=document.getElementById('gridLessBtn');
if(gridToggleBtn){gridToggleBtn.addEventListener('click',()=>{const maxPage=Math.max(1,Math.ceil(artworks.length/GRID_CHUNK));gridPage=Math.min(maxPage,gridPage+1);render();});}
if(gridLessBtn){gridLessBtn.addEventListener('click',()=>{gridPage=Math.max(1,gridPage-1);render();});}
async function loadInstagram(){
 try{
  const extra=manualPermalinks.length?`&oembed=${encodeURIComponent(manualPermalinks.join(','))}`:'';
  const r=await fetch(`/api/instagram?max=100&nested=true${extra}`);
  const j=await r.json();
  const raw=Array.isArray(j?.data)?j.data:(Array.isArray(j)?j:[]);
  const items=raw
   .filter(p=>p.media_type==='IMAGE'||p.media_type==='CAROUSEL_ALBUM'||p.media_type==='VIDEO')
   .sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp))
   .map(p=>{
     const o=customMeta[p.id]||{};
     const children=(p.children||[]);
     const first=children[0];
     const cover=(p.media_type==='CAROUSEL_ALBUM')
       ? (first ? (first.media_type==='VIDEO' ? (first.thumbnail_url||'') : (first.media_url||'')) : (p.thumbnail_url||p.media_url||''))
       : (p.media_type==='VIDEO' ? (p.thumbnail_url||'') : (p.media_url||''));
     return {
       id:p.id,
       title:o.title??(p.caption||'Instagram').slice(0,40),
       src:cover,
       alt:p.caption||'',
       year:new Date(p.timestamp).getFullYear(),
       category:inferCategory(p.caption),
       size:o.size??'3000x3000',
       desc:p.caption||'',
       instagramUrl:p.permalink,
       mediaType:p.media_type,
       videoUrl:p.media_type==='VIDEO'?p.media_url:undefined,
       children:children
     };
   });
  artworks=[...items,...manualExtras];
 }catch(e){
  try{console.error('Instagram API error',e);}catch{}
  artworks=[...manualExtras];
 }
 window.artworks=artworks;
 render();
}
loadInstagram();
const prev=document.getElementById('prevBtn');
const next=document.getElementById('nextBtn');
function centerX(){const r=track.getBoundingClientRect();return r.left+track.clientWidth/2;}
function updateSpacers(){const spacers=track.querySelectorAll('.spacer');const w=cards[0]?.offsetWidth||0;const pad=Math.max(0,(track.clientWidth/2)-(w/2));spacers.forEach(s=>s.style.width=pad+'px');}
function currentIndex(){const c=centerX();let idx=0,b=1e9;cards.forEach((e,i)=>{const r=e.getBoundingClientRect();const d=Math.abs(r.left+r.width/2-c);if(d<b){b=d;idx=i;}});return idx;}
function targetLeftFor(i){const el=cards[i];return el.offsetLeft+el.offsetWidth/2-track.clientWidth/2;}
function anim(left){const max=track.scrollWidth-track.clientWidth;left=Math.max(0,Math.min(max,left));const start=track.scrollLeft;const dist=left-start;if(Math.abs(dist)<1)return;const dur=550;let st=null;function step(ts){if(!st)st=ts;const t=Math.min(1,(ts-st)/dur);const e=1-Math.pow(1-t,3);track.scrollLeft=start+dist*e;if(t<1)requestAnimationFrame(step);}requestAnimationFrame(step);} 
function scrollToIdx(i){if(i<0||i>=cards.length)return;anim(targetLeftFor(i));}
if(prev)prev.addEventListener('click',()=>scrollToIdx(currentIndex()-1));
if(next)next.addEventListener('click',()=>scrollToIdx(currentIndex()+1));
function active(){const c=centerX();cards.forEach(e=>{const r=e.getBoundingClientRect();const d=Math.abs(r.left+r.width/2-c);const sc=Math.max(0.9,1.08-d/800);const br=Math.max(0.85,1.18-d/800);const sh=Math.max(0,0.35-d/900);e.style.transform=`scale(${sc})`;e.style.filter=`brightness(${br})`;e.style.boxShadow=`0 20px 60px rgba(0,0,0,${sh})`;});highlightDots();}
let t;track.addEventListener('scroll',()=>{active();clearTimeout(t);t=setTimeout(()=>scrollToIdx(currentIndex()),120);},{passive:true});
const dots=document.getElementById('carouselDots');
function renderDots(){const n=cards.length;dots.innerHTML=Array.from({length:n},(_,i)=>`<button class="h-2 w-2 rounded-full bg-white/30" data-i="${i}"></button>`).join('');[...dots.children].forEach((d,i)=>d.addEventListener('click',()=>scrollToIdx(i)));}
function highlightDots(){const i=currentIndex();[...dots.children].forEach((d,idx)=>{d.classList.toggle('bg-primary',idx===i);d.classList.toggle('bg-white/30',idx!==i);});}
renderDots();highlightDots();
window.addEventListener('resize',()=>{updateSpacers();scrollToIdx(currentIndex());active();});
updateSpacers();scrollToIdx(0);active();
const chips=[...document.querySelectorAll('.filter-chip')];
chips.forEach(ch=>ch.addEventListener('click',()=>{const tag=ch.dataset.filter;chips.forEach(c=>c.classList.remove('bg-primary/30'));ch.classList.add('bg-primary/30');gridPage=1;const grid=document.getElementById('galleryGrid');const list=artworks.map((a,i)=>({a,i})).filter(x=>tag==='all'||x.a.category===tag);const limit=GRID_CHUNK*gridPage;grid.innerHTML=list.slice(0,limit).map(({a,i})=>gridCardHtml(a,i)).join('');const toggle=document.getElementById('gridToggle');const more=document.getElementById('gridToggleBtn');const less=document.getElementById('gridLessBtn');if(toggle&&more&&less){toggle.classList.toggle('hidden',list.length<=GRID_CHUNK);less.classList.add('hidden');more.disabled=(list.length<=GRID_CHUNK);}setupLazy();
document.querySelectorAll('#galleryGrid button').forEach(el=>el.addEventListener('click',()=>{if(window.openIndex)window.openIndex(Number(el.dataset.index));}));}));
})();
