const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function boot(storage={}){
 const nodes={},ctx={console,setTimeout(){},localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},document:{getElementById:id=>nodes[id]??={innerHTML:'',textContent:'',style:{},showModal(){this.open=true},close(){this.open=false},addEventListener(){}}}};
 vm.createContext(ctx);for(const [,file]of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^?]+)\?/g))vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
 const run=code=>vm.runInContext(code,ctx);
 run(`
 function check(v,m){if(!v)throw Error(m)}
 function near(a,b,m){check(Math.abs(a-b)<1e-7,m+': '+a+' / '+b)}
 function freshCabinet(id='semi',chambers='one'){
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
// All systems receive only the offices they can appoint, in both languages.
for(const language of ['zh','en'])for(const r of REGIMES){
 gameLanguage=language;freshCabinet(r.id);const deputy=!r.head&&r.id!=='federal';
 check(cabinetSlots103().includes('deputy')===deputy,'slot availability '+r.id);
 check(Object.hasOwn(pstate().cabinet,'deputy')===deputy,'opening appointments '+r.id);
 check(Object.keys(pstate().cabinet).length===cabinetSlots103().length,'no hidden offices '+r.id);
 check(validSave(s),'valid opening state '+r.id);
 const html=cabinet(),entries=guideCatalog104();
 check(html.includes("cabinetSlot='deputy'")===deputy,'visible deputy '+r.id);
 if(r.id!=='federal')check(entries.some(e=>e.id==='office-deputy'),'guide explains deputy eligibility '+r.id);
 if(language==='en')for(const id of ['cabinet-tenure','cabinet-dismissal-cost','cabinet-leadership'])check(!/[\\u3400-\\u9fff]/.test(entries.find(e=>e.id===id).text),'English rule '+id);
}
gameLanguage='zh';freshCabinet();
for(const slot of cabinetSlots103()){
 const before=JSON.stringify(pstate().cabinet),ap=pstate().ap;
 const replacement=pstate().candidates.find(c=>cabinetEligible(c)&&!Object.values(pstate().cabinet).some(x=>x?.candidate===c.id));
 dismissPreview(slot);dismissOfficial(slot);replacementDialog(slot);appointPreview(slot,replacement.id);appointOfficial(slot,replacement.id);
 check(before===JSON.stringify(pstate().cabinet)&&pstate().ap===ap,'all removal/replacement entry points protected '+slot);
 check(!/onclick="(?:dismissPreview|replacementDialog)/.test(officialPanel(slot)),'no active removal controls '+slot);
 cabinetSlot=slot;check(!cabinet().includes('候选人名册'),'no replacement roster '+slot);
}
const scandal=startSituation('scandal');check(!situationActions(scandal).some(a=>a.key==='dismiss'),'scandal cannot bypass protection');
const scandalBefore=JSON.stringify(s);situationAct(scandal.id,'dismiss');check(scandalBefore===JSON.stringify(s),'direct scandal action blocked');
// Institutional resignations still apply, and the president can fill vacancies.
const oldHead=pstate().cabinet.head.candidate;removeOfficial('head');check(!pstate().cabinet.head,'institutional resignation works');
const candidate=pstate().candidates.find(c=>cabinetEligible(c)&&c.id!==oldHead&&!Object.values(pstate().cabinet).some(x=>x?.candidate===c.id));
const ap=pstate().ap;appointOfficial('head',candidate.id);check(pstate().cabinet.head.candidate===candidate.id&&pstate().ap===ap-1,'vacancy appointment costs one AP');

for(const chambers of ['one','two'])for(const choice of [0,1]){
 freshCabinet('semi',chambers);draftBudget();ballot(0);check(pstate().budgetDefeats===1,'first defeat');
 const ap=pstate().ap;billPassRate104=()=>0;voteBill();billPassRate104=actualBudgetRate;
 check(pstate().budgetDefeats===1&&pstate().ap===ap,'repeat click is not another ballot');
 ballot(0);check(pstate().budgetDefeats===2&&!cabinetConfidencePending(),'second defeat');
 const count=v3().eventsChosen;ballot(0);check(pstate().current?.type===CABINET_CONFIDENCE_EVENT,'third defeat triggers motion');
 const stable=JSON.stringify(s);voteBill();upperReview108();check(stable===JSON.stringify(s),'pending motion blocks further votes');
 check(validSave(s),'pending motion validates');
 const approval=s.approval,government=JSON.stringify(pstate().cabinet),proposal=JSON.stringify(rules103().proposals),actions=pstate().ap,policies=JSON.stringify(s.policies);
 resolvePolitical(choice);
 check(v3().eventsChosen===count,'motion is extra, not one of three regular events');
 check(pstate().ap===actions&&pstate().budgetDefeats===0,'motion uses no AP and resets streak');
 check(JSON.stringify(s.policies)===policies&&JSON.stringify(rules103().proposals)===proposal,'budget and department projects survive');
 if(choice===0){check(Object.values(pstate().cabinet).every(x=>x===null),'entire cabinet vacated');near(s.approval,approval,'no stacked individual dismissal approval costs');check(cabinet().includes('候选人名册'),'new cabinet can be appointed')}
 else{check(JSON.stringify(pstate().cabinet)===government,'cabinet retained');near(s.approval,approval-8,'refusal approval penalty')}
 check(validSave(s),'post-motion save valid');
}

// Reforms neither increment nor erase the budget streak; withdrawal also preserves it.
freshCabinet();draftBudget();ballot(0);withdrawBill();
submitReform(v3().offers[0].uid);ballot(0);check(pstate().budgetDefeats===1,'failed reform excluded');
ballot(100);check(pstate().budgetDefeats===1,'passed reform excluded');
draftBudget();ballot(100);check(pstate().budgetDefeats===0,'enacted unicameral budget clears streak');

// A bicameral budget clears the streak only after enactment; an upper return is a defeat.
freshCabinet('semi','two');draftBudget();ballot(0);ballot(100);check(pstate().budgetDefeats===1,'referral is not enactment');
upperSupport108=()=>0;upperReview108();upperSupport108=actualUpperRate;check(pstate().budgetDefeats===2&&pstate().bill.chamber108.stage==='returned','upper return counted once');
upperReview108();check(pstate().budgetDefeats===2,'review cannot be repeated on returned bill');
ballot(100);check(pstate().budgetDefeats===0&&!pstate().bill,'lower override enacts budget and resets');
draftBudget();ballot(0);ballot(100);upperSupport108=()=>100;upperReview108();upperSupport108=actualUpperRate;check(pstate().budgetDefeats===0,'upper approval clears streak');

// The third defeat can occur in the upper house, and respects the existing event queue.
freshCabinet('semi','two');draftBudget();ballot(0);ballot(0);ballot(100);
pstate().current=eventFrom('已有事件','等待答复',[option('确认','')]);
upperSupport108=()=>0;upperReview108();upperSupport108=actualUpperRate;
check(pstate().current.title==='已有事件'&&pstate().queue.filter(e=>e.type===CABINET_CONFIDENCE_EVENT).length===1,'no overwriting/doubling events');
resolvePolitical(0);check(pstate().current.type===CABINET_CONFIDENCE_EVENT,'queued motion delivered');save();
`);
// Real storage reload retains the unanswered motion and applies exactly once.
const restored=boot(b.storage);restored.run(`
check(pstate().current?.type===CABINET_CONFIDENCE_EVENT&&validSave(s),'motion survives reload');
const initial=s.approval;resolvePolitical(1);near(s.approval,initial-8,'restored refusal applies once');
resolvePolitical(1);near(s.approval,initial-8,'second reply cannot apply twice');
`);
run(`
// Existing saves lose the obsolete role without dismissal costs or replayed project rewards.
freshCabinet('absolute');const person=pstate().candidates.find(c=>!Object.values(pstate().cabinet).some(x=>x?.candidate===c.id));
pstate().cabinet.deputy={candidate:person.id,task:'balanced'};
rules103().proposals.deputy={progress:100,completed:true,spent:5,actions:[],rewardApplied:{stability:1,confidence:2}};
cabinetSlot='deputy';const stability=s.stability,relations=JSON.stringify(pstate().factions),project=JSON.stringify(rules103().proposals.deputy);
initPolitics();check(!Object.hasOwn(pstate().cabinet,'deputy')&&cabinetSlot==='head','legacy deputy removed');
near(s.stability,stability,'migration has no dismissal cost');check(JSON.stringify(pstate().factions)===relations,'relations preserved');
check(JSON.stringify(rules103().proposals.deputy)===project,'completed history retained');
const migratedCabinetState=JSON.stringify(s);initPolitics();check(JSON.stringify(s)===migratedCabinetState&&validSave(s),'migration idempotent and valid');
freshCabinet('presidential');pstate().cabinet.deputy={candidate:person.id,task:'balanced'};rules103().proposals.deputy={progress:10,completed:false,spent:2,actions:[]};
initPolitics();check(!Object.hasOwn(pstate().cabinet,'deputy')&&!rules103().proposals.deputy,'inactive deputy has no unfinished work or vacancy penalty');

for(const id of ['tyranny','aristocratic','theorepublic','absolute','presidential'])for(const slot of ['head','education']){
 freshCabinet(id);const c=pstate().candidates[pstate().cabinet[slot].candidate];c.achievements=0;pstate().factions[c.faction].relation=80;
 const base=dismissalImpactBeforeCabinetGovernment(slot),cost=dismissalImpact(slot),extra=['tyranny','aristocratic','theorepublic'].includes(id);
 near(cost.relation,base.relation-(extra?(slot==='head'?10:5):0),'targeted relation cost '+id);
 near(cost.stability,base.stability-(extra?(slot==='head'?4:2):0),'targeted stability cost '+id);
 const before=s.stability,ap=pstate().ap;dismissOfficial(slot);
 check(pstate().cabinet[slot]===null&&pstate().ap===ap-1,'dismissal executed '+id);
 near(s.stability,before+cost.stability,'stability charged exactly once '+id);
 near(pstate().factions[c.faction].relation,80+cost.relation,'only dismissed faction charged '+id);
 check(validSave(s),'dismissal save validates '+id);
}
for(const id of ['tyranny','aristocratic','theorepublic']){
 freshCabinet(id);const slot='education',old=pstate().candidates[pstate().cabinet[slot].candidate];
 const next=pstate().candidates.find(c=>cabinetEligible(c)&&c.faction!==old.faction&&!Object.values(pstate().cabinet).some(x=>x?.candidate===c.id));
 const cost=dismissalImpact(slot),stabilityBefore=s.stability;for(const f of pstate().factions)f.relation=60;
 appointOfficial(slot,next.id);check(pstate().cabinet[slot].candidate===next.id,'replacement succeeds '+id);
 near(s.stability,stabilityBefore+cost.stability,'replacement pays stability cost '+id);
 near(pstate().factions[old.faction].relation,60+cost.relation,'old faction pays dismissal cost '+id);
 near(pstate().factions[next.faction].relation,64,'new faction gets appointment bonus '+id);
}
freshCabinet('presidential');draftBudget();ballot(0);ballot(0);ballot(0);check(!cabinetConfidencePending(),'other constitutions retain their rules');
for(const invalid of [-1,3,1.5,'2',null]){const copy=JSON.parse(JSON.stringify(s));copy.political.budgetDefeats=invalid;check(!validSave(copy),'invalid budget counter rejected')}
`);
console.log('PASS cabinet government: 24 bilingual worlds, protected tenure, vacancy appointments, both chambers, confidence choices/queue/reload, deputy cleanup, exact dismissal costs.');
