const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
function boot(dir=root,storage={}){const nodes={},c={console,setTimeout:()=>{},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},document:{getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',style:{},showModal(){this.open=true},close(){this.open=false},addEventListener(){}})}};vm.createContext(c);for(const [,file]of fs.readFileSync(path.join(dir,'index.html'),'utf8').matchAll(/<script src="([^?]+)\?/g))vm.runInContext(fs.readFileSync(path.join(dir,file),'utf8'),c,{filename:file});return c}
const c=boot();vm.runInContext(`
function check(v,m){if(!v)throw Error(m)}function near(a,b,m){check(Math.abs(a-b)<1e-6,m+': '+a+' / '+b)}
function fresh(seed='military-tests',id='tyranny'){selectedRegime=id;pendingAdmin107=true;create(seed)}
function calm(){sits().active=sits().active.filter(x=>MINORITY_KINDS107.includes(x.kind)||x.kind==='military-transition');sits().notices=[];pstate().current=null;pstate().queue=[];pstate().ap=100;s.approval=80;s.stability=90;s.confidence=80;s.inflation=3;s.unemployment=6;s.debt=s.gdp*.3;v3().quarterOpen=false;features107().noticeCollapsed=true}
const sizes=new Set();let technologies={civilian:0,personal:0};
for(let i=0;i<100;i++){
 pendingDifficulty=i%2===0;fresh('army-world-'+i);const m=militaryState();sizes.add(m.members.length);
 check(regime().name==='军政府制'&&regime().player==='军事委员会主席','identity');check(m.members.length>=12&&m.members.length<=15,'12–15');check(m.members.filter(x=>x.faction===0).length>m.members.length*.7,'army majority');check(m.members.some(x=>x.rank==='中将')&&m.members.filter(x=>['少将','准将'].includes(x.rank)).length>=2,'rank guarantees');check(m.members.filter(x=>x.rank.includes('将')).length<m.members.length/2,'general minority');
 for(const x of m.members)if(x.view==='technocrat')technologies[x.route]++;
 check(sits().active.filter(x=>['strike','economy','scandal'].includes(x.kind)).length===(pendingDifficulty?2:1),'opening crises preserved');check(!activeSit('justice')&&activeSit('military-transition'),'opening situations');check(pstate().factions.length===3&&pstate().factions.every(x=>!x.name.includes('地方')),'three social factions');near(m.routes.committee,100,'default100');
 check(validSave(s),'new save valid '+i);const saved=JSON.stringify(s);initPolitics();assembly();overview();archive();judiciary();guideCatalog104();check(JSON.stringify(s)===saved,'pure views');s=JSON.parse(saved);initPolitics();check(validSave(s)&&JSON.stringify(s)===saved,'load stable');
 for(const view of ['factions','committee']){militaryPageView=view;const html=assembly();check(!/NaN|undefined/.test(html),'assembly text');if(view==='factions')check(!html.includes('military-seat-grid')&&!html.includes('voteBill()'),'no faction voting or chart')}
 check(snapshot().judicial===null&&!overview().includes('高独立增加审查'),'judicial hidden');check(!judiciary().includes('低于 35 时'),'old judicial rules removed');check(!constitutionalSpec('amend','competitive','enabled'),'competitive blocked');
}
check(sizes.size===4&&technologies.civilian>20&&technologies.personal>20,'all sizes and technocrat paths');console.log('PASS 100 worlds, rank/faction constraints, crises, no judicial scalar, pure rendering, round-trip saves',technologies);
fresh();calm();const m=militaryState(),member=m.members[1],candid=pstate().candidates[member.candidate],loyalty=candid.loyalty;let ap=pstate().ap,debt=s.debt;militaryMemberAct(member.id,'fund');near(pstate().ap,ap-1,'member AP');near(s.debt-debt,s.gdp*.002,'member cost');near(candid.loyalty,loyalty,'cabinet independent');check(!eligibleForCourt107(candid),'committee excluded judges');ap=pstate().ap;militaryMemberAct(member.id,'fund');near(pstate().ap,ap,'repeat blocked');
const backing=m.backing;militaryFactionAct(0,'order');check(m.backing>backing,'faction support');ap=pstate().ap;militaryFactionAct(0,'consult');near(pstate().ap,ap,'same faction once');
// All five taxes and individual views participate in support; no phantom fractional votes.
fresh();calm();m2=militaryState();for(const x of m2.members)if(!x.player)x.agenda=60;
for(const k of TAX_KEYS107){pstate().bill={kind:'budget',policies:{...s.policies}};const before=m2.members.map(x=>militaryWillingness(x));pstate().bill.policies[k]+=2;check(m2.members.some((x,i)=>Math.abs(militaryWillingness(x)-before[i])>.001),'tax considered '+k)}
pstate().bill=null;for(const x of m2.members)if(!x.player)x.agenda=0;draft={...s.policies,income:s.policies.income+1};proposeBudget();const oldIncome=s.policies.income;voteBill();near(s.policies.income,oldIncome,'minority rejected');check(pstate().bill,'failed retained');delete pstate().lastAction.vote;for(const x of m2.members)x.agenda=100;voteBill();near(s.policies.income,oldIncome+1,'budget enacted');check(!pstate().bill&&!hasUpper108(),'single actual committee approval');check(validSave(s),'budget save');
// Actual amendment workflow and court interpretation.
fresh();calm();proposeConstitution('amend','rights','equal');check(activeSit('amendment')&&pstate().bill===constitution().docket,'committee stage');for(const x of militaryState().members)x.agenda=100;constitution().judges.forEach(j=>{j.relation=100;j.boosts=[{docketId:constitution().docket.id,amount:100,until:s.q+5}]});voteConstitution();check(constitution().rights==='equal'&&!constitution().docket,'amendment enacted');check(validSave(s),'amend save');near(pstate().judicial,50,'scalar remains inactive');
s.q++;pstate().ap=100;proposeConstitution('interpret','budget','welfare');let cap=budgetCap('welfare');constitution().judges.forEach(j=>j.boosts=[{docketId:constitution().docket.id,amount:100,until:s.q+5}]);voteConstitution();near(budgetCap('welfare'),cap+1,'interpret enacted');check(validSave(s),'interpret save');
// Every transition, under its real conditions, at the boundary, preserves historical state.
for(const route of ['civilian','personal','oligarch']){
 fresh('route-'+route);calm();const m=militaryState();m.backing=85;m.militarization=route==='civilian'?50:70;m.routes={committee:12,civilian:0,personal:0,oligarch:0,[route]:88};const q=s.q,gdp=s.gdp,history=s.history.length,ap=pstate().ap;const x=activeSit('military-transition');situationAct(x.id,route);
 check(regime().id===({civilian:'symbolic',personal:'absolute',oligarch:'aristocratic'})[route],'target '+route);check(!activeSit('military-transition')&&m.resolved===route,'finished');near(s.q,q,'time preserved');near(s.gdp,gdp,'GDP preserved');near(pstate().ap,ap-1,'one action');check(s.history.length===history,'history preserved');check(snapshot().judicial!==null,'judiciary restored');check(validSave(s),'transition save '+route);
 if(route==='civilian')check(hasUpper108()&&!bicameral108().upper.formed,'symbolic senate unformed');if(route==='oligarch')check(houses()&&familyRulesActive(),'family systems');check(startSituation('justice')!==null,'justice restored');check(validSave(s),'post transition crisis save');
}
fresh();calm();militaryState().militarization=70;const apGate=pstate().ap;check(unavailable(activeSit('military-transition'),{key:'civilian'}),'condition blocked');situationAct(activeSit('military-transition').id,'civilian');near(pstate().ap,apGate,'no cost if blocked');militaryMove('civilian',40,'test');militaryMove('personal',40,'test');militaryMove('oligarch',90,'test');near(Object.values(militaryState().routes).reduce((n,x)=>n+x,0),100,'reallocation sum');near(militaryState().routes.oligarch,90,'no dead-end split');
// Quarter risk, exact once, zero support defeat, admin immunity.
fresh();calm();militaryState().backing=19;militaryState().militarization=50;s.policies.security=4;s.q++;const st=s.stability,app=s.approval;militaryQuarter();near(s.stability,st-3,'low backing stability');near(s.approval,app-1,'low backing approval');militaryQuarter();near(s.stability,st-3,'once');militaryState().backing=0;checkPoliticalEnd();check(!s.ended,'admin immunity');s.adminMode=false;checkPoliticalEnd();check(!!s.ended,'zero backing defeat');
// Three regular events plus additional military report, no AP for replies.
fresh();calm();s.q=1;v3().quarterOpen=true;queueQuarterEvents();const all=[pstate().current,...pstate().queue].filter(Boolean);check(all.filter(x=>!x.constitutionalSpecial).length===3,'three base events');check(all.some(x=>x.type==='military-politics'&&x.constitutionalSpecial),'military extra');let turns=0;const eventAp=pstate().ap;while(pstate().current){resolvePolitical(0);check(++turns<40,'queue bounded')}near(pstate().ap,eventAp,'event no AP');check(validSave(s),'event save');
// Reform rewards only on completion; no repeats on reload.
fresh();calm();const r=REFORMS.findIndex(r=>r.key==='digital');s.reforms.push({id:r,key:'digital',ready:s.q+1,boost:0,completed:false,effectsApplied:false});completeReforms();near(militaryState().routes.civilian,0,'not started reward');s.q++;completeReforms();near(militaryState().routes.civilian,8,'completion route');completeReforms();near(militaryState().routes.civilian,8,'no duplicate reward');check(validSave(s),'completed save');
// Real quarter loop with event choices and save validation.
for(const id of ['tyranny','presidential','absolute','aristocratic','party','federal']){
 fresh('long-'+id,id);if(id==='tyranny')calm();else{pstate().current=null;pstate().queue=[]}for(let q=0;q<12;q++){advance();let n=0;while(pstate().current){resolvePolitical(0);check(++n<70,'bounded real quarter')}check(validSave(s),'real quarter save '+id+' '+s.q)}
}
console.log('PASS interactions, tax-sensitive ballots, amendments, interpretations, three transitions, failure, event quotas, reforms, 72 real quarters');
`,c);
// Public schema must reject malformed military records without harming valid base saves.
const data=vm.runInContext('fresh();JSON.parse(JSON.stringify(s))',c);for(const mutate of [v=>v.military.routes.civilian=99,v=>v.military.members[1].rank='上将',v=>v.military.members[1].agenda=NaN,v=>v.military.backing=-1]){const bad=structuredClone(data);mutate(bad);c.bad=bad;if(vm.runInContext('validSave(bad)',c))throw Error('invalid military accepted')}
console.log('PASS malformed saves rejected');
vm.runInContext(`
// Ordinary laws require strictly more than half of actual committee members.
for(let i=0;;i++){fresh('tie-'+i);if(militaryState().members.length%2===0)break}
calm();const even=militaryState().members;even.forEach((x,i)=>x.agenda=i<even.length/2?100:0);draft={...s.policies,income:s.policies.income+1};proposeBudget();near(militaryTally().rate,50,'exact half');const tax=s.policies.income;voteBill();near(s.policies.income,tax,'tie rejected');check(pstate().bill,'tie proposal retained');
// Amendment fails after the three-quarter review deadline when no judge supports it.
fresh('review-fail');calm();proposeConstitution('amend','rights','equal');const beforeRights=constitution().rights;
for(const x of militaryState().members)x.agenda=100;
constitution().judges.forEach(j=>{j.relation=0;j.boosts=[{docketId:constitution().docket.id,amount:-100,until:100}]});voteConstitution();check(constitution().docket.stage==='review','review entered');s.q=constitution().docket.reviewDeadline;checkAmendmentReview107();check(!constitution().docket&&!activeSit('amendment')&&constitution().rights===beforeRights,'deadline failure');check(validSave(s),'failure save');
fresh('not-military','presidential');check(startSituation('military-transition')===null,'exclusive situation');
// The full standard span can run with the extra military event and ongoing state.
fresh('military-full48');calm();for(let q=0;q<48;q++){advance();let n=0;while(pstate().current){resolvePolitical(0);check(++n<70,'full span queue bounded')}check(validSave(s),'48-quarter save '+s.q)}
console.log('PASS tied vote, amendment deadline, exclusive situation, 48-quarter simulation');
`,c);
// Optional integration against a separately checked-out previous release.
if(process.env.MILITARY_LEGACY_ROOT){
 const old=boot(process.env.MILITARY_LEGACY_ROOT);
 for(const variant of ['plain','pending-amendment','judicial-career']){
  old.variant=variant;
  const state=vm.runInContext(`selectedRegime='tyranny';pendingAdmin107=true;create('old-army-'+variant);pstate().ap=100;if(variant==='pending-amendment')proposeConstitution('amend','competitive','enabled');if(variant==='judicial-career'){departJudge107(0,'主动退休');const pick=judicialNominees107()[0];appointJudge107(0,pick.key)}JSON.parse(JSON.stringify(s))`,old);
  c.legacy=state;vm.runInContext(`{check(validSave(legacy),'legacy accepted');s=legacy;initPolitics();check(validSave(s)&&militaryActive(),'legacy migrated');check(!amendmentInProgress107()||amendmentInProgress107().action!=='competitive','legacy competitive closed');const saved=JSON.stringify(s);initPolitics();check(saved===JSON.stringify(s),'legacy idempotent');}`,c);
 }
 console.log('PASS real previous-release saves migrated');
}

const cold=boot();cold.savedMilitary=data;if(!vm.runInContext('validSave(savedMilitary)',cold))throw Error('cold-start military save rejected');
console.log('PASS save validation before game state is assigned');
