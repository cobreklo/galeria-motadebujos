(function(){
const btn=document.getElementById('audioBtn');
const audio=document.getElementById('bgAudio');
if(!btn||!audio)return;
const saved=localStorage.getItem('bgAudio')==='on';
let enabled=false;let raf=null;audio.volume=0;
function setBtn(on){btn.setAttribute('aria-pressed',on?'true':'false');btn.classList.toggle('ring-2',on);btn.classList.toggle('ring-white/60',on);}
function fade(to,dur){if(raf){cancelAnimationFrame(raf);raf=null;}const from=audio.volume;const start=performance.now();function step(ts){const t=Math.min(1,(ts-start)/dur);audio.volume=from+(to-from)*t;if(t<1){raf=requestAnimationFrame(step);}else{raf=null;}}raf=requestAnimationFrame(step);} 
async function play(){if(!audio.src&&audio.dataset.src){audio.src=audio.dataset.src;}try{await audio.play();fade(0.8,600);enabled=true;localStorage.setItem('bgAudio','on');setBtn(true);}catch{}}
function pause(){fade(0,400);setTimeout(()=>{try{audio.pause();}catch{}},420);enabled=false;localStorage.setItem('bgAudio','off');setBtn(false);} 
function prime(){document.removeEventListener('pointerdown',prime);if(saved&&!enabled){play();}}
document.addEventListener('pointerdown',prime,{once:true});
setBtn(saved);
btn.addEventListener('click',()=>{enabled?pause():play();});
})();
