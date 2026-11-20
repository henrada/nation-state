/* Annual budgets and democratic party platforms. Stable numeric IDs preserve saves. */
const DEMOCRATIC_TRAITS=[
 ['绿色经济',5,'以清洁能源、绿色就业和生态投资推动经济转型。',{green:4,welfare:2,market:-1}],
 ['左翼民粹主义',3,'强调再分配、民众动员与对经济精英的约束。',{welfare:4,populism:4,elite:-3}],
 ['右翼民粹主义',4,'强调国家认同、社会秩序与本土产业保护。',{nation:4,populism:4,authority:2}],
 ['技术官僚',2,'重视专业行政、科研投入、项目评估与财政效率。',{elite:3,market:1,law:1}],
 ['自由主义建制派',1,'维护代议制度、司法制衡和开放的市场秩序。',{law:3,authority:-2,market:2}],
 ['民主社会派',7,'通过民主程序扩大劳动者参与、公共服务和社会所有。',{welfare:4,market:-3,law:2}],
 ['软威权主义',6,'保留选举制度，同时扩大行政协调与集中决策的权力。',{authority:3,law:-2,elite:2}]
];
for(const [offset,[name,base,desc,axes]]of DEMOCRATIC_TRAITS.entries()){
 const id=9+offset;TRAITS[id]={...TRAITS[base],name,desc};TRAIT_AXES[id]=axes;METHODS[id]=name+'施政方案';
 PROGRAMME_STYLE107[id]=JSON.parse(JSON.stringify(PROGRAMME_STYLE107[base]));
 for(const [key,texts]of Object.entries(PROGRAMME_TEXT107)){
  const parts=texts[base].split('|');parts[0]=name+'：'+parts[0];texts[id]=parts.join('|');
 }
 JUDGE_TRAIT_PATHS107[id]=JSON.parse(JSON.stringify(JUDGE_TRAIT_PATHS107[base]));
}
function legacyPoliticalTrait(id){return id>=9?DEMOCRATIC_TRAITS[id-9]?.[1]??0:id}
function availablePoliticalTraits(){return TRAITS.map((_,i)=>i).filter(i=>regime().democratic?i!==1:i<9)}
const DEMOCRATIC_PLATFORMS={
 conservative:{base:'conservative',traits:[0,11,4]},
 moderate:{base:'conservative',traits:[0,15]},
 liberal:{base:'market',traits:[8,13,2]},
 libertarian:{base:'market',traits:[8,12]},
 social:{base:'social',traits:[5,14,3]},
 labour:{base:'social',traits:[5,10,7]},
 civil:{base:'law',traits:[13,0]},
 local:{base:'local',traits:[0,11]},
 rural:{base:'local',traits:[0,10,3]},
 green:{base:'green',traits:[9,14]},
 greenSocial:{base:'green',traits:[9,5,7]},
 technocratic:{base:'reform',traits:[12,13]},
 developmental:{base:'state',traits:[12,15,6]}
};
const PLATFORM_BUDGETS={9:{education:2,infrastructure:.5,health:1,security:-1},10:{welfare:3,health:2,security:-.5},11:{security:2,infrastructure:1,education:-.5},12:{education:2,infrastructure:2,welfare:-.5},13:{education:1,health:1,security:-1},14:{welfare:3,health:2,education:1},15:{security:2,infrastructure:2}};
for(const [key,p]of Object.entries(DEMOCRATIC_PLATFORMS)){
 const base=FACTION_PROFILES103[p.base],budget={...base.budget};
 for(const trait of p.traits)for(const [k,v]of Object.entries(PLATFORM_BUDGETS[trait]||{}))budget[k]=((budget[k]||0)+v)/2;
 p.profileKey='platform-'+key;
 FACTION_PROFILES103[p.profileKey]={name:p.traits.map(t=>t===8?'新自由主义':TRAITS[t].name).join(' · '),traits:[...p.traits],budget};
 REGIONAL_AFFINITIES107[p.profileKey]=[...REGIONAL_AFFINITIES107[p.base]];
 FACTION_TAX_PREFERENCES107[p.profileKey]={...FACTION_TAX_PREFERENCES107[p.base]};
 PARTY_COLORS107[p.profileKey]=PARTY_COLORS107[p.base];
}
const factionProfileBeforePlatforms=factionProfile;
factionProfile=function(f){return regime().democratic&&DEMOCRATIC_PLATFORMS[f.platform]?FACTION_PROFILES103[DEMOCRATIC_PLATFORMS[f.platform].profileKey]:factionProfileBeforePlatforms(f)};
const factionColorBeforePlatforms=factionColorKey107;
factionColorKey107=function(f){const key=factionColorBeforePlatforms(f),platform=Object.values(DEMOCRATIC_PLATFORMS).find(p=>p.profileKey===key);return platform?platform.base:key};
function chooseDemocraticPlatform(f){
 const base=factionProfileBeforePlatforms(f),key=Object.keys(FACTION_PROFILES103).find(k=>FACTION_PROFILES103[k]===base)||'conservative';
 if(/自由意志/.test(f.name))return 'libertarian';
 if(/社会民主|社会公正|工党|劳动/.test(f.name))return /人民|劳动/.test(f.name)?'labour':'social';
 if(/绿|生态/.test(f.name))return pick(['green','greenSocial']);
 return {market:'liberal',social:'social',law:'civil',local:/农民|乡村/.test(f.name)?'rural':'local',green:'green',reform:'technocratic',state:'developmental',conservative:regime().id==='federal'?'moderate':'conservative',religious:'conservative'}[key]||'conservative';
}
function initializePartyPlatforms(){
 const p=pstate();if(!p)return;
 for(const f of p.factions){
  if(!regime().democratic){if(f.platform){delete f.platform;delete f.platformName;delete f.platformRegime;delete f.ideologyLabel}continue}
  if(f.platform&&f.platformName===f.name&&f.platformRegime===regime().id)continue;
  f.platform=chooseDemocraticPlatform(f);f.platformName=f.name;f.platformRegime=regime().id;f.ideologyLabel=factionProfile(f).name;
  if(!f.profileKey)f.profileKey=DEMOCRATIC_PLATFORMS[f.platform].base;
 }
 if(regime().democratic&&twoPartyPresidency()){
  const independent=p.factions.find(f=>f.name==='无党籍党团'),major=p.factions.filter(f=>f!==independent).map(f=>factionProfile(f).traits.join(','));
  if(independent&&major.includes(factionProfile(independent).traits.join(','))){independent.platform=Object.keys(DEMOCRATIC_PLATFORMS).find(k=>!major.includes(DEMOCRATIC_PLATFORMS[k].traits.join(',')));independent.ideologyLabel=factionProfile(independent).name}
 }
 // Inactive judicial careers keep their appointment history; serving political actors
 // and the separate judicial reserve follow the current regime's political vocabulary.
 for(const c of [...p.members,...p.candidates,...(s.judicialStaff?.reserve||[])]){
  if(c.judicialCareer){if(regime().democratic&&c.trait===1)c.trait=13;continue}
  const identity=p.regime+':'+(p.factions[c.faction].platform||'original');
  if(c.platformIdentity===identity)continue;c.platformIdentity=identity;
  const traits=factionProfile(p.factions[c.faction]).traits;
  if(regime().democratic){if(!traits.includes(c.trait))c.trait=traits[c.id%traits.length]}
  else if(c.trait>=9)c.trait=legacyPoliticalTrait(c.trait);
 }
 if(regime().democratic){
  for(const j of s.constitution?.judges||[])if(j.politicalTrait===1)j.politicalTrait=13;
  for(const pr of Object.values(s.rules103?.proposals||{}))if(pr.design?.trait===1&&REGIMES.find(r=>r.id===pr.design.regime)?.democratic)pr.design.trait=13;
 }
}
const openingPartiesBeforePlatforms=initializeDemocraticParty107;
initializeDemocraticParty107=function(){
 openingPartiesBeforePlatforms();
 if(creatingWorld&&regime().democratic){
  for(const f of pstate().factions)if(factionProfileBeforePlatforms(f)===FACTION_PROFILES103.market&&f.name!=='无党籍党团'&&rand()<.35)f.name='自由意志党';
  pstate().rulingParty=pstate().factions[playerFactionId107()].name;
 }
 initializePartyPlatforms();
};
const taskBeforePlatforms=departmentTask105;
departmentTask105=function(k,item,c){return taskBeforePlatforms(k,item,{...c,trait:legacyPoliticalTrait(c.trait)})};
const regionalProfileBeforePlatforms=rulingRegionalProfile107;
rulingRegionalProfile107=function(){const result=regionalProfileBeforePlatforms(),platform=Object.values(DEMOCRATIC_PLATFORMS).find(p=>p.profileKey===result.key);if(platform)result.key=platform.base;return result};

