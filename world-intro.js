/* A presentation-only montage. The world is already generated and saved before playback. */
(function(){
 'use strict';
 if(typeof window==='undefined'||!document.getElementById('nation-office'))return;
 const shots=['transport','industry','city'].map(name=>'assets/intro/'+name+'.webp');
 const layer=document.createElement('dialog');
 layer.id='world-intro';layer.dataset.noLocalize='';
 layer.setAttribute('aria-labelledby','intro-country');
 layer.innerHTML='<div class="intro-film" aria-hidden="true"></div><div class="intro-shade" aria-hidden="true"></div><div class="intro-rule" aria-hidden="true"></div><div class="intro-heading"><p class="intro-kicker"></p><h1 id="intro-country"></h1><p class="intro-office"></p></div><div class="intro-footer"><span class="intro-date"></span><button type="button" class="intro-skip"></button></div>';
 document.body.appendChild(layer);
 const film=layer.querySelector('.intro-film'),skip=layer.querySelector('.intro-skip');
 let active=null,preloaded=null;
 const translate=value=>typeof translateGameText==='function'?translateGameText(value):String(value);
 function prepare(){
  if(!preloaded)preloaded=shots.map(src=>{
   const img=new Image();img.alt='';img.decoding='async';
   const ready=new Promise(resolve=>{img.onload=()=>resolve(true);img.onerror=()=>resolve(false)});
   img.src=src;return {img,ready};
  });
  return preloaded;
 }
 function later(run,callback,ms){
  const id=setTimeout(()=>{run.timers.delete(id);if(active===run)callback()},ms);
  run.timers.add(id);return id;
 }
 function finish(restoreFocus=true){
  if(!active)return;
  const run=active;active=null;
  run.timers.forEach(clearTimeout);
  layer.classList.remove('intro-playing','intro-leaving','intro-reduced');
  if(layer.open)layer.close();
  film.replaceChildren();document.body.classList.remove('showing-world-intro');
  if(restoreFocus&&!document.getElementById('nation-office').hidden){
   document.getElementById('tutorial-start')?.focus({preventScroll:true});
  }
 }
 function leave(){
  if(!active||active.leaving)return;
  const run=active;run.leaving=true;
  if(run.reduced){finish();return}
  layer.classList.add('intro-leaving');later(run,finish,450);
 }
 function play(){
  finish(false);
  if(typeof s==='undefined'||!s?.political||document.getElementById('nation-office').hidden)return;
  const run={timers:new Set(),reduced:window.matchMedia('(prefers-reduced-motion: reduce)').matches,leaving:false};
  active=run;
  const en=typeof gameLanguage!=='undefined'&&gameLanguage==='en';
  layer.querySelector('.intro-kicker').textContent=en?'A NEW HISTORY':'新的历史';
  layer.querySelector('#intro-country').textContent=translate(s.name);
  layer.querySelector('.intro-office').textContent=translate(regime().name)+' · '+translate(regime().player);
  layer.querySelector('.intro-date').textContent=translate(date());
  skip.textContent=en?'Skip · Space / Esc':'跳过 · 空格 / Esc';
  layer.classList.toggle('intro-reduced',run.reduced);
  try{layer.showModal()}catch(_){finish(false);return}
  document.body.classList.add('showing-world-intro');skip.focus({preventScroll:true});
  // Every path is bounded, even if an image never finishes downloading.
  const deadline=later(run,()=>finish(),8500);
  if(run.reduced){later(run,finish,1200);return}
  let started=false;
  const begin=()=>{
   if(started||active!==run||run.leaving)return;started=true;
   const available=prepare().filter(({img})=>img.complete&&img.naturalWidth>0);
   if(!available.length){layer.classList.add('intro-reduced');later(run,finish,1200);return}
   layer.style.setProperty('--intro-title-delay',Math.max(0,(available.length-1)*1700-600)+'ms');
   available.forEach(({img},i)=>{
    const frame=img.cloneNode();frame.className='intro-photo';
    frame.style.setProperty('--intro-delay',i*1700+'ms');
    film.appendChild(frame);
   });
   layer.classList.add('intro-playing');
   clearTimeout(deadline);run.timers.delete(deadline);
   later(run,leave,available.length*1700+450);
  };
  Promise.all(prepare().map(photo=>photo.ready)).then(begin);
  later(run,begin,1800);
 }
 skip.addEventListener('click',leave);
 layer.addEventListener('cancel',event=>{event.preventDefault();leave()});
 layer.addEventListener('close',()=>{if(active&&!layer.open)finish()});
 // Capture shortcuts before the office/tutorial handlers; do not pass a skip through to gameplay.
 document.addEventListener('keydown',event=>{
  if(!active||event.ctrlKey||event.metaKey||event.altKey)return;
  if([' ','Spacebar','Escape','Enter'].includes(event.key)){
   event.preventDefault();event.stopImmediatePropagation();if(!event.repeat)leave();
  }else if(event.key!=='Tab'){event.stopImmediatePropagation()}
 },true);
 const baseCreate=create;
 create=function(...args){finish(false);return baseCreate(...args)};
 const baseDialog=newDialog;
 newDialog=function(...args){finish(false);prepare();return baseDialog(...args)};
 const baseMenu=window.officeUI.menu;
 window.officeUI.menu=function(...args){finish(false);return baseMenu(...args)};
 window.addEventListener('pagehide',()=>finish(false));
 window.worldIntro={play,skip:leave,stop:()=>finish(false)};
})();
