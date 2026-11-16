const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function boot(storage={}){
 const nodes={},ctx={console,setTimeout(){},localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},document:{getElementById:id=>nodes[id]??={innerHTML:'',textContent:'',style:{},showModal(){this.open=true},close(){this.open=false},addEventListener(){}}}};
 vm.createContext(ctx);for(const [,file]of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^?]+)\?/g))vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
 const run=code=>vm.runInContext(code,ctx);
 run(`function freshInvestment(id='presidential'){
  selectedRegime=id;pendingAdmin107=true;create('public-investment-'+id);pstate().current=null;pstate().queue=[];sits().notices=[];pstate().ap=30;
 }`);return {ctx,run,storage};
}
const near=(a,b)=>assert(Math.abs(a-b)<1e-8,a+' vs '+b);
for(const language of ['zh','en']){
 const b=boot({'nation-state-language':language});
 for(const id of b.run('REGIMES.map(r=>r.id)')){
  b.ctx.targetRegime=id;b.run('freshInvestment(targetRegime)');
  assert(b.run('!("sports" in v3())&&!("culture" in v3())'),'no retired state');
  assert(b.run('!consoleFields107().some(f=>["governance.sports","governance.culture"].includes(f.key))'),'no console sliders');
  assert(b.run('!guideCatalog104().some(e=>["sports","culture"].includes(e.id))'),'no retired guide concepts');
  assert(b.run('guideMatches104("国家体育").some(e=>e.id==="reform-sports")'),'sport reform still searchable');
  assert(b.run('guideMatches104("国家文化").some(e=>e.id==="reform-culture")'),'culture reform still searchable');
  for(const fn of ['policies','cabinet','archive','situationsPage']){
   b.ctx.fn=fn;assert.doesNotMatch(b.run('globalThis[fn]()'),/体育基础|文化基础|olympicBid/,'no raw metric in '+fn);
  }
  const entries=b.run('guideCatalog104()');
  for(const entry of entries){assert.doesNotMatch(entry.title+' '+entry.text,/体育基础|文化基础/);if(/国际奥委会|本季度增长压力/.test(entry.text)){b.ctx.copy=entry.text;assert.doesNotMatch(b.run('translateGameText(copy)'),language==='en'?/[\u3400-\u9fff]/:/$^/,'translated '+entry.id)}}
  b.run('mod(REFORMS.find(r=>r.key==="sports").values)');near(b.run('olympicInvitationChance()'),.07);
  const copy=b.run('impactText(REFORMS.find(r=>r.key==="sports").values)');assert.match(copy,/提高国际奥委会/);assert.doesNotMatch(copy,/评价\s*[+＋\d]|基础/);
  b.run('mod(REFORMS.find(r=>r.key==="culture").values)');near(b.run('s.effects.at(-1).growth'),.2);assert.equal(b.run('s.effects.at(-1).duration'),6);
  assert(b.run('validSave(s)'),'new state valid');
 }
}
// Verify probability changes in the real invitation path, not only in descriptions.
let b=boot();b.run(`freshInvestment();s.q=12;s.approval=80;s.stability=85;
 sits().active=[];Object.assign(constitution().minority,{status:'resolved',resolution:'amendment',resolvedQ:s.q});
 const realRand=rand;rand=()=>.03;randomSituations();rand=realRand;
`);
assert(!b.run('sits().notices.some(e=>e.situationAction==="olympic-bid")'),'baseline 2% does not accept roll 3%');
b.run('mod({olympicBid:.05});rand=()=>.03;randomSituations();rand=realRand;flushNotices()');
assert.equal(b.run('pstate().current.situationAction'),'olympic-bid','sport decision changes actual invitation outcome');
b.run('resolvePolitical(0)');assert(b.run('sits().olympicsApplied&&!!activeSit("olympics")'),'accepted bid starts preparation');
b.run('situationAct(activeSit("olympics").id,"cancel");pstate().current=null;pstate().queue=[];sits().notices=[];s.q+=12;mod({olympicBid:99});rand=()=>.03;randomSituations();rand=realRand');
near(b.run('olympicInvitationChance()'),.27);assert(!b.run('sits().notices.some(e=>e.situationAction==="olympic-bid")'),'one bid per game retained');
// Generated sports/culture events and preparedness choices must use only the new effects.
b.run('freshInvestment();s.stability=90');const found=new Set();
for(let i=0;i<1000&&found.size<3;i++){
 const e=b.run('extraEvent()');if(!['culture','sports','preparedness'].includes(e.type))continue;
 found.add(e.type);assert.doesNotMatch(JSON.stringify(e),/体育基础|文化基础|"sports":|"culture":/);
}
assert.equal(found.size,3,'all relevant event families generated');
// Old balances and pending effects are converted once; history does not acquire fictional growth.
b=boot();b.run(`freshInvestment();delete v3().publicInvestmentRules;delete v3().olympicBidBonus;
 v3().sports=4;v3().culture=7;s.effects=[];
 pstate().current=eventFrom('旧文化活动','举办文化活动',[option('拨款','支出 0.3% GDP；文化基础 +1；体育基础 +2。',{cost:.3,culture:1,sports:2})],'culture');
 s.logs.unshift({q:s.q,title:'文化活动记录',text:'支持 +2；文化基础 +1。'});
 s.rules103.proposals.culture.rewardApplied={approval:4,culture:1};
`);
assert(b.run('validSave(s)'),'previous format accepted');
const stats=b.run('JSON.stringify([s.q,s.rng,s.debt,s.approval,s.stability])');b.run('initPolitics()');
assert.equal(b.run('JSON.stringify([s.q,s.rng,s.debt,s.approval,s.stability])'),stats,'migration does not replay outcomes');
near(b.run('olympicInvitationChance()'),.12);assert.equal(b.run('s.effects.length'),0,'no retroactive growth');
assert(b.run('!("sports" in v3())&&!("culture" in v3())'),'old balances removed');
near(b.run('pstate().current.options[0].values.growth'),.1);near(b.run('pstate().current.options[0].values.olympicBid'),.05);
assert.doesNotMatch(b.run('pstate().current.options[0].detail'),/体育基础|文化基础/);
b.run('setGameLanguage("en")');assert.doesNotMatch(b.run('translateGameText(pstate().current.options[0].detail)'),/[\u3400-\u9fff]/,'converted pending choice is translated');
assert.doesNotMatch(b.run('s.logs[0].text'),/文化基础|增长压力/,'historical award not relabelled as growth');
assert(b.run('!("culture" in rules103().proposals.culture.rewardApplied)&&!("growth" in rules103().proposals.culture.rewardApplied)'));
const once=b.run('JSON.stringify(s)');b.run('initPolitics()');assert.equal(b.run('JSON.stringify(s)'),once,'idempotent conversion');
b.run('resolvePolitical(0)');near(b.run('olympicInvitationChance()'),.17);near(b.run('s.effects.at(-1).growth'),.1);
b.run('save()');const saved=b.storage['nation-state-v1'],again=boot({...b.storage});again.run('bootGame()');
assert.equal(again.run('JSON.stringify(s)'),saved,'exact reload after conversion');
// The published encyclopedia must not expose the removed statistics.
for(const file of fs.readdirSync(path.join(root,'wiki/data')).filter(f=>f.endsWith('.json')))assert.doesNotMatch(fs.readFileSync(path.join(root,'wiki/data',file),'utf8'),/体育基础|文化基础/,'wiki '+file);
console.log('PASS public investments: 24 bilingual worlds, no retired stats/controls/articles, real Olympic odds and one-bid limit, bounded bonuses, cultural growth, all event families and lossless pending-choice migration.');