const PLATFORM_REFORM_TEXT=[
 '以公共采购带动建筑节能改造，扩大绿色岗位并承担前期财政投入。',
 '审计大额财富流转与公共采购，回应分配诉求，同时增加资本持有者的疑虑。',
 '政府采购优先本土供应商，支持就业，但较高采购成本会推高物价。',
 '按独立成本收益评估排序公共项目，提升科研和投资管理效率。',
 '公开采购标准并保障不同所有制企业平等竞标，扩大竞争和司法监督。',
 '建立职工参与重大经营决策的制度，改善劳动保障，增加企业协商成本。',
 '将跨部门项目的审批权集中至行政协调机构，压缩分散监督的空间。',
 '削减创业与经营许可，扩大民间投资，同时引发对公共保障的担忧。',
 '统一军需采购和后勤标准，以集中投入改善军政系统的执行能力。',
 '建立统一家族税籍和公共账册，提高财政透明度，但冲击既有地方特权。',
 '整合宗教慈善与基层救助网络，扩大公共保障和教团的行政参与。',
 '建立国营企业负责人绩效审计，改善国有资本运营与组织责任。',
 '建立王室文官的专业考核与晋升程序，改善行政能力。',
 '由中央督办地方公共服务项目，提高落实速度并扩大行政裁量。'
];
const PLATFORM_REFORMS=[
 ['green-jobs','绿色就业与建筑节能计划',1.1,6,.3,{unemployment:-.6,approval:3},['green','industry'],{green:4,welfare:2},[9]],
 ['wealth-audit','大额财富与公共采购审计',.5,4,.05,{approval:4,confidence:-3,judicial:2},['welfare'],{welfare:3,populism:3,elite:-2},[10]],
 ['domestic-supply','本土供应链优先采购',.8,5,.15,{unemployment:-.4,confidence:-2,inflation:1},['industry','security'],{nation:4,populism:2},[11]],
 ['evidence-budget','公共项目绩效评估制度',.6,4,.25,{confidence:3,human:2},['technology'],{elite:3,law:1},[12]],
 ['open-procurement','公开采购与竞争中立制度',.5,4,.25,{confidence:3,judicial:3},['trade'],{market:2,law:3},[13]],
 ['worker-councils','企业职工共同决策制度',.8,5,.2,{approval:4,unemployment:-.3,confidence:-2},['industry','welfare'],{welfare:4,market:-2,law:2},[14]],
 ['executive-coordination','跨部门行政授权整合',.6,3,.2,{stability:3,judicial:-4,confidence:1},['technology','security'],{authority:3,law:-2},[15]],
 ['enterprise-entry','企业准入许可精简',.35,3,.35,{confidence:5,approval:-2},['trade','technology'],{market:4,welfare:-1},[8]],
 ['military-logistics','军需采购与后勤统筹',.9,5,.2,{stability:4,confidence:-1,capitalStock:2},['security','industry'],{military:4,authority:2},'tyranny'],
 ['noble-register','统一家族税籍与公共账册',.6,5,.15,{confidence:3,stability:-2},['technology'],{authority:2,elite:-1},'aristocratic'],
 ['religious-welfare','宗教公益基金整合',.7,4,.1,{approval:4,unemployment:-.3,judicial:-1},['welfare'],{welfare:3,authority:1},['theorepublic','theoabsolute']],
 ['public-enterprise-audit','国营企业责任审计',.7,5,.25,{confidence:2,stability:2},['industry'],{market:-2,authority:2},'party'],
 ['royal-service','王室文官考核制度',.6,5,.2,{human:2,confidence:2,stability:1},['technology'],{elite:2,authority:2},'absolute'],
 ['managed-services','地方公共服务督办',.6,4,.15,{approval:3,stability:2,judicial:-2},['welfare'],{authority:2,welfare:2},'symbolic']
];
for(const [i,[key,name,cost,lag,boost,values,tags,axes,access]]of PLATFORM_REFORMS.entries())REFORMS.push({key,name,text:PLATFORM_REFORM_TEXT[i],cost,lag,boost,values,tags,axes,platformAccess:access});
function reformPlatformEligible(r){
 if(!r)return false;const traits=factionProfile(pstate().factions[playerFactionId107()]).traits,dem=regime().democratic,a=r.platformAccess;
 if(a){if(typeof a==='string')return regime().id===a;if(typeof a[0]==='string')return a.includes(regime().id);return dem&&a.some(t=>traits.includes(t))}
 const allowed={inheritance:[3,5,6,7,10,14],nationalize:[6,7,10,14],privatize:[2,8,12,13,15],coops:[5,7,14],health:[3,5,7,9,10,13,14],courts:[0,1,5,9,13,14],autonomy:[0,1,5,9,10,13,14],command:[4,6,12,15],green:[1,5,9,12,14]};
 return !allowed[r.key]||allowed[r.key].some(t=>traits.includes(t));
}
function reformOfferUnderReview(o){return pstate().bill?.offer===o.uid||s.constitution?.docket?.action==='reform'&&Number(s.constitution.docket.target)===o.uid}
function platformOfferPool(existing){return shuffled107(REFORMS.map((_,i)=>i).filter(i=>reformPlatformEligible(REFORMS[i])&&!existing.some(o=>o.catalog===i)&&!s.reforms.some(x=>x.id===i)&&!(REFORMS[i].key==='inheritance'&&v3().inheritanceUsed))).sort((a,b)=>Number(!!REFORMS[b].platformAccess)-Number(!!REFORMS[a].platformAccess))}
makeReformOffers=function(){
 const g=v3(),existing=g.offers.filter(o=>reformOfferUnderReview(o)||o.kept&&reformPlatformEligible(REFORMS[o.catalog]));
 g.offers=existing.concat(platformOfferPool(existing).slice(0,6).map(i=>({uid:g.nextOffer++,catalog:i,kept:false,cycle:g.cycle})));
};
function synchronizePlatformOffers(){
 const g=v3(),p=pstate(),f=p.factions[playerFactionId107()],key=p.regime+':'+f.id+':'+(f.platform||'original');
 if(g.platformOfferKey===key)return;g.platformOfferKey=key;
 g.offers=g.offers.filter(o=>reformOfferUnderReview(o)||o.kept&&reformPlatformEligible(REFORMS[o.catalog]));
 const count=Math.max(0,6-g.offers.length);g.offers.push(...platformOfferPool(g.offers).slice(0,count).map(i=>({uid:g.nextOffer++,catalog:i,kept:false,cycle:g.cycle})));
}
const submitBeforePlatforms=submitReform;
submitReform=function(uid){const o=v3().offers.find(o=>o.uid===uid);if(!o||!reformPlatformEligible(REFORMS[o.catalog]))return toast('这项改革不在当前执政路线的草案范围内');return submitBeforePlatforms(uid)};

