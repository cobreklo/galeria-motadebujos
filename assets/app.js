(function(){
function setupHeroScroll(){
 const hero=document.getElementById('hero'); if(!hero) return;
 const media=hero.querySelector('.hero-media'); const content=hero.querySelector('.hero-content');
 let ticking=false;
 function apply(){
  const top=hero.offsetTop; const h=hero.offsetHeight; const y=window.scrollY;
  const p=Math.max(0,Math.min(1,(y-top)/(h*0.8)));
  const scale=1-0.12*p; const x=-60*p;
  if(media){media.style.transform=`translateX(${x}px) scale(${scale})`;}
  if(content){content.style.opacity=String(1-p*0.25); content.style.transform=`translateX(${x*0.2}px)`;}
  ticking=false;
 }
 function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(apply);}}
 apply(); window.addEventListener('scroll',onScroll,{passive:true}); window.addEventListener('resize',apply);
}
function setupAboutScroll(){
 const sec=document.getElementById('acerca'); if(!sec) return;
 const media=sec.querySelector('.about-media'); if(!media) return;
 let ticking=false;
 function apply(){
  const top=sec.offsetTop; const h=sec.offsetHeight; const y=window.scrollY;
  const p=Math.max(0,Math.min(1,(y-top)/(h*0.8)));
  const scale=1-0.08*p; const x=60*p;
  media.style.transform=`translateX(${x}px) scale(${scale})`;
  ticking=false;
 }
 function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(apply);}}
 apply(); window.addEventListener('scroll',onScroll,{passive:true}); window.addEventListener('resize',apply);
}
function setupReveal(){
 const io=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('reveal-in');io.unobserve(e.target);}})},{threshold:0.15});
 document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}
