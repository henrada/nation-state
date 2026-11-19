const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function boot(storage={}){
 const nodes={},ctx={console,setTimeout(){},localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},document:{getElementById:id=>nodes[id]??={innerHTML:'',textContent:'',style:{},showModal(){this.open=true},close(){this.open=false},addEventListener(){}}}};
 vm.createContext(ctx);for(const [,file]of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^?]+)\?/g))vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
 const run=code=>vm.runInContext(code,ctx);
 run(`
 function check(v,m){if(!v)throw Error(m)}
 function near(a,b,m){check(Math.abs(a-b)<1e-7,m+': '+a+' / '+b)}
 function freshCabinet(id='presidential',chambers='one'){
  selectedRegime=id;pendingChambers=chambers;pendingAdmin107=true;create('cabinet-government-'+id+'-'+chambers);
  pstate().current=null;pstate().queue=[];sits().notices=[];pstate().ap=40;s.approval=80;s.stability=90;v3().quarterOpen=false;
 }
 function draftBudget(){pstate().bill=null;draft={...s.policies,income:s.policies.income+1};proposeBudget()}
 const actualBudgetRate=billPassRate104,actualUpperRate=upperSupport108;
 function ballot(rate){billPassRate104=()=>rate;delete pstate().lastAction.vote;voteBill();billPassRate104=actualBudgetRate}
 `);return {run,storage};
}
const b=boot(),run=b.run;
run(`
let seenTraits=new Set();
for(const language of ['zh','en'])for(const r of REGIMES)for(let seed=0;seed<5;seed++){
 gameLanguage=language;selectedRegime=r.id;pendingAdmin107=true;create('platforms-'+r.id+'-'+seed);
 const p=pstate();check(validSave(s),'new world validates '+r.id);
 for(const f of p.factions){const traits=factionProfile(f).traits;
  if(r.democratic){check(new Set(traits).size>=2&&!traits.includes(1),'two compatible outlooks, no law reform');check(f.ideologyLabel===factionProfile(f).name,'visible platform label');traits.forEach(t=>seenTraits.add(t))}
  else check(!f.platform&&traits.every(t=>t<9),'original nondemocratic groups');
 }
 for(const c of [...p.candidates,...p.members,...judicialStaff107().reserve])if(!c.judicialCareer){
  check(r.democratic?factionProfile(p.factions[c.faction]).traits.includes(c.trait):c.trait<9,'people match party platform');
 }
 check(v3().offers.length===6&&v3().offers.every(o=>reformPlatformEligible(REFORMS[o.catalog])),'six valid opening drafts '+r.id);
 check(v3().offers.some(o=>REFORMS[o.catalog].platformAccess),'opening has distinctive reform '+r.id);
 const saved=JSON.stringify(s);initPolitics();check(JSON.stringify(s)===saved,'initialization is idempotent '+r.id);
 if(seed===0){const guides=guideCatalog104();check(guides.some(e=>e.id==='trait-法治改革派')===!r.democratic,'guide law-reform availability');
  if(language==='en')for(const id of ['annual-budget','party-platform','reform-platform'])check(!/[\\u3400-\\u9fff]/.test(guides.find(e=>e.id===id).text),'English rule '+id);
 }
}
for(let i=9;i<16;i++)check(seenTraits.has(i),'new outlook sampled '+i);
gameLanguage='zh';
for(const chambers of ['one','two']){
 freshCabinet('presidential',chambers);draftBudget();ballot(0);check(annualBudgetAvailable(),'failed lower vote preserves opportunity');
 ballot(100);if(chambers==='two'){check(annualBudgetAvailable(),'referral not final approval');upperSupport108=()=>100;upperReview108();upperSupport108=actualUpperRate}
 check(!annualBudgetAvailable(),'approved budget consumes year');const actual=JSON.stringify(s.policies),ap=pstate().ap;
 for(let q=1;q<6;q++){s.q=q;draft={...s.policies,income:30};proposeBudget();check(!pstate().bill&&!annualBudgetAvailable(),'locked until next calendar year');check(JSON.stringify(s.policies)===actual&&pstate().ap===ap,'blocked proposal inert')}
 s.q=6;check(annualBudgetAvailable(),'six-quarter calendar boundary unlocks');draftBudget();ballot(100);if(chambers==='two'){upperSupport108=()=>100;upperReview108();upperSupport108=actualUpperRate}check(!annualBudgetAvailable(),'next year has one adjustment');check(validSave(s),'annual budget valid');save();
}
// A presidential lower-house override consumes the approval year only, not the implementation year.
freshCabinet('presidential','two');institutions().partySystem='multi';s.q=5;draftBudget();ballot(100);
upperSupport108=()=>0;upperReview108();upperSupport108=actualUpperRate;check(annualBudgetAvailable(),'returned bill remains retryable');ballot(100);
check(bicameral108().delayed.length===1&&!annualBudgetAvailable(),'delayed approval reserves year');
const delayedBudget=bicameral108().delayed[0];check(delayedBudget.annualBudgetYear===0,'record approval year');
s.q=7;enactOrdinary108(delayedBudget);check(annualBudgetAvailable()&&s.annualBudget.years.length===1,'cross-year enactment not charged twice');
// Migration derives used years from actual player budget decisions, not starting policies.
freshCabinet();check(s.annualBudget.years.length===0,'opening budget consumes no opportunity');draftBudget();ballot(100);delete s.annualBudget;initializeAnnualBudget();check(!annualBudgetAvailable(),'previously enacted budget remains used after migration');
const entry=pstate().factions[playerFactionId107()];entry.name='社会民主党';delete entry.platform;initializePartyPlatforms();synchronizePlatformOffers();
const inherit=REFORMS.findIndex(r=>r.key==='inheritance');check(reformPlatformEligible(REFORMS[inherit]),'social democracy permits inheritance levy');
const existing={id:inherit,key:'inheritance',ready:s.q+2,boost:0,completed:false,effectsApplied:false};s.reforms.push(existing);
entry.name='自由意志党';delete entry.platform;initializePartyPlatforms();synchronizePlatformOffers();
check(!reformPlatformEligible(REFORMS[inherit]),'libertarian platform excludes inheritance levy');
check(reformPlatformEligible(REFORMS.find(r=>r.key==='enterprise-entry')),'libertarian distinctive reform');
check(s.reforms.includes(existing)&&v3().offers.every(o=>REFORMS[o.catalog].key!=='inheritance'),'running reform preserved, incompatible drafts removed');
const bad={uid:v3().nextOffer++,catalog:inherit,kept:false,cycle:v3().cycle};v3().offers.push(bad);pstate().bill=null;submitReform(bad.uid);check(!pstate().bill,'direct submission cannot bypass eligibility');
v3().offers=v3().offers.filter(o=>o!==bad);const keep=v3().offers[0];keep.kept=true;makeReformOffers();check(v3().offers.includes(keep)&&v3().offers.every(o=>reformPlatformEligible(REFORMS[o.catalog])),'refresh preserves eligible viewed drafts');
for(const x of [-1,1.5,999,'1']){const copy=JSON.parse(JSON.stringify(s));copy.annualBudget.years=[x];check(!validSave(copy),'invalid annual year rejected')}
`);
const restored=boot(b.storage);restored.run(`check(validSave(s)&&!annualBudgetAvailable(),'annual quota survives reload')`);
console.log('PASS policy platforms: 120 bilingual worlds, all new outlooks, regime isolation, six drafts, reform eligibility, annual boundaries, delayed budgets and save migration.');