function budgetCalendarYear(){return Math.floor(s.q/YEAR)}
function initializeAnnualBudget(){
 if(s.annualBudget)return;
 s.annualBudget={version:1,years:[...new Set((v3()?.decisions||[]).filter(d=>d.label==='通过财政预算').map(d=>Math.floor(d.q/YEAR)))]};
 for(const b of s.bicameral108?.delayed||[])if(b.kind==='budget'){
  const h=[...s.bicameral108.history].reverse().find(h=>h.kind==='budget'&&h.title===b.title&&h.result==='scheduled');
  b.annualBudgetYear=Math.floor((h?.q??s.q)/YEAR);if(!s.annualBudget.years.includes(b.annualBudgetYear))s.annualBudget.years.push(b.annualBudgetYear);
 }
}
function annualBudgetAvailable(){initializeAnnualBudget();return !s.annualBudget.years.includes(budgetCalendarYear())}
function commitAnnualBudget(b){
 if(b?.kind!=='budget'||Number.isInteger(b.annualBudgetYear))return;
 initializeAnnualBudget();b.annualBudgetYear=budgetCalendarYear();if(!s.annualBudget.years.includes(b.annualBudgetYear))s.annualBudget.years.push(b.annualBudgetYear);
}
const annualBudgetBeforeConfidence=budgetConfidenceOutcome;
budgetConfidenceOutcome=function(b,passed){if(passed)commitAnnualBudget(b);return annualBudgetBeforeConfidence(b,passed)};
const annualBudgetBeforeFinalize=finalizeOrdinary108;
finalizeOrdinary108=function(b,returned=false){if(!(isFederal108()&&s.approval<50))commitAnnualBudget(b);return annualBudgetBeforeFinalize(b,returned)};
const proposeBeforeAnnualBudget=proposeBudget;
proposeBudget=function(){if(!annualBudgetAvailable())return toast('本年度预算已通过，请在下一游戏年调整');const result=proposeBeforeAnnualBudget();if(pstate().bill?.kind==='budget'){pstate().bill.title='年度财政与公共预算案';save()}return result};
const voteBeforeAnnualBudget=voteBill;
voteBill=function(){if(pstate().bill?.kind==='budget'&&!annualBudgetAvailable()&&!Number.isInteger(pstate().bill.annualBudgetYear))return toast('本年度预算已通过，请在下一游戏年调整');return voteBeforeAnnualBudget()};
const reviewBeforeAnnualBudget=upperReview108;
upperReview108=function(){const b=upperBill108();if(b?.kind==='budget'&&!annualBudgetAvailable()&&!Number.isInteger(b.annualBudgetYear))return toast('本年度预算已通过，请在下一游戏年调整');return reviewBeforeAnnualBudget()};
const budgetBeforeAnnualBudget=budget;
budget=function(){
 let html=budgetBeforeAnnualBudget(),available=annualBudgetAvailable();
 if(!available)html=html.replace(/<button([^>]*onclick="(?:proposeBudget|applyPolicy)\([^>]*?)>/g,'<button disabled $1>');
 return `<div class="card"><b>年度预算</b><p>每6个季度可进行一次预算调整，表决失败或主动撤回后可重新花费行动点调整并提交。</p>${ruleDetails(available?'本年度预算调整机会尚可使用。':'本年度预算已通过，下一个游戏年恢复调整机会。','查看预算状态')}</div>`+html;
};
const initBeforePolicyPlatforms=initPolitics;
initPolitics=function(...args){
 if(s?.political&&s.governance)initializePartyPlatforms();
 initBeforePolicyPlatforms(...args);initializePartyPlatforms();initializeAnnualBudget();synchronizePlatformOffers();
};
function policyPlatformGuide(entries){
 const add=(id,title,aliases,text)=>entries.push({id,title,aliases,text,category:'经济与财政'});
 add('annual-budget','年度预算',['年度财政与公共预算案','每年一次预算'],'每游戏年6个季度，按日期栏的年份计算，每年可通过一次预算调整。表决失败、退回或撤回草案后仍可重试；两院审议完成或延缓实施获批时占用当年机会。已批准预算跨年实施时保留原批准年份。');
 add('party-platform','政党倾向组合',['民主政党倾向','执政路线'],'民主政党至少具有两种相容的政治倾向。党名与倾向相符，人物来自所属党派的倾向组合。组合影响预算偏好、组阁距离、选举政策契合和可提出的改革。非民主政体保留原有倾向组。');
 add('reform-platform','执政路线与改革',['专属改革','改革资格'],'改革草案随政体与玩家所属党派倾向筛选，每6季度刷新。社民、民主社会等倾向可提出一次性遗产税特别征收；新自由主义政党具有企业准入与市场开放方案。已开始改革继续执行；未提交草案按当前路线筛选。');
 const budgetEntry=entries.find(e=>e.id==='budget');if(budgetEntry)budgetEntry.text+=' 每游戏年6个季度，每年可通过一次预算调整。';
 const allowed=availablePoliticalTraits();for(let i=entries.length-1;i>=0;i--){const id=entries[i].id,trait=TRAITS.findIndex(t=>id==='trait-'+t.name);if(trait!==-1&&!allowed.includes(trait))entries.splice(i,1)}
}
const validBeforePolicyPlatforms=validSave;
validSave=function(v){
 if(!validBeforePolicyPlatforms(v))return false;
 const a=v.annualBudget;if(a&&(a.version!==1||!Array.isArray(a.years)||new Set(a.years).size!==a.years.length||a.years.some(y=>!Number.isInteger(y)||y<0||y>Math.floor(v.q/YEAR))))return false;
 for(const b of [v.political.bill,...(v.bicameral108?.delayed||[])].filter(Boolean))if(b.annualBudgetYear!==undefined&&(!Number.isInteger(b.annualBudgetYear)||!a?.years.includes(b.annualBudgetYear)))return false;
 return v.political.factions.every(f=>!f.platform||!!DEMOCRATIC_PLATFORMS[f.platform]);
};