function setupNavActive(){
 const links=[...document.querySelectorAll('header a[href^="#"]')];
 const map=new Map();
 links.forEach(a=>{const id=a.getAttribute('href').slice(1);const sec=document.getElementById(id);if(sec)map.set(sec,a)});
 const io=new IntersectionObserver((ents)=>{ents.forEach(e=>{const a=map.get(e.target);if(!a)return;const on=e.isIntersecting;document.querySelectorAll('header a').forEach(x=>x.classList.remove('nav-active'));if(on)a.classList.add('nav-active');})},{rootMargin:'-40% 0px -50% 0px',threshold:0.25});
 map.forEach((_,sec)=>io.observe(sec));
}
function initThemeToggle(){
 const root=document.documentElement;const btn=document.getElementById('themeToggle');
 const saved=localStorage.getItem('theme');
 let mode=saved==='light'?'light':'dark';
 apply();
 function apply(){root.classList.toggle('dark',mode==='dark');}
 if(btn){btn.setAttribute('aria-pressed',mode==='dark'?'true':'false');
  btn.addEventListener('click',()=>{mode=mode==='light'?'dark':'light';localStorage.setItem('theme',mode);apply();});
 }
}
function initSepiaToggle(){
 const root=document.documentElement;const btn=document.getElementById('sepiaToggle');
 const saved=localStorage.getItem('sepia');
 let on=saved==='on';
 apply();
 function apply(){root.classList.toggle('sepia',on);}
 if(btn){btn.setAttribute('aria-pressed',on?'true':'false');
  btn.addEventListener('click',()=>{on=!on;localStorage.setItem('sepia',on?'on':'off');apply();});
 }
}
const contactForm=document.getElementById('contactForm');
if(contactForm){
 const status=document.getElementById('contactStatus');
 const btn=contactForm.querySelector('button[type="submit"]');
 const btnLabel=btn.querySelector('span');
 function showStatus(msg,ok){
  if(!status)return;status.textContent=msg;status.classList.remove('hidden');
  status.classList.toggle('bg-primary',!!ok);
  status.classList.toggle('bg-white/10',!ok);
 }
 contactForm.addEventListener('submit',async(e)=>{
  e.preventDefault();
  if(!contactForm.reportValidity())return;
  btn.disabled=true;const orig=btnLabel.textContent;btnLabel.textContent='Enviando...';
  const fd=new FormData(contactForm);
  const controller=new AbortController();const to=setTimeout(()=>controller.abort(),8000);
  try{
   const res=await fetch('https://formsubmit.co/ajax/lethermand123@gmail.com',{method:'POST',body:fd,signal:controller.signal,headers:{'Accept':'application/json'}});
   clearTimeout(to);
   if(!res.ok)throw new Error('status '+res.status);
   await res.json();
   showStatus('Mensaje enviado. ¡Gracias!',true);contactForm.reset();
  }catch(err){
   try{clearTimeout(to);contactForm.submit();}catch{}
  }finally{
   btn.disabled=false;btnLabel.textContent=orig;
  }
 });
}
const quoteBtn=document.getElementById('quoteGuideToggle');
const quoteBox=document.getElementById('quoteGuide');
if(quoteBtn&&quoteBox){quoteBtn.setAttribute('aria-expanded','false');quoteBtn.addEventListener('click',()=>{const open=!quoteBox.classList.contains('hidden');quoteBox.classList.toggle('hidden',open);quoteBtn.setAttribute('aria-expanded',open?'false':'true');});}
initThemeToggle();
initSepiaToggle();
setupHeroScroll();
setupAboutScroll();
setupReveal();
setupNavActive();
function setupBackgroundParallax(){const root=document.documentElement;const body=document.body;const speed=-0.6;let ticking=false;function apply(){const y=Math.round(window.scrollY*speed);const dark=root.classList.contains('dark');if(dark){body.style.backgroundPosition=`center 0px, center 0px, center ${y}px`;}else{body.style.backgroundPosition=`center 0px, center 0px, center 0px, center ${y}px`;}}function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(()=>{apply();ticking=false;});}}apply();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',apply);document.addEventListener('visibilitychange',apply);} 
setupBackgroundParallax();
function initTitleTicker(){const base=(document.title||'Motadebujos :3');const PLACEHOLDER='·';let i=0,dir=1;const STEP_WRITE=200,STEP_DELETE=200,PAUSE_FULL=800,PAUSE_EMPTY=600;function draw(){document.title=(i===0?PLACEHOLDER:base.slice(0,i));}function tick(){draw();if(dir===1){if(i<base.length){i++;setTimeout(tick,STEP_WRITE);}else{dir=-1;setTimeout(tick,PAUSE_FULL);}}else{if(i>0){i--;setTimeout(tick,STEP_DELETE);}else{dir=1;setTimeout(tick,PAUSE_EMPTY);}}}tick();document.addEventListener('visibilitychange',()=>{if(document.hidden)document.title=base;});}
initTitleTicker();
function initRipple(){const sel='button,a,.filter-chip,.gallery-card';document.querySelectorAll(sel).forEach(el=>el.classList.add('ripple-wrap'));document.addEventListener('click',(e)=>{const el=e.target.closest(sel);if(!el)return;const rect=el.getBoundingClientRect();const size=Math.max(rect.width,rect.height);const x=e.clientX-rect.left-size/2;const y=e.clientY-rect.top-size/2;const s=document.createElement('span');s.className='ripple-circle';s.style.width=size+'px';s.style.height=size+'px';s.style.left=x+'px';s.style.top=y+'px';el.appendChild(s);setTimeout(()=>{try{s.remove();}catch{}},650);},{passive:true});}
initRipple();
function initClickBurst(){const layer=document.getElementById('clickBurst')||(()=>{const d=document.createElement('div');d.id='clickBurst';d.style.position='fixed';d.style.inset='0';d.style.pointerEvents='none';d.style.zIndex='999';document.body.appendChild(d);return d;})();document.addEventListener('click',(e)=>{const x=e.clientX,y=e.clientY;const palette=['var(--btn-bg)','white','#FFD266','#EAEAEA'];for(let i=0;i<14;i++){const s=document.createElement('span');s.className='burst-dot';const ang=Math.random()*Math.PI*2;const dist=30+Math.random()*80;const dx=Math.cos(ang)*dist;const dy=Math.sin(ang)*dist;s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--dx',dx+'px');s.style.setProperty('--dy',dy+'px');s.style.backgroundColor=palette[i%palette.length];layer.appendChild(s);setTimeout(()=>{try{s.remove();}catch{}},740);}},{passive:true});}
initClickBurst();
function setupReviewsExpand(){const sec=document.getElementById('testimonios');if(!sec)return;const arts=[...sec.querySelectorAll('article')];arts.forEach(a=>{const p=a.querySelector('p');if(!p)return;const lh=parseFloat(getComputedStyle(p).lineHeight)||24;const lines=3;const MAX=Math.round(lh*lines);if(p.scrollHeight<=MAX)return;a.style.position='relative';p.style.transition='max-height 300ms ease';p.style.maxHeight=MAX+'px';p.style.overflow='hidden';const fade=document.createElement('div');fade.className='review-fade';a.appendChild(fade);const btn=document.createElement('button');btn.className='mt-3 rounded-full px-3 py-2 text-sm bg-[#1b130f]/10 dark:bg-white/10 text-[#1b130f] dark:text-white hover:bg-[#1b130f]/15 dark:hover:bg-white/20';btn.textContent='Leer más';btn.setAttribute('aria-expanded','false');btn.addEventListener('click',()=>{const collapsed=p.style.maxHeight&&p.style.maxHeight!=='none';if(collapsed){p.style.maxHeight='none';fade.style.display='none';btn.textContent='Leer menos';btn.setAttribute('aria-expanded','true');}else{p.style.maxHeight=MAX+'px';fade.style.display='';btn.textContent='Leer más';btn.setAttribute('aria-expanded','false');}});a.appendChild(btn);});}
setupReviewsExpand();
})();
