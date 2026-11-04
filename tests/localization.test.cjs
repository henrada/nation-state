const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function boot(language='zh'){
 const nodes={},storage={'nation-state-language':language};
 const c={console,setTimeout:()=>{},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},document:{getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',style:{},showModal(){this.open=true},close(){this.open=false},addEventListener(){}})}};
 vm.createContext(c);for(const [,file]of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^?]+)\?/g))vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c,{filename:file});
 return {c,nodes,storage,run:code=>vm.runInContext(code,c)};
}
const {c,run,storage}=boot('en');
const all=[];
for(const regime of run('REGIMES.map(r=>r.id)')){
 c.targetRegime=regime;
 run("selectedRegime=targetRegime;pendingAdmin107=true;create('english-'+targetRegime)");
 assert.equal(run('validSave(s)'),true,regime+' save');
 const people=run('pstate().candidates.map(c=>c.baseName||c.name)');
 assert.equal(new Set(people).size,people.length,'unique identities');
 for(const name of people)assert.match(name,/^[A-Z][a-z]+ [A-Z][a-zA-Z]+$/,'English first and last names: '+name);
 assert.equal(run('pstate().candidates.every(c=>EN_FIRST_NAMES.includes((c.baseName||c.name).split(" ")[0]))'),true);
 const before=run('JSON.stringify(s)');run("setGameLanguage('zh');setGameLanguage('en')");assert.equal(run('JSON.stringify(s)'),before,'language is display-only');
 assert.equal(storage['nation-state-language'],'en');
 const factionNames=run('pstate().factions.map(f=>translateGameText(f.name))');
 assert.equal(new Set(factionNames).size,factionNames.length,'distinct translated parties '+regime);
 for(const name of factionNames)assert.doesNotMatch(name,/[\u3400-\u9fff]/,'translated party '+name);
 for(const key of ['stability','unemployment','chamber support','policy interest rate','military council']){c.query=key;const matches=run('guideMatches104(query)');if(key!=='military council'||regime==='tyranny')assert.ok(matches.length,'guide query '+key)}
 for(const fn of ['overview','budget','policies','politics','assembly','cabinet','judiciary','archive','centralBankPage107','situationsPage']){
  c.fn=fn;if(!run('typeof globalThis[fn]==="function"'))continue;
  const html=run('globalThis[fn]()');if(typeof html!=='string')continue;
  for(const text of html.replace(/<[^>]*>/g,'\n').split('\n').map(s=>s.trim()).filter(Boolean)){
   c.text=text;all.push({regime,page:fn,source:text,english:run('translateGameText(text)')});
  }
 }
 run('{const roundTrip=JSON.parse(JSON.stringify(s));s=roundTrip;initPolitics()}');assert.equal(run('validSave(s)'),true,'English save reload');
}
// Names remain English in an English-created world even if the interface is switched back.
run("setGameLanguage('zh')");assert.match(run('personName()'),/^[A-Z][a-z]+ [A-Z][a-zA-Z]+$/);
const chinese=boot();chinese.run("selectedRegime='presidential';create('chinese-unchanged')");assert.match(chinese.run('personName()'),/^[\u3400-\u9fff]+$/);
const state=chinese.run('JSON.stringify(s)');chinese.run("setGameLanguage('en');refreshLocaleAliases()");assert.equal(chinese.run('JSON.stringify(s)'),state,'old save identities not rewritten');
assert.equal(chinese.run("translateGameText('失业率-0.5；稳定度+2；支出0.75% GDP')"),'Unemployment -0.5; Stability +2; Expenditure 0.75% GDP');
assert.equal(chinese.run("translateGameText('院内支持率')"),'Chamber Support');
assert.equal(chinese.run("translateGameText('上将')"),'General');
const identities=new Set();let other=0;for(let i=0;i<1000;i++){c.source='person-'+i;const name=run("englishIdentity(source,'distribution')");identities.add(name);c.name=name;if(run('EN_OTHER_SURNAMES.includes(name.split(" ")[1])'))other++;}
assert.ok(other>70&&other<170,'occasional multicultural surnames');assert.ok(identities.size>970,'broad name pool');
run("setGameLanguage('en')");
for(const id of ['presidential','federal','aristocratic','tyranny']){
 c.targetRegime=id;run("selectedRegime=targetRegime;pendingAdmin107=true;create('english-quarter-'+targetRegime);pstate().current=null;pstate().queue=[]");
 for(let q=0;q<8;q++){
  run('advance();{let guard=0;while(pstate().current){resolvePolitical(0);if(++guard>70)throw Error("event loop")}}');
  assert.equal(run('validSave(s)'),true,id+' English quarter '+q);
  const unchanged=run('JSON.stringify(s)');run("setGameLanguage('zh');setGameLanguage('en');guideCatalog104()");assert.equal(run('JSON.stringify(s)'),unchanged,'language/search do not change simulation');
 }
}
for(const row of all)assert.doesNotMatch(row.english,/[\u3400-\u9fff]/,row.page+': '+row.source);
if(process.env.LOCALIZATION_AUDIT)fs.writeFileSync(process.env.LOCALIZATION_AUDIT,JSON.stringify(all,null,1));
console.log('PASS bilingual switching, all twelve regimes, English names, distinct parties, guide search, saves, numerical effects, rendered text coverage and 32 English quarters');
