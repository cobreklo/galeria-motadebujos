(function(){
const btn=document.getElementById('audioBtn');
const audio=document.getElementById('bgAudio');
if(!btn||!audio)return;
let raf=null;let enabled=false;audio.volume=0;
function setBtn(on){btn.setAttribute('aria-pressed',on?'true':'false');btn.classList.toggle('ring-2',on);btn.classList.toggle('ring-white/60',on);} 
function fade(to,dur){if(raf){cancelAnimationFrame(raf);raf=null;}const from=audio.volume;const start=performance.now();function step(ts){const t=Math.min(1,(ts-start)/dur);audio.volume=from+(to-from)*t;if(t<1){raf=requestAnimationFrame(step);}else{raf=null;}}raf=requestAnimationFrame(step);} 
function doPlay(){if(!audio.src){audio.src=audio.dataset.src||'assets/audio/Ober-Otranota.mp3';}audio.muted=false;try{audio.currentTime=0;}catch{}audio.play().then(()=>{fade(0.8,600);enabled=true;localStorage.setItem('bgAudio','on');setBtn(true);}).catch(()=>{});} 
function doPause(){fade(0,400);setTimeout(()=>{try{audio.pause();}catch{}},420);enabled=false;localStorage.setItem('bgAudio','off');setBtn(false);} 
btn.addEventListener('click',()=>{(audio.paused||audio.ended)?doPlay():doPause();});
audio.addEventListener('play',()=>{enabled=true;setBtn(true);});
audio.addEventListener('pause',()=>{enabled=false;setBtn(false);});
const pref=localStorage.getItem('bgAudio');setBtn(pref==='on');
function autoStart(){
  if(!audio.src){audio.src=audio.dataset.src||'assets/audio/Ober-Otranota.mp3';}
  audio.volume=0; // comienza suave
  audio.play().then(()=>{fade(0.8,900);enabled=true;localStorage.setItem('bgAudio','on');setBtn(true);}).catch(()=>{
    const h=()=>{doPlay();document.removeEventListener('pointerdown',h);};
    document.addEventListener('pointerdown',h,{once:true});
  });
}
autoStart();
})();
