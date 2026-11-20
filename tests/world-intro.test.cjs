const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
function boot({reduced=false,images='loaded',en=false}={}){
 let now=0,id=0;const timers=new Map(),nodes=new Map(),listeners={},photos=[];
 class Element{
  constructor(){this.children=[];this.dataset={};this.style={setProperty:(k,v)=>this.style[k]=v};this.hidden=false;this.open=false;this.events={};this.textContent='';const values=new Set();this.classList={add:(...x)=>x.forEach(v=>values.add(v)),remove:(...x)=>x.forEach(v=>values.delete(v)),toggle:(x,on)=>on?values.add(x):values.delete(x),contains:x=>values.has(x)}}
  setAttribute(k,v){this[k]=v}querySelector(k){if(!nodes.has(k))nodes.set(k,new Element());return nodes.get(k)}
  appendChild(x){this.children.push(x);if(x.id)nodes.set(x.id,x)}replaceChildren(){this.children=[]}
  addEventListener(k,f){(this.events[k]??=[]).push(f)}focus(){document.activeElement=this}showModal(){this.open=true}close(){this.open=false;this.events.close?.forEach(f=>f())}
 }
 const document={body:new Element(),getElementById:id=>nodes.get(id),createElement:()=>new Element(),addEventListener:(k,f)=>{(listeners[k]??=[]).push(f)}};
 nodes.set('nation-office',new Element());nodes.set('tutorial-start',new Element());
 class Image extends Element{
  constructor(){super();this.complete=images!=='pending';this.naturalWidth=images==='loaded'?1920:0;photos.push(this)}
  set src(v){this._src=v;if(images!=='pending')Promise.resolve().then(()=>images==='loaded'?this.onload?.():this.onerror?.())}get src(){return this._src}
  cloneNode(){const frame=new Element();frame.src=this.src;return frame}
 }
 const state={name:'测试共和国',political:{ap:3},q:0,rng:123,history:[{q:0}],policies:{income:24}};
 const ctx={document,Image,s:state,gameLanguage:en?'en':'zh',regime:()=>({name:'总统制',player:'总统'}),date:()=> '2030 Q1',translateGameText:x=>en?({'测试共和国':'Republic of Alden','总统制':'Presidential republic','总统':'President'}[x]||x):x,
  create:()=>{},newDialog:()=>{},setTimeout:(f,ms)=>{timers.set(++id,{f,at:now+ms});return id},clearTimeout:id=>timers.delete(id)};
 ctx.window={officeUI:{menu(){nodes.get('nation-office').hidden=true}},matchMedia:()=>({matches:reduced}),addEventListener(){}};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'world-intro.js'),'utf8'),ctx);
 const tick=ms=>{const end=now+ms;for(;;){const next=[...timers].sort((a,b)=>a[1].at-b[1].at)[0];if(!next||next[1].at>end)break;now=next[1].at;timers.delete(next[0]);next[1].f()}now=end};
 const flush=async()=>{await Promise.resolve();await Promise.resolve();await Promise.resolve()};
 return {ctx,nodes,photos,timers,tick,flush,layer:nodes.get('world-intro'),film:nodes.get('.intro-film'),state,listeners,document};
}
(async()=>{
 let b=boot(),before=JSON.stringify(b.state);
 assert.equal(b.layer.open,false,'no intro during script load');b.ctx.create();assert.equal(b.layer.open,false,'ordinary create does not replay');
 b.ctx.newDialog();await b.flush();assert.equal(b.photos.length,3,'preloads only on world dialog');
 b.ctx.window.worldIntro.play();await b.flush();assert.equal(b.layer.open,true);assert.equal(b.film.children.length,3);
 b.tick(6000);assert.equal(b.layer.open,false,'bounded natural end');assert.equal(b.timers.size,0,'all timers cleared');assert.equal(JSON.stringify(b.state),before,'no state, RNG, AP, quarter or history mutations');assert.equal(b.document.activeElement,b.nodes.get('tutorial-start'));
 for(const key of [' ','Escape','Enter']){b=boot();b.ctx.window.worldIntro.play();await b.flush();let prevented=false,stopped=false;b.listeners.keydown[0]({key,preventDefault(){prevented=true},stopImmediatePropagation(){stopped=true}});b.tick(450);assert.ok(prevented&&stopped,'skip is consumed');assert.equal(b.layer.open,false);assert.equal(b.timers.size,0)}
 b=boot({images:'pending'});b.ctx.window.worldIntro.play();b.ctx.window.worldIntro.skip();b.tick(500);await b.flush();b.tick(10000);assert.equal(b.layer.open,false,'skip before load never reopens');assert.equal(b.film.children.length,0);
 for(const images of ['pending','failed']){b=boot({images});b.ctx.window.worldIntro.play();await b.flush();b.tick(9000);assert.equal(b.layer.open,false,'failure fallback exits');assert.equal(b.timers.size,0)}
 b=boot({images:'pending'});b.ctx.window.worldIntro.play();b.photos[0].complete=true;b.photos[0].naturalWidth=1920;b.tick(1800);assert.equal(b.film.children.length,1,'uses loaded photos only');assert.equal(b.layer.style['--intro-title-delay'],'0ms','short montage still shows title');b.tick(3000);assert.equal(b.layer.open,false);
 b=boot({reduced:true});b.ctx.window.worldIntro.play();assert.equal(b.photos.length,0,'reduced motion needs no downloads');assert.equal(b.film.children.length,0);b.tick(1200);assert.equal(b.layer.open,false);
 b=boot({en:true});b.ctx.window.worldIntro.play();await b.flush();assert.equal(b.nodes.get('#intro-country').textContent,'Republic of Alden');assert.match(b.nodes.get('.intro-skip').textContent,/Skip/);
 b.ctx.window.worldIntro.play();await b.flush();b.ctx.window.officeUI.menu();b.tick(10000);assert.equal(b.layer.open,false,'menu cancels playback');assert.equal(b.timers.size,0);
 b=boot();b.ctx.window.worldIntro.play();b.ctx.create();await b.flush();b.tick(10000);assert.equal(b.layer.open,false,'replaced world cancels stale playback');
 // The only gameplay entry point is the confirmed world-creation button, not resume/import/render.
 const source=fs.readFileSync(path.join(root,'governance.js'),'utf8');assert.equal((source.match(/worldIntro\?\.play\(\)/g)||[]).length,1);assert.ok(source.includes("create(v);window.worldIntro?.play()"));
 console.log('World intro: entry, state invariance, skip, cleanup, language, reduced motion and loading fallbacks passed.');
})().catch(error=>{console.error(error);process.exitCode=1});
