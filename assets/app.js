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
function setupBackgroundParallax(){const root=document.documentElement;const body=document.body;const speed=-0.6;let ticking=false;function apply(){const y=Math.round(window.scrollY*speed);const dark=root.classList.contains('dark');if(dark){body.style.backgroundPosition=`center 0px, center 0px, center ${y}px`;}else{body.style.backgroundPosition=`center 0px, center 0px, center 0px, center ${y}px`;}}function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(()=>{apply();ticking=false;});}}apply();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',apply);document.addEventListener('visibilitychange',apply);} 
setupBackgroundParallax();
function initTitleTicker(){const base=(document.title||'Motadebujos :3');const PLACEHOLDER='·';let i=0,dir=1;const STEP_WRITE=200,STEP_DELETE=200,PAUSE_FULL=800,PAUSE_EMPTY=600;function draw(){document.title=(i===0?PLACEHOLDER:base.slice(0,i));}function tick(){draw();if(dir===1){if(i<base.length){i++;setTimeout(tick,STEP_WRITE);}else{dir=-1;setTimeout(tick,PAUSE_FULL);}}else{if(i>0){i--;setTimeout(tick,STEP_DELETE);}else{dir=1;setTimeout(tick,PAUSE_EMPTY);}}}tick();document.addEventListener('visibilitychange',()=>{if(document.hidden)document.title=base;});}
initTitleTicker();
})();
