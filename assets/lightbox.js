(function(){
const overlay=document.getElementById('lightbox');
const img=document.getElementById('lightboxImg');
const close=document.getElementById('lightboxClose');
const lbPrev=document.getElementById('lightboxPrev');
const lbNext=document.getElementById('lightboxNext');
const lbTitle=document.getElementById('lbTitle');
const lbInfo=document.getElementById('lbInfo');
const lbDesc=document.getElementById('lbDesc');
const lbCounter=document.getElementById('lbCounter');
const lbShare=document.getElementById('lbShare');
const lbAlbumControls=document.getElementById('lbAlbumControls');
const lbAlbumPrev=document.getElementById('lbAlbumPrev');
const lbAlbumNext=document.getElementById('lbAlbumNext');
const vid=document.getElementById('lightboxVid');
const lens=document.getElementById('zoomLens');
const zoomToggle=document.getElementById('zoomToggle');
const zoomLv2=document.getElementById('zoomLv2');
const zoomLv3=document.getElementById('zoomLv3');
const zoomLv4=document.getElementById('zoomLv4');
let lensEnabled=false; let lensZoom=2; const LSIZE=180;
let current=0;let heroMode=false;let albumIdx=0;
function setMeta(i){const list=window.artworks||[];const art=list[i];if(!art)return;const hasChildren=Array.isArray(art.children)&&art.children.length>0;lbTitle.textContent=art.title||'';lbInfo.textContent=`${art.category||''} • ${art.year||''} • ${art.size||''}`;lbDesc.textContent=art.desc||'';lbCounter.textContent=`${i+1}/${list.length}${hasChildren?` • ${albumIdx+1}/${art.children.length}`:''}`;lbShare.href=art.instagramUrl||'https://www.instagram.com/motadebujos?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';
 let useVideo=false; let url='';
 if(hasChildren){albumIdx=Math.max(0,Math.min(albumIdx,art.children.length-1));const c=art.children[albumIdx];useVideo=(c.media_type==='VIDEO');url=useVideo?(c.media_url||''):(c.media_url||c.thumbnail_url||art.src);lbAlbumControls.classList.remove('hidden');}
 else {useVideo=(art.mediaType==='VIDEO');url=useVideo?(art.videoUrl||''):(art.src);lbAlbumControls.classList.add('hidden');}
 if(useVideo && url){vid.classList.remove('hidden');img.classList.add('hidden');if(lens)lens.classList.add('hidden');vid.src=url;try{vid.load();}catch{}}
 else {img.classList.remove('hidden');vid.classList.add('hidden');img.src=url;if(lens){lens.style.width=LSIZE+'px';lens.style.height=LSIZE+'px';lens.style.backgroundImage=`url("${img.src}")`;const nw=img.naturalWidth||0,nh=img.naturalHeight||0;lens.dataset.nw=nw;lens.dataset.nh=nh;lens.style.backgroundSize=`${nw*lensZoom}px ${nh*lensZoom}px`;}}
 img.alt=art.alt||'';preloadAdjacent(i);} 
function enableZoom(){if(!lens||!lensEnabled||img.classList.contains('hidden'))return;lens.classList.remove('hidden');const nw=img.naturalWidth||Number(lens.dataset.nw)||0;const nh=img.naturalHeight||Number(lens.dataset.nh)||0;lens.style.backgroundSize=`${nw*lensZoom}px ${nh*lensZoom}px`;}
function disableZoom(){if(lens)lens.classList.add('hidden');}
function onMove(e){if(!lens||lens.classList.contains('hidden'))return;const rect=img.getBoundingClientRect();const x=e.clientX-rect.left;const y=e.clientY-rect.top;if(x<0||y<0||x>rect.width||y>rect.height){disableZoom();return;}const nw=Number(lens.dataset.nw)||img.naturalWidth;const nh=Number(lens.dataset.nh)||img.naturalHeight;const rx=Math.max(0,Math.min(nw,(x/rect.width)*nw));const ry=Math.max(0,Math.min(nh,(y/rect.height)*nh));lens.style.left=(e.clientX-LSIZE/2)+'px';lens.style.top=(e.clientY-LSIZE/2)+'px';lens.style.backgroundPosition=`${-(rx*lensZoom-LSIZE/2)}px ${-(ry*lensZoom-LSIZE/2)}px`;}
if(img){img.addEventListener('mouseenter',enableZoom);img.addEventListener('mousemove',onMove);img.addEventListener('mouseleave',disableZoom);} 
if(zoomToggle){zoomToggle.addEventListener('click',()=>{lensEnabled=!lensEnabled;zoomToggle.setAttribute('aria-pressed',lensEnabled?'true':'false');zoomToggle.classList.toggle('bg-white/40',lensEnabled);zoomToggle.classList.toggle('ring-2',lensEnabled);zoomToggle.classList.toggle('ring-white/60',lensEnabled);if(!lensEnabled)disableZoom();});}
[zoomLv2,zoomLv3,zoomLv4].forEach(btn=>{if(btn)btn.addEventListener('click',()=>{lensZoom=Number(btn.dataset.z)||2;[zoomLv2,zoomLv3,zoomLv4].forEach(b=>b&&b.classList.toggle('bg-white/30',b===btn));const nw=img.naturalWidth||Number(lens.dataset.nw)||0;const nh=img.naturalHeight||Number(lens.dataset.nh)||0;if(!lensEnabled||lens.classList.contains('hidden'))return;lens.style.backgroundSize=`${nw*lensZoom}px ${nh*lensZoom}px`;});});
function openIndex(i){current=i;albumIdx=0;heroMode=false;overlay.classList.remove('hidden');overlay.classList.add('flex');document.body.classList.add('overflow_hidden');document.body.classList.add('overflow-hidden');document.getElementById('lightboxNav').classList.remove('hidden');setMeta(i);trapFocus();}
function closeLb(){overlay.classList.add('hidden');overlay.classList.remove('flex');document.body.classList.remove('overflow-hidden');}
if(overlay)overlay.addEventListener('click',e=>{if(e.target===overlay)closeLb();});
if(close)close.addEventListener('click',closeLb);
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeLb();});
if(lbPrev)lbPrev.addEventListener('click',()=>{current=Math.max(0,current-1);setMeta(current);});
if(lbNext)lbNext.addEventListener('click',()=>{const list=window.artworks||[];current=Math.min(list.length-1,current+1);setMeta(current);});
window.addEventListener('keydown',e=>{if(heroMode)return;if(e.key==='ArrowLeft'){lbPrev&&lbPrev.click();}else if(e.key==='ArrowRight'){lbNext&&lbNext.click();}});
window.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='z'){zoomToggle&&zoomToggle.click();}});
if(lbAlbumPrev)lbAlbumPrev.addEventListener('click',()=>{const list=window.artworks||[];const art=list[current];if(!art||!art.children||!art.children.length)return;albumIdx=Math.max(0,albumIdx-1);setMeta(current);});
if(lbAlbumNext)lbAlbumNext.addEventListener('click',()=>{const list=window.artworks||[];const art=list[current];if(!art||!art.children||!art.children.length)return;albumIdx=Math.min(art.children.length-1,albumIdx+1);setMeta(current);});
let sx=0;if(overlay){overlay.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;});overlay.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(dx>40){lbPrev&&lbPrev.click();}else if(dx<-40){lbNext&&lbNext.click();}});} 
function preloadAdjacent(i){const list=window.artworks||[];[i-1,i+1].forEach(k=>{const a=list[k];if(!a||!a.src)return;const im=new Image();im.src=a.src;});}
function trapFocus(){const f=[close,lbPrev,lbNext].filter(el=>el&&!el.classList.contains('hidden'));let idx=0;f.forEach(el=>el&&el.setAttribute('tabindex','0'));overlay.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();if(!f.length){close&&close.focus();return;}idx=(idx+(e.shiftKey?-1:1)+f.length)%f.length;f[idx].focus();}});} 
const heroMedia=document.querySelector('#hero .hero-media');
window.openIndex=openIndex;
})();
