/* Military government. The historical regime ID is retained for save continuity. */
const MILITARY_ROUTES={committee:'维持军事委员会统治',civilian:'建立文官政府',personal:'集中个人权力',oligarch:'推进寡头统治'};
const MILITARY_VIEWS={
 development:{name:'国家发展',color:'#b08c41',text:'关注基础设施、工业与国家投资，倾向推进寡头统治。',route:'oligarch',budget:{infrastructure:2,education:1,security:.5},tax:{property:-.5,tariff:.5}},
 technocrat:{name:'技术官僚',color:'#508eaa',text:'扩大专业行政权限，结束军政状态；个人倾向在文官政府与集中个人权力之间确定。',budget:{education:2,infrastructure:1,health:.5,security:-.5},tax:{property:.5,tariff:-1}},
 order:{name:'内部秩序',color:'#7a8160',text:'重视军队权利、国防投入与秩序稳定，维护军事委员会统治。',route:'committee',budget:{security:2,infrastructure:.5,welfare:-.5},tax:{property:-.5,tariff:.5}},
 reform:{name:'理想革新',color:'#9b6788',text:'支持军队专业化、反腐与政治改革，倾向建立文官政府。',route:'civilian',budget:{education:1.5,welfare:1,health:1,security:-.5},tax:{property:1,tariff:-.5}}
};
const MILITARY_RANKS=['中将','少将','准将','上校','中校','少校'];
const MILITARY_REFORMS={digital:'civilian',courts:'civilian',education:'civilian',autonomy:'civilian',command:'personal',defence:'committee',nationalize:'committee',privatize:'oligarch',fund:'oligarch',competition:'oligarch'};
let militaryPageView='factions',militaryInitializing=false,militaryTransitioning=false;
function militaryGovernment(){return s?.political?.regime==='tyranny'}
function militaryState(){return s?.military}
function militaryActive(){return militaryGovernment()&&!!militaryState()&&!militaryState().resolved}
function militaryRecord(text){militaryState().history.push({q:s.q,text});log('军政事务',text)}
function militaryAdjust(values={}){if(!militaryActive())return;const m=militaryState();for(const key of ['backing','militarization'])if(Number.isFinite(values[key]))m[key]=clamp(m[key]+values[key],0,100)}
function militaryMove(route,amount,source){
 if(!militaryActive()||!Object.hasOwn(MILITARY_ROUTES,route)||amount<=0)return;
 const r=militaryState().routes,gain=Math.min(amount,100-r[route]);let remaining=gain;
 // Routes are competing allocations. Exhaust the status quo before reallocating rival transitions.
 if(route!=='committee'){const n=Math.min(r.committee,remaining);r.committee-=n;remaining-=n}
 const others=Object.keys(r).filter(k=>k!==route&&(route==='committee'||k!=='committee')),total=others.reduce((n,k)=>n+r[k],0);
 if(remaining>0&&total>0)for(const k of others)r[k]=Math.max(0,r[k]-remaining*r[k]/total);
 r[route]+=gain;for(const k of Object.keys(r))if(r[k]<1e-8)r[k]=0;
 if(r[route]>100-1e-8)r[route]=100;
 if(gain)militaryRecord(`${source}：${MILITARY_ROUTES[route]} +${fmt(gain,1)}，当前 ${fmt(r[route],1)}%。`);
}
function initializeMilitary(){
 if(!militaryGovernment()||militaryState()||militaryInitializing)return;
 militaryInitializing=true;const prior=s.rng;s.rng=hash(s.seed+'|military-government');
 try{
  const p=pstate(),oldNames=p.factions.map(f=>f.name),names=['军队建制派','文官治理派','军官革新派'],profiles=['state','reform','law'];
  p.factions=names.map((name,id)=>({id,name,profileKey:profiles[id],seats:[65,20,15][id],relation:id===0?68:52+Math.floor(rand()*12),pledge:null,agendaDecay:0}));
  p.playerFaction=0;p.rulingParty=names[0];rules103().coalition=[0];
  for(const x of [...p.candidates,...p.members,...(s.judicialStaff?.reserve||[])]){
   x.faction=x.faction%3;x.trait=pick(FACTION_PROFILES103[profiles[x.faction]].traits);x.baseName=x.baseName||x.name;x.name=x.baseName;x.honour=null;
  }
  p.members=p.members.slice(0,7);p.members.forEach((x,i)=>{x.id=i;x.faction=i<4?i%3:i-4;x.role=i<4?['军政联络主任','行政联络主任','军政秘书长','副秘书长'][i]:names[i-4]+'代表'});
  for(const pr of Object.values(rules103().proposals))if(pr.design)pr.design.faction%=3;
  for(const risk of programmeState107()?.risks||[])risk.faction%=3;
  initializeProgrammes107();
  for(const promise of p.promises)if(Number.isInteger(promise.faction))promise.faction%=3;
  for(const e of [p.current,...p.queue,...sits().notices,...sits().active].filter(Boolean)){
   if(Number.isInteger(e.faction))e.faction%=3;if(Number.isInteger(e.member))e.member%=p.members.length;
   for(const k of ['title','text'])if(typeof e[k]==='string')oldNames.forEach((name,i)=>e[k]=e[k].split(name).join(names[i%3]));
  }
  for(const j of constitution().judges)if(Number.isInteger(j.faction))j.faction%=3;
  const oldDocket=constitution().docket;if(oldDocket?.mode==='interpret'&&oldDocket.action==='relations')oldDocket.target=String(Number(oldDocket.target)%3);
  p.judicial=50;p.highCourtStreak=0;
  const count=12+Math.floor(rand()*4),civilCount=2+Math.floor(rand()*2),members=[];
  s.military={version:1,backing:75+Math.floor(rand()*11),militarization:65+Math.floor(rand()*11),routes:{committee:100,civilian:0,personal:0,oligarch:0},members,resolved:null,lastQ:s.q,lastEventQ:s.q,history:[],completedSeen:s.reforms.filter(x=>x.completed).map(x=>x.id),voteHistory:[],situationId:null};
  const pool=p.candidates.filter(c=>!c.judicialCareer),used=new Set(),views=Object.keys(MILITARY_VIEWS);
  for(let id=0;id<count;id++){
   const faction=id>=count-civilCount?1:0,view=id===0?'order':id<5?views[id-1]:pick(views),route=view==='technocrat'?(rand()<.5?'civilian':'personal'):MILITARY_VIEWS[view].route;
   const rank=id===0?'中将':id===1?'少将':id===2?(rand()<.5?'少将':'准将'):id===3&&rand()<.3?'准将':pick(['上校','中校','中校','少校','少校','少校']);
   const c=id===0?null:pool.find(c=>c.faction===faction&&!used.has(c.id));if(c)used.add(c.id);
   const baseName=id===0?'主席（玩家）':c?c.baseName:personName();
   members.push({id,baseName,name:baseName,rank,faction,view,route,candidate:c?.id??null,player:id===0,agenda:id===0?100:52+Math.floor(rand()*14),relation:id===0?100:50+Math.floor(rand()*21),last:-1});
  }
  // A suspended scalar never triggers a judicial crisis or a retrospective penalty.
  sits().active=sits().active.filter(x=>x.kind!=='justice');
  const remove=e=>e?.type==='court'||/司法独立抗议|局势出现：司法公平事件/.test(e?.title||'');
  p.queue=p.queue.filter(e=>!remove(e));sits().notices=sits().notices.filter(e=>!remove(e));if(remove(p.current))p.current=p.queue.shift()||null;
  if(amendmentInProgress107()?.action==='competitive')finishAmendment107(false,'军政体制的转型须在“枕戈待旦”中完成。');
  const x=startSituation('military-transition',true);militaryState().situationId=x.id;militaryPageView='factions';
  militaryRecord('军事委员会开始共同执政；国家未来尚待决定。');
 }finally{s.rng=prior;militaryInitializing=false}
}
SIT_NAMES['military-transition']='枕戈待旦';
SIT_INFO['military-transition']=['军队接管政权之后，委员会共治、文官治理、个人集权与寡头秩序的主张相互竞争。','任一转型路线达到100%，按该路线建立新制度','无固定局势损耗；军方拥护与军政化程度按军政规则影响国家'];
const militaryInitBefore=initPolitics;
initPolitics=function(...args){militaryInitBefore(...args);initializeMilitary();if(militaryGovernment()&&militaryState()){pstate().judicial=50;pstate().highCourtStreak=0}};
const militaryModBefore=mod;
mod=function(values){if(militaryGovernment()&&Object.hasOwn(values,'judicial')){values={...values};delete values.judicial}return militaryModBefore(values)};
const militarySnapshotBefore=snapshot;
snapshot=function(){const row=militarySnapshotBefore();if(militaryGovernment()){row.judicial=null;row.militaryBacking=militaryState()?.backing??null;row.militarization=militaryState()?.militarization??null}return row};
const militaryMetricBefore=metric;
metric=function(label,n,unit,sub,good){if(militaryGovernment()&&METRIC_KEYS107[label]==='judicial')return metricBeforeCharts107(label,'-','','军政期间不计算司法独立度',true);return militaryMetricBefore(label,n,unit,sub,good)};
const militaryChartBefore=seriesChart;
seriesChart=function(key,...args){if(key==='judicial'&&militaryGovernment()&&!s.history.some(h=>Number.isFinite(h.judicial)))return '<p>军政期间不计算司法独立度；政体转变后开始记录。</p>';return militaryChartBefore(key,...args)};
EXTRA_SERIES107.push(['militaryBacking','军方拥护度','%'],['militarization','军政化程度','%']);
const militaryAlertsBefore=activeAlerts107;
activeAlerts107=function(){const a=militaryAlertsBefore().filter(x=>!militaryGovernment()||x.id!=='judicial');if(militaryActive()&&militaryState().backing<40&&!s.ended)a.push({id:'military-backing',title:'军方拥护度不足40%',text:militaryBackingRules(),tabs:['assembly','overview'],metric:'militaryBacking'});return a};
function militaryBackingRules(){return '军方拥护度低于40，每季度政治稳定−1；低于20，每季度政治稳定−3、全国支持率−1，替代前一档；归零时委员会罢免主席，普通模式下统治结束。'}
function militaryRules(){return `<details class="military-rules"><summary>查看军政规则</summary><p>${militaryBackingRules()}</p><p>军政化程度达到70，每季全国支持率−0.5、军方拥护度+0.5；低于40，每季全国支持率+0.5、军方拥护度−1；40至70之间不产生这项损耗。已通过的行政安全预算达到5%时每季军方拥护度+0.5，低于3%时−1。</p><p>四条路线进度合计100%。推进转型优先减少委员会统治进度；不足时按比例减少其他转型进度。维持共治则按比例收回其他路线进度。达到100%的转型将立即生效；军政规则随后停止。</p><p>派系与委员互动各消耗1行动点，同一对象每季一次。路线行动每季限一次，消耗1行动点；事件回复不消耗行动点。委员议程倾向每季−1，最低20；委员会关系与内阁忠诚分别计算。</p></details>`}
function militaryMeters(){const m=militaryState();return `<section class="card military-metrics" id="military-metrics"><div><span>全国支持率</span><strong>${fmt(s.approval,1)}%</strong></div><button onclick="openMetricChart107('militaryBacking')" data-metric="militaryBacking"><span>军方拥护度 ↗</span><strong>${fmt(m.backing,1)}%</strong></button><button onclick="openMetricChart107('militarization')"><span>军政化程度 ↗</span><strong>${fmt(m.militarization,1)}%</strong></button></section>`}
function militaryRouteBars(){return `<div class="military-routes" id="military-routes">${Object.entries(MILITARY_ROUTES).map(([k,name])=>`<div class="military-route" data-route="${k}"><div><b>${name}</b><span>${fmt(militaryState().routes[k],1)}%</span></div><div class="bar"><i style="width:${militaryState().routes[k]}%;background:${{committee:'#7a8160',civilian:'#508eaa',personal:'#9b6788',oligarch:'#b08c41'}[k]}"></i></div></div>`).join('')}</div>`}
function militaryRouteRequirement(key){const m=militaryState();return key==='civilian'?s.approval>=55&&m.backing>=50&&m.militarization<=55:key==='personal'?s.approval>=40&&m.backing>=75&&m.militarization>=65:key==='oligarch'?s.approval>=35&&m.backing>=60&&m.militarization>=40:true}
const militaryRouteSpecs={
 civilian:{label:'移交民政权限',detail:'条件：全国支持率至少55%、军方拥护度至少50%、军政化程度不超过55。支出0.45% GDP；文官政府进度+12；全国支持率+1、军方拥护度−2、军政化程度−4。达到100%转为象征性民主制。',values:{cost:.45,approval:1},military:{backing:-2,militarization:-4},axes:{authority:-3,law:3}},
 personal:{label:'确立主席最高裁决权',detail:'条件：全国支持率至少40%、军方拥护度至少75%、军政化程度至少65。支出0.35% GDP；个人权力进度+12；全国支持率−1、军方拥护度+1、军政化程度+2。达到100%转为君主专制。',values:{cost:.35,approval:-1},military:{backing:1,militarization:2},axes:{authority:4,elite:2}},
 oligarch:{label:'建立军政实业议事集团',detail:'条件：全国支持率至少35%、军方拥护度至少60%、军政化程度至少40。支出0.6% GDP；寡头统治进度+12；全国支持率−2、投资者信心+3、军方拥护度−1、军政化程度−1。达到100%转为贵族制。',values:{cost:.6,approval:-2,confidence:3},military:{backing:-1,militarization:-1},axes:{elite:4,market:2}},
 committee:{label:'重申委员会集体统治',detail:'支出0.25% GDP；委员会统治进度+10，其他路线相应减少；军方拥护度+5、军政化程度+3、全国支持率−2。维持共治不会结束本局势。',values:{cost:.25,approval:-2},military:{backing:5,militarization:3},axes:{military:3,authority:1}}
};
const militaryActionsBefore=situationActions;
situationActions=function(x){if(x.kind!=='military-transition')return militaryActionsBefore(x);return Object.entries(militaryRouteSpecs).map(([key,a])=>({...a,key,detail:'1行动点；每季限一次路线行动。'+a.detail}))};
const militaryUnavailableBefore=unavailable;
unavailable=function(x,a){return x.kind==='military-transition'?s.ended||!militaryActive()||pstate().ap<1||pstate().lastAction['military-route']===s.q||!militaryRouteRequirement(a.key):militaryUnavailableBefore(x,a)};
const militaryActBefore=situationAct;
situationAct=function(id,key){const x=sits().active.find(x=>x.id===id);if(x?.kind!=='military-transition')return militaryActBefore(id,key);const a=militaryRouteSpecs[key];if(!a||unavailable(x,{key})||!spendAction('military-route'))return;mod(a.values);militaryAdjust(a.military);militaryMove(key,key==='committee'?10:12,a.label);x.actions.push({q:s.q,key,label:a.label});x.cost+=s.gdp*a.values.cost/100;noteDecision(a.label,a.axes,[],null,1,null,{kind:'amendment'});checkMilitaryTransition();checkPoliticalEnd();record();pSave()};
const militaryProgressBefore=situationProgress;
situationProgress=function(x){if(x.kind==='military-transition')return militaryMeters()+militaryRouteBars()+militaryRules();let html=militaryProgressBefore(x);if(militaryGovernment()&&MINORITY_KINDS107.includes(x.kind))html=html.replace('请与'+regime().body+memberRole(0)+'互动提出修宪。','请前往宪法法庭提出修宪。');return html};
function militaryFactionChoices(id){return [
 {key:'consult',label:'协商施政安排',detail:'团体关系+8；军方拥护度+2；支出0.15% GDP。',relation:8,values:{cost:.15},military:{backing:2}},
 {key:'civil',label:'安排文官接管试点',detail:'团体关系+4；文官政府进度+3；军政化程度−5、军方拥护度−2、全国支持率+2；支出0.3% GDP。',relation:4,route:'civilian',values:{cost:.3,approval:2},military:{militarization:-5,backing:-2}},
 {key:'order',label:'保障军官待遇与集体议事',detail:'团体关系+6；委员会统治进度+3；军方拥护度+6、军政化程度+3、全国支持率−1；支出0.3% GDP。',relation:6,route:'committee',values:{cost:.3,approval:-1},military:{backing:6,militarization:3}},
 {key:'route',label:['协调国家发展特许','加强专业行政授权','支持军队专业化'][id],detail:`团体关系+5；${MILITARY_ROUTES[['oligarch','personal','civilian'][id]]}进度+3；${id===0?'投资者信心+1、全国支持率−1':id===1?'军政化程度−2、军方拥护度+1':'军政化程度−3、全国支持率+1'}；支出0.2% GDP。`,relation:5,route:['oligarch','personal','civilian'][id],values:{cost:.2,...(id===0?{confidence:1,approval:-1}:id===2?{approval:1}:{})},military:id===1?{militarization:-2,backing:1}:id===2?{militarization:-3}:{}}
 ]}
function militaryFactionDialog(id){const f=pstate().factions[id];if(!militaryActive()||!f||s.ended)return;modal(`<span class="tag">积薪厝火 · 派系沟通</span><h2>${esc(f.name)}</h2><p>团体关系 ${fmt(f.relation,1)}。派系关系会影响与其有关委员的本案意愿；此处不进行法案投票。</p><div class="choices">${militaryFactionChoices(id).map(a=>`<button onclick="militaryFactionAct(${id},'${a.key}')" ${pstate().ap<1||pstate().lastAction['military-faction:'+id]===s.q?'disabled':''}><b>${a.label}</b><small>1行动点；${a.detail}</small></button>`).join('')}</div><button onclick="$('modal').close()">返回</button>`)}
function militaryFactionAct(id,key){const f=pstate().factions[id],a=militaryFactionChoices(id).find(x=>x.key===key);if(!militaryActive()||!f||!a||!spendAction('military-faction:'+id))return;f.relation=clamp(f.relation+a.relation,0,100);militaryAdjust(a.military);mod(a.values);if(a.route)militaryMove(a.route,3,f.name+'：'+a.label);noteDecision(f.name+'：'+a.label,a.route==='civilian'?{law:2,authority:-2}:a.route==='oligarch'?{elite:3,market:1}:{military:2,authority:1},[],null,1,null,{kind:'situation'});militaryRecord(f.name+'：'+a.label+'。');checkMilitaryTransition();checkPoliticalEnd();$('modal').close();record();pSave()}
const militaryTalkBefore=factionTalk;factionTalk=function(id){return militaryGovernment()?militaryFactionDialog(id):militaryTalkBefore(id)};
const militaryDealBefore=deal;deal=function(id,kind){if(militaryGovernment())return;return militaryDealBefore(id,kind)};
function militaryWillingness(member,b=pstate().bill){
 if(member.player)return 100;const m=militaryState(),view=MILITARY_VIEWS[member.view],f=pstate().factions[member.faction];
 let result=member.agenda+(member.relation-50)*.1+(f.relation-60)*.12+(m.backing-60)*.08;
 if(b?.kind==='budget'){
  const delta=k=>(b.policies[k]??0)-(s.policies[k]??0);result-=delta('income')+delta('vat')/1.5+delta('corporate')/2;
  for(const [k,w]of Object.entries(view.budget))result+=delta(k)*w;
  for(const [k,w]of Object.entries(view.tax))result+=delta(k)*w;
 }
 if(b?.kind==='reform'){const r=REFORMS[b.id],route=MILITARY_REFORMS[r?.key];if(route)result+=route===member.route?8:route==='civilian'&&member.view==='order'?-8:-3;}
 if(b?.kind==='constitution')result+=(b.stance==='social'||b.stance==='liberal')?(member.view==='reform'?8:member.view==='order'?-8:2):b.stance==='authority'?(member.view==='order'?5:member.view==='reform'?-8:3):0;
 return clamp(result,0,100);
}
const militaryRoleBefore=memberRole;memberRole=function(i){return militaryGovernment()?['主席','副主席','秘书长','副秘书长'][i]:militaryRoleBefore(i)};
function militaryTally(){const all=militaryState().members,yes=all.filter(m=>militaryWillingness(m)>=60).length;return {yes,total:all.length,rate:yes/all.length*100}}
const militaryPassBefore=billPassRate104;billPassRate104=function(){return militaryActive()?militaryTally().rate:militaryPassBefore()};
const militaryThresholdBefore=threshold;threshold=function(){return militaryActive()?(amendmentInProgress107()?.stage==='legislature'?100*2/3:50):militaryThresholdBefore()};
const militaryPenaltyBefore=billStabilityPenalty;billStabilityPenalty=function(){return militaryActive()?0:militaryPenaltyBefore()};
function militaryMemberDialog(id){const x=militaryState()?.members[id];if(!militaryActive()||!x||x.player||s.ended)return;const v=MILITARY_VIEWS[x.view];modal(`<span class="tag">军事委员会 · ${x.rank} · ${pstate().factions[x.faction].name}</span><h2>${esc(x.name)}</h2><p><b style="color:${v.color}">${v.name}</b> · ${v.text}</p><p>个人主张：${MILITARY_ROUTES[x.route]}。议程倾向 ${fmt(x.agenda,1)}；本案意愿 ${fmt(militaryWillingness(x),1)}，60起投赞成票。${militaryCabinetRole(x)?'兼任'+militaryCabinetRole(x)+'；内阁忠诚与委员会关系独立计算。':''}</p><div class="choices">${[
 ['explain','共同审阅施政文件','关系+5、议程倾向+6。'],['fund','落实其专业部门预算','支出0.2% GDP；关系+6、议程倾向+12、军方拥护度+1。'],['route','接受其制度方向建议',`${MILITARY_ROUTES[x.route]}进度+3；议程倾向+10、关系+4；政治稳定−1。`]
 ].map(([k,label,detail])=>`<button onclick="militaryMemberAct(${id},'${k}')" ${pstate().ap<1||x.last===s.q?'disabled':''}><b>${label}</b><small>1行动点；${detail}</small></button>`).join('')}</div><button onclick="$('modal').close()">返回</button>`)}
function militaryCabinetRole(member){const item=Object.entries(pstate().cabinet).find(([,c])=>c&&c.candidate===member.candidate);return item?office(item[0]):''}
function militaryMemberAct(id,key){const x=militaryState()?.members[id];if(!militaryActive()||!x||x.player||x.last===s.q||!['explain','fund','route'].includes(key)||!spendAction('military-member:'+id))return;x.last=s.q;x.relation=clamp(x.relation+({explain:5,fund:6,route:4}[key]),0,100);x.agenda=clamp(x.agenda+({explain:6,fund:12,route:10}[key]),0,100);if(key==='fund'){mod({cost:.2});militaryAdjust({backing:1})}if(key==='route'){mod({stability:-1});militaryMove(x.route,3,x.name+'的制度建议')}noteDecision('会见委员'+x.name,key==='route'?x.route==='civilian'?{law:2,authority:-2}:x.route==='oligarch'?{elite:2,market:1}:{authority:2,military:2}:{elite:1},[],null,1,null,{kind:'situation'});militaryRecord(x.name+'：议程倾向 '+fmt(x.agenda,1)+'。');checkMilitaryTransition();checkPoliticalEnd();$('modal').close();record();pSave()}
function switchMilitaryPage(view){if(!militaryGovernment())return;militaryPageView=view==='committee'?'committee':'factions';tab='assembly';render()}
function militarySwitch(){return `<nav class="chamber-switch108 military-switch" aria-label="监察机构页面"><button onclick="switchMilitaryPage('factions')" aria-pressed="${militaryPageView==='factions'}" class="${militaryPageView==='factions'?'primary':''}">积薪厝火</button><button onclick="switchMilitaryPage('committee')" aria-pressed="${militaryPageView==='committee'}" class="${militaryPageView==='committee'?'primary':''}">军事委员会</button></nav>`}
function militaryCommitteeChart(){const all=militaryState().members;return `<div class="military-seat-grid" role="img" aria-label="军事委员会${all.length}人">${all.map(x=>`<span style="background:${MILITARY_VIEWS[x.view].color}" title="${esc(x.name)} · ${x.rank} · ${MILITARY_VIEWS[x.view].name}">${x.player?'★':''}</span>`).join('')}</div><div class="judge-legend">${Object.entries(MILITARY_VIEWS).map(([k,v])=>`<span><i style="background:${v.color}"></i>${v.name} ${all.filter(x=>x.view===k).length}人</span>`).join('')}</div>`}
function militaryBillPanel(){const b=pstate().bill;if(b?.kind==='constitution')return constitutionalDocketHTML();if(!b)return `<section class="card"><h3>委员会审议</h3><p>预算与结构性改革均由本委员会逐人表决。提出修宪请前往宪法法庭，随后由本委员会审议。</p><button onclick="changeTab('budget')">拟定预算</button> <button onclick="changeTab('reforms')">结构性改革</button> <button onclick="changeTab('judiciary')">宪法法庭</button></section>`;const t=militaryTally();return `<section class="card"><span class="tag">待决议案</span><h2>${esc(b.title)}</h2><p>${esc(b.description)}</p><div class="big-number">${fmt(t.rate,1)}<small>% 院内支持率</small></div><p>${t.yes} / ${t.total} 人赞成；须赞成票过半，每位委员一票。</p><button class="primary" onclick="voteBill()" ${s.ended||pstate().ap<1?'disabled':''}>提交委员会表决 · 1行动点</button> <button onclick="withdrawBill()">撤回议案</button></section>`}
function militaryAssembly(){const m=militaryState(),descs=['统合军队建制与国家发展利益，关注军队保障、基础建设与国家投资。','主张专业行政与文官治理，关注公共服务、行政效率与结束军政状态。','推动军队专业化、反腐与政治改革，倾向建立文官政府。'];return militarySwitch()+`<div class="political-banner"><div><span class="tag">军政府制 / 军事委员会主席</span><h2>${militaryPageView==='factions'?'积薪厝火':'军事委员会'}</h2><p>${militaryPageView==='factions'?'各派围绕国家未来交涉。地方军政集团的要求通过季度事件送达。':'各委员拥有独立议程倾向；军衔不增加票数。主席拥有一票。'}</p></div><div class="action-count"><b>${pstate().ap}</b><span>本季行动点</span></div></div>`+militaryMeters()+(militaryPageView==='factions'?`<section class="card">${militaryRouteBars()}<button onclick="changeTab('situations')">前往枕戈待旦 →</button></section><div class="member-grid">${pstate().factions.map((f,i)=>`<article class="card"><h3>${f.name}</h3><p>团体关系 ${fmt(f.relation,1)}</p><p>${descs[i]}</p><button onclick="militaryFactionDialog(${i})" ${s.ended?'disabled':''}>沟通与协商</button></article>`).join('')}</div>`:`<section class="card">${militaryCommitteeChart()}<p>${[0,1].map(id=>pstate().factions[id].name+' '+m.members.filter(x=>x.faction===id).length+'人').join(' · ')}</p><details><summary>查看表决细则</summary><p>每位委员本案意愿达到60时投赞成票。预算与改革须超过半数；修宪须达到三分之二。预算增减结合个人倾向折算，五项税收均参与；改革与宪法议题按委员路线调整。军衔、内阁职务与派系人数不会赋予额外票数。</p><p>个人本案意愿＝议程倾向＋(个人关系−50)×0.1＋(派系关系−60)×0.12＋(军方拥护度−60)×0.08＋议题修正。主席始终赞成自己提交的法案。反对票不触发下院派系的额外稳定惩罚。</p></details></section>${militaryBillPanel()}<div class="member-grid">${m.members.map(x=>`<article class="card military-member" data-military-member="${x.id}"><span class="tag">${x.rank} · ${pstate().factions[x.faction].name}</span><h3>${esc(x.name)}</h3><p style="color:${MILITARY_VIEWS[x.view].color}"><b>${MILITARY_VIEWS[x.view].name}</b></p><p>${x.player?'主持委员会会议，拥有一票。':`个人主张：${MILITARY_ROUTES[x.route]}<br>议程倾向 ${fmt(x.agenda,1)} · 关系 ${fmt(x.relation,1)}${militaryCabinetRole(x)?'<br>兼任'+militaryCabinetRole(x):''}`}</p><p>本案意愿 ${fmt(militaryWillingness(x),1)} · <b>${militaryWillingness(x)>=60?'赞成':'反对'}</b></p>${x.player?'':`<button onclick="militaryMemberDialog(${x.id})" ${s.ended?'disabled':''}>会见委员</button>`}</article>`).join('')}</div>`)+militaryRules()+`<section class="card"><details><summary>军政事务档案</summary>${m.history.slice(-40).reverse().map(h=>`<p>第${h.q}季度 · ${esc(h.text)}</p>`).join('')}</details></section>`}
const militaryAssemblyBefore=assembly;assembly=function(){return militaryActive()?militaryAssembly():militaryAssemblyBefore()};
const militaryOverviewBefore=overview;overview=function(){const html=militaryOverviewBefore();return militaryActive()?html.replace('非玩家派系议程倾向每季下降 2 点','非玩家委员议程倾向每季下降1点（最低20）')+militaryMeters():html};
const militaryArchiveBefore=archive;archive=function(){return militaryArchiveBefore()+(militaryState()?`<section class="card"><h3>军政沿革${militaryState().resolved?' · 已结束':''}</h3>${militaryRouteBars()}<details><summary>查看军政记录</summary>${militaryState().history.map(h=>`<p>第${h.q}季度 · ${esc(h.text)}</p>`).join('')}</details></section>`:'')};
const militaryBudgetBefore=proposeBudget;proposeBudget=function(){if(militaryActive())militaryPageView='committee';return militaryBudgetBefore()};
const militaryReformBefore=submitReform;submitReform=function(uid){if(militaryActive())militaryPageView='committee';return militaryReformBefore(uid)};
const militaryVoteBefore=voteBill;voteBill=function(){const b=pstate().bill;if(militaryActive()){militaryPageView='committee';if(b&&['budget','reform'].includes(b.kind)&&militaryTally().rate<=50){if(!spendAction('vote'))return;mod({approval:-2,stability:-1});pstate().confidenceLoss++;log('议程受阻',b.title+'未获委员会过半赞成，提案保留。');noteDecision('议程表决失败',{authority:0});pSave();return}}const before=pstate().passed.length,rate=militaryActive()?militaryTally().rate:0,result=militaryVoteBefore();if(militaryActive()&&b&&pstate().passed.length>before){militaryState().voteHistory.push({q:s.q,title:b.title,rate});record();save()}return result};
const militarySpecBefore=constitutionalSpec;
constitutionalSpec=function(mode,action,target){if(militaryGovernment()&&mode==='amend'&&action==='competitive')return null;const spec=militarySpecBefore(mode,action,target);if(spec&&militaryGovernment()&&action==='court'){spec.description=target==='assembly'?'将宪制审查权交军事委员会；释宪与后续修宪的审查阶段由委员逐人表决。':'将宪制审查权恢复至宪法法庭。';spec.values={...spec.values};delete spec.values.judicial;spec.costText='通过效果：'+impactText(spec.values)+'。军政期间不计算司法独立度。'}return spec};
const militaryMenuBefore=constitutionalMenu;
constitutionalMenu=function(mode='interpret'){militaryMenuBefore(mode);if(!militaryGovernment()||constitution().docket||mode!=='amend')return;$('modal').innerHTML=$('modal').innerHTML.replace(/<span class="tag">[^<]*<\/span>/,'<span class="tag">宪法法庭 · 修宪受理</span>').replace(/<h2>提出修宪<\/h2><p>[\s\S]*?<\/p>/,'<h2>提出修宪</h2><p>宪法法庭受理修宪申请后，须交军事委员会取得三分之二赞成，再由现行宪制审查机关在三季度内完成审查。军政期间不开放竞争性选举条文，国家转型通过“枕戈待旦”推进。</p>')};
const militaryProposeConstitutionBefore=proposeConstitution;
proposeConstitution=function(mode,action,target){if(militaryGovernment()&&mode==='amend')militaryPageView='committee';return militaryProposeConstitutionBefore(mode,action,target)};
const militaryDocketBefore=constitutionalDocketHTML;
constitutionalDocketHTML=function(){let html=militaryDocketBefore();if(!militaryGovernment())return html;if(!constitution().docket)return `<section class="card" id="constitutional-docket"><span class="tag">宪法法庭 · 宪制议程</span><h3>暂无待审议案</h3><p>释宪由现行宪制审查机关表决；修宪申请先交军事委员会取得三分之二支持，再进入三季度审查。</p><button onclick="constitutionalMenu('interpret')">请求释宪</button> <button onclick="constitutionalMenu('amend')">提出修宪</button></section>`;return html.replace('提交议会表决','提交委员会表决').replace('在本页与党派和议员协商争取支持。','在军事委员会逐人争取委员支持。')};
const militaryJudiciaryBefore=judiciary;
judiciary=function(){let html=militaryJudiciaryBefore();if(!militaryGovernment())return html;const split=html.lastIndexOf('<div class="split"');if(split>=0)html=html.slice(0,split);return html.replace(/<div class="political-banner">[\s\S]*?(?=<div class="grid constitutional-grid">)/,`<div class="political-banner"><div><span class="tag">宪制事务</span><h2>宪法法庭</h2><p>军政期间不设置司法独立度。法官仍依个人立场审查宪制议案，保留法官人事与逐人互动。</p></div></div>`)+'<section class="card"><button onclick="constitutionalMenu(\'amend\')">提出修宪</button> <button onclick="constitutionalMenu(\'interpret\')">请求释宪</button></section>'};
const militaryJudgeBefore=meetJudge;
meetJudge=function(id){militaryJudgeBefore(id);if(militaryGovernment()){const j=constitution().judges[id];if(j?.chief)$('modal').innerHTML+='<section class="constitution-actions"><button onclick="constitutionalMenu(\'amend\')">提出修宪</button></section>'; $('modal').innerHTML=$('modal').innerHTML.replace(/，?司法独立 [＋+−-]\d+(?:\.\d+)?[。；]?/g,'').replace('下一季度有 3% 概率追加特别事件，司法独立再 −10。','下一季度有3%概率引发施压争议，公众支持率−2、军方拥护度−2。')}};
const militaryCourtEligibleBefore=eligibleForCourt107;
eligibleForCourt107=function(c){return militaryActive()&&c&&militaryState().members.some(m=>!m.player&&(m.candidate===c.id&&pstate().candidates[c.id]===c||m.baseName===(c.baseName||c.name)))?false:militaryCourtEligibleBefore(c)};
const militaryMemberBefore=meetMember;meetMember=function(id){if(militaryGovernment())return militaryFactionDialog(pstate().members[id]?.faction??0);return militaryMemberBefore(id)};
const militaryCourtBefore=courtAction;courtAction=function(kind){if(militaryGovernment())return openChiefJudge107();return militaryCourtBefore(kind)};
const militaryEventBefore=judicialEvent;judicialEvent=function(){return militaryActive()?militaryEvent():militaryEventBefore()};
function militaryEvent(){
 const x=pick(militaryState().members.filter(x=>!x.player)),route=x.route,z=pick(v3().regions),topics=[
 {title:z.name+'驻军提出军政要求',text:'驻军负责人要求延续军方对当地运输和行政岗位的控制。行政人员则要求结束临时接管。',options:[
  militaryOption('保留军方接管权限','支出0.3% GDP；全国支持率−2、军方拥护度+5、军政化程度+4；委员会统治进度+5。',{cost:.3,approval:-2},{backing:5,militarization:4},'committee',5),
  militaryOption('安排文官接管与军队轮换','支出0.4% GDP；全国支持率+2、军方拥护度−3、军政化程度−5；文官政府进度+5。',{cost:.4,approval:2},{backing:-3,militarization:-5},'civilian',5),
  militaryOption('由主席直接任命地区专员','政治稳定+1、军方拥护度+1、军政化程度+1；个人权力进度+5。',{stability:1},{backing:1,militarization:1},'personal',5)]},
 {title:'军方企业与公共采购争议',text:'军方经营机构希望获得长期工程与资源特许；专业行政人员要求公开采购和退出经营。',options:[
  militaryOption('签订长期实业特许','支出0.3% GDP；投资者信心+2、全国支持率−2；军方拥护度+3；寡头统治进度+6。',{cost:.3,confidence:2,approval:-2},{backing:3},'oligarch',6),
  militaryOption('交由文官审计并公开招标','支出0.25% GDP；全国支持率+2、军方拥护度−3、军政化程度−3；文官政府进度+5。',{cost:.25,approval:2},{backing:-3,militarization:-3},'civilian',5),
  militaryOption('由主席掌握最终采购权','全国支持率−1、军方拥护度+2、军政化程度+2；个人权力进度+5。',{approval:-1},{backing:2,militarization:2},'personal',5)]},
 {title:x.name+'提出制度安排',text:`${x.rank}${x.name}主张“${MILITARY_ROUTES[route]}”。${MILITARY_VIEWS[x.view].text}`,options:[
  {...militaryOption('接受其试行方案',`支出0.25% GDP；军方拥护度+2；${MILITARY_ROUTES[route]}进度+5；该委员议程倾向+4。`,{cost:.25},{backing:2},route,5),militaryMember:x.id,militaryAgenda:4},
  militaryOption('保留集体议事，延后改变','军方拥护度+1；委员会统治进度+2。',{}, {backing:1},'committee',2),
  {...militaryOption('拒绝改变现有安排','全国支持率−1；军方拥护度−2；该委员议程倾向−5。',{approval:-1},{backing:-2},null,0),militaryMember:x.id,militaryAgenda:-5}]},
 {title:'军官退休与行政岗位交接',text:'一批军官即将退役。他们希望保留行政职位，年轻军官和文官各有不同安排。',options:[
  militaryOption('保留军政双重职务','支出0.2% GDP；军方拥护度+4、军政化程度+3、全国支持率−1；委员会统治进度+5。',{cost:.2,approval:-1},{backing:4,militarization:3},'committee',5),
  militaryOption('提供退休保障，交还行政岗位','支出0.5% GDP；军方拥护度+1、军政化程度−5、全国支持率+1；文官政府进度+5。',{cost:.5,approval:1},{backing:1,militarization:-5},'civilian',5),
  militaryOption('将退役军官吸纳为实业董事','投资者信心+2、全国支持率−2、军政化程度−2；寡头统治进度+5。',{confidence:2,approval:-2},{militarization:-2},'oligarch',5)]}
 ];const e=pick(topics);return {type:'military-politics',title:e.title,text:e.text,options:e.options};
}
function militaryOption(label,detail,values,military,route,amount){return {...option(label,detail,values,route==='civilian'?{law:3,authority:-2}:route==='oligarch'?{elite:3,market:2}:route==='personal'?{authority:4}:{military:3,authority:1}),military, militaryRoute:route,militaryProgress:amount}}
const militaryInstitutionBefore=institutionEvent;institutionEvent=function(){return militaryActive()?militaryEvent():militaryInstitutionBefore()};
const militaryQueueBefore=queueQuarterEvents;
queueQuarterEvents=function(){militaryQueueBefore();if(militaryActive()&&!s.ended&&militaryState().lastEventQ<s.q){militaryState().lastEventQ=s.q;const e=militaryEvent();e.constitutionalSpecial=true;pushEvent(e)}};
const militaryPushBefore=pushEvent;
pushEvent=function(e){if(militaryGovernment()&&e?.title?.includes('司法施压曝光')){e={...e,text:'法庭收到的行政施压文件外泄，引发公众争议与军政部门的不满。',options:[{...option('承担干预后果','全国支持率−2、军方拥护度−2。',{approval:-2},{law:-2,authority:1}),military:{backing:-2}}]}}return militaryPushBefore(e)};
let militaryResolving=false;
const militaryResolveBefore=resolvePolitical;
resolvePolitical=function(i){const e=pstate().current,o=e?.options[i];if(!o||s.ended)return;const active=militaryActive();if(active&&o.military){militaryAdjust(o.military);if(o.militaryRoute)militaryMove(o.militaryRoute,o.militaryProgress,e.title+'：'+o.label);if(Number.isInteger(o.militaryMember)){const x=militaryState().members[o.militaryMember];if(x)x.agenda=clamp(x.agenda+o.militaryAgenda,0,100)}}militaryResolving=true;let result;try{result=militaryResolveBefore(i)}finally{militaryResolving=false}if(active){checkMilitaryTransition();checkPoliticalEnd();record();pSave()}return result};
function militaryQuarter(){if(!militaryActive()||s.ended||militaryState().lastQ>=s.q)return;const m=militaryState();m.lastQ=s.q;for(const x of m.members)if(!x.player)x.agenda=Math.max(20,x.agenda-1);
 if(m.militarization>=70){mod({approval:-.5});militaryAdjust({backing:.5})}else if(m.militarization<40){mod({approval:.5});militaryAdjust({backing:-1})}
 militaryAdjust({backing:s.policies.security>=5?.5:s.policies.security<3?-1:0});
 if(m.backing<20)mod({stability:-3,approval:-1});else if(m.backing<40)mod({stability:-1});
 militaryRecord(`季度评议：军方拥护度 ${fmt(m.backing,1)}%，军政化程度 ${fmt(m.militarization,1)}%。`);checkMilitaryTransition();checkPoliticalEnd();
}
const militaryMaintenanceBefore=politicalMaintenance;politicalMaintenance=function(){militaryMaintenanceBefore();militaryQuarter()};
const militaryCompleteBefore=completeReforms;
completeReforms=function(){militaryCompleteBefore();if(!militaryActive())return;for(const x of s.reforms){if(!x.completed||militaryState().completedSeen.includes(x.id))continue;militaryState().completedSeen.push(x.id);const route=MILITARY_REFORMS[REFORMS[x.id].key];if(route){militaryMove(route,8,REFORMS[x.id].name+'完成');if(route==='civilian')militaryAdjust({militarization:-3});if(route==='committee')militaryAdjust({backing:3});if(route==='personal')militaryAdjust({militarization:2})}}checkMilitaryTransition()};
const militaryReformDetailBefore=reformDetail;
reformDetail=function(uid){militaryReformDetailBefore(uid);if(!militaryActive())return;const offer=v3().offers.find(x=>x.uid===uid),r=offer&&REFORMS[offer.catalog],route=MILITARY_REFORMS[r?.key];if(route)$('modal').innerHTML+=`<details><summary>查看军政路线影响</summary><p>本改革完成后：${MILITARY_ROUTES[route]}进度+8${route==='civilian'?'、军政化程度−3':route==='committee'?'、军方拥护度+3':route==='personal'?'、军政化程度+2':''}。达到100%的转型路线将立即改变政体。</p></details>`};
function checkMilitaryTransition(){if(!militaryActive()||militaryTransitioning||militaryResolving||s.ended)return;const route=['civilian','personal','oligarch'].find(k=>militaryState().routes[k]>=100-1e-8);if(route)transitionMilitary(route);else if(militaryState().backing<=0)setGameEnd107('军事委员会罢免主席：军方拥护度归零，统治结束。')}
const militaryEndBefore=checkPoliticalEnd;checkPoliticalEnd=function(){checkMilitaryTransition();if(!s.ended)militaryEndBefore()};
const militarySaveBefore=save;save=function(){checkMilitaryTransition();return militarySaveBefore()};
function transitionMilitary(route){
 if(!militaryActive()||militaryTransitioning||!['civilian','personal','oligarch'].includes(route))return;militaryTransitioning=true;
 try{
  const m=militaryState(),p=pstate(),c=constitution(),stem=countryStem(),target={civilian:'symbolic',personal:'absolute',oligarch:'aristocratic'}[route],x=activeSit('military-transition');
  if(amendmentInProgress107())finishAmendment107(false,'国家制度重组，待决修宪案终止。');
  p.bill=null;c.docket=null;c.judges.forEach(j=>j.boosts=[]);m.resolved=route;m.routes={committee:0,civilian:0,personal:0,oligarch:0,[route]:100};m.history.push({q:s.q,text:MILITARY_ROUTES[route]+'完成，转为'+REGIMES.find(r=>r.id===target).name+'。'});
  p.queue=p.queue.filter(e=>e.type!=='military-politics');if(p.current?.type==='military-politics')p.current=p.queue.shift()||null;
  p.regime=target;c.competitiveClause=false;c.termLimit=0;c.authority='court';p.judicial=REGIMES.find(r=>r.id===target).ind;p.highCourtStreak=0;s.name=stem+REGIMES.find(r=>r.id===target).suffix;
  const names=factionNames12();p.factions=names.map((name,id)=>({id,name,seats:[40,22,16,12,10][id],relation:id===0?67:52,pledge:null,agendaDecay:0}));p.playerFaction=0;p.rulingParty=names[0];rules103().coalition=[0];
  for(const person of [...p.candidates,...p.members,...(s.judicialStaff?.reserve||[])])person.faction=person.id%5;
  while(p.members.length<9){const id=p.members.length,baseName=personName();p.members.push({id,baseName,name:baseName,honour:null,faction:id<4?id%5:id-4,trait:0,relation:55,last:-1,regionId:id%v3().regions.length,region:v3().regions[id%v3().regions.length].name})}
  p.members.forEach((x,i)=>{x.id=i;if(i>=4)x.faction=i-4;x.role=i<4?memberRole(i):names[x.faction]+(target==='symbolic'?'党团总召':'首席代表')});
  for(const [slot,item]of Object.entries(p.cabinet))if(item&&!cabinetEligible(p.candidates[item.candidate]))removeOfficial(slot);
  sits().transition={q:s.q,from:'tyranny',to:target,military:true};sits().democracyPressure=0;v3().settlementDue=false;
  ensureInstitutions();initializeBicameral108();initializeTaxation107();if(target==='aristocratic')initializeFamilies();
  if(x)endSituation(x,`${MILITARY_ROUTES[route]}完成，国家转为${regime().name}。军政专属指标停止计算，司法独立度从新制度的 ${p.judicial} 开始计算。${target==='symbolic'?'请组建参议院，并补齐内阁职位。':target==='aristocratic'?'贵族家族开始分掌产业与机关，中央集权度和合法性承认开始生效。':'主席确立君主地位，宰相与枢密院按君主专制规则运行。'}`);
  log('国家制度重组',MILITARY_ROUTES[route]+'：国家转为'+regime().name+'；既有经济、地区、改革、季度与执政历史保留。');militaryPageView='factions';
 }finally{militaryTransitioning=false}
}
// The spring movement can accelerate a civilian route, but cannot bypass the three outcomes.
const militarySpringBefore=transitionDemocracy;
transitionDemocracy=function(x){if(!militaryActive())return militarySpringBefore(x);militaryMove('civilian',100,'制宪会议完成文官移交');endSituation(x,'军队接受文官接管，国家转入新的行政安排。');checkMilitaryTransition()};
const militaryConsoleBefore=consoleFields107;
consoleFields107=function(){const rows=militaryConsoleBefore().filter(x=>!militaryGovernment()||!/(judicial|司法独立)/.test(x.key+' '+x.label));if(militaryActive()){for(const [key,label]of [['backing','军方拥护度'],['militarization','军政化程度']])rows.push({key:'military.'+key,label,group:'军政事务',get:()=>militaryState()[key],set:v=>militaryState()[key]=v,min:0,max:100,integer:false});for(const [key,label]of Object.entries(MILITARY_ROUTES))rows.push({key:'military.route.'+key,label:label+'进度',group:'军政事务',get:()=>militaryState().routes[key],set:v=>{const delta=v-militaryState().routes[key];if(delta>=0)militaryMove(key,delta,'控制台调整');else{militaryState().routes[key]=v;militaryState().routes[key==='committee'?'civilian':'committee']-=delta}},min:0,max:100,integer:false})}return rows};
function militaryGuide(entries){
 const add=(id,title,aliases,text)=>entries.push({id,title,aliases:[title,...aliases],text,category:'军政府与转型'});
 add('military-government','军政府制',['军政府','军事委员会主席'],'玩家担任军事委员会主席。积薪厝火负责派系沟通，军事委员会负责法案表决；宪法法庭受理释宪与修宪。开局额外出现枕戈待旦，不占普通或困难模式的危机名额。军政期间不计算司法独立度，不触发司法公平事件；竞争性选举修宪须等政体改变后才开放。');
 add('military-factions','积薪厝火',['军队建制派','军官革新派','文官治理派'],'监察机构的第一个页面。军队建制派整合国家发展利益，与文官治理派、军官革新派直接沟通；不展示席位图，也不进行投票。每派每季一次互动，消耗1行动点，可改变团体关系、军方拥护度、军政化程度或小幅推进路线。地方军政集团不设固定派系，其诉求通过事件出现。');
 add('military-council','军事委员会',['委员表决',...Object.values(MILITARY_VIEWS).map(x=>x.name),...MILITARY_RANKS],'开局随机12—15人，含玩家主席一席；文官治理派2—3人，其余为军队建制派。委员均有少校至中将军衔，至少一名中将和两名少将或准将，校官占多数。委员有国家发展、技术官僚、内部秩序、理想革新四种倾向；技术官僚的文官或个人集权方向各50%。每人一票，本案意愿达到60投赞成票；预算和改革过半，修宪三分之二后进入审查。委员与内阁的互动、忠诚分开计算。');
 add('military-backing','军方拥护度',['军方支持','军方拥护'],militaryBackingRules()+' 初始75—85。派系沟通、委员项目、事件与改革可调整。行政安全预算达到5%每季+0.5，低于3%每季−1。');
 add('militarization','军政化程度',['军政化'],'表示军队介入行政的程度，初始65—75。达到70每季公众支持−0.5、军方拥护+0.5；低于40每季公众支持+0.5、军方拥护−1；中间区间无此项损耗。文官试点与专业化改革降低军政化，扩充军政权限提高军政化。转型后停止计算。');
 add('military-transition','枕戈待旦',Object.values(MILITARY_ROUTES),'军政府开局长期局势。四条竞争路线合计100%，初始委员会统治100，其余0。推进路线优先减少委员会进度，不足时按比例减少其他路线。每季一次路线行动、1行动点；派系和委员互动小幅推进，季度特殊事件和指定改革完成也推进。文官政府100转为象征性民主；个人权力100转为君主专制；寡头统治100转为贵族制。维持共治不会结束局势。'+Object.values(militaryRouteSpecs).map(x=>x.label+'：'+x.detail).join(' '));
 add('military-reforms','改革与军政路线',['军政改革'],Object.entries(MILITARY_REFORMS).map(([key,route])=>`${REFORMS.find(r=>r.key===key)?.name||key}完成后推进${MILITARY_ROUTES[route]}8点`).join('；')+'。文官类同时军政化−3，共治类军方拥护+3，个人集权类军政化+2。仅实际完成时结算一次。');
 if(militaryGovernment()){
  const overrides={assembly:'电话中以监察机构为入口，分为积薪厝火和军事委员会。前者与派系交涉，后者与委员逐人沟通并表决法案。',judicial:'军政府期间司法独立度不适用，显示“-”。法官与宪制审查保留；政体转变后恢复新制度的司法独立规则。',judiciary:'宪法法庭受理修宪、释宪与法官互动。释宪依现行审查权归属表决；修宪先交军事委员会三分之二通过，再启动三季度司法审查。','constitutional-docket':'从宪法法庭提出修宪或释宪。修宪先取得军事委员会三分之二赞成，再进入三季度审查；释宪直接依现行审查机关规则表决。军政期间禁止增加竞争性选举条文。','competitive-amendment':'军政府期间不开放增加竞争性选举条文；通过枕戈待旦的三条路线决定国家转型。转型后按新制度开放修宪。','pass-rate':'军事委员会每人一票，个人本案意愿达到60即赞成。预算与改革须超过半数，修宪须达到三分之二。军衔不增加票数。'};
  for(const e of entries)if(overrides[e.id])e.text=overrides[e.id];
 }
}
function militaryTutorial(steps,scope,page){if(!militaryGovernment()||scope==='intro')return steps;
 if(page==='assembly')return [{page,id:'military-factions',selector:'.military-switch',title:'两处军政入口',text:'积薪厝火用于派系交涉，军事委员会用于逐人争取委员支持并表决法案。'},{page,id:'military-backing',selector:'#military-metrics',title:'军政关系',text:'全国支持、军方拥护与军政化共同影响路线条件和统治稳定。点击指标可查季度走势。'},...(militaryPageView==='committee'?[{page,id:'military-council',selector:'.military-member',title:'委员与表决',text:'每位委员有军衔、倾向和路线主张。会见可提高议程倾向；本案意愿达到60投赞成票，每人一票。'}]:[{page,id:'military-transition',selector:'#military-routes',title:'国家未来',text:'四条路线合计100%，转型路线达到100即改变政体。正式推进条件在枕戈待旦局势中查看。'}])];
 if(page==='judiciary')return steps.filter(x=>x.id!=='judicial');return steps;
}
const militaryValidBefore=validSave;
validSave=function(v){if(!militaryValidBefore(v))return false;const m=v.military;if(!m)return true;const finite=n=>Number.isFinite(n)&&n>=0&&n<=100;
 if(m.version!==1||!finite(m.backing)||!finite(m.militarization)||!m.routes||Object.keys(m.routes).length!==4||Object.keys(MILITARY_ROUTES).some(k=>!finite(m.routes[k]))||Math.abs(Object.values(m.routes).reduce((a,b)=>a+b,0)-100)>1e-6||![null,'civilian','personal','oligarch'].includes(m.resolved))return false;
 if(!Array.isArray(m.members)||m.members.length<12||m.members.length>15||m.members.some((x,i)=>x.id!==i||typeof x.baseName!=='string'||typeof x.name!=='string'||!MILITARY_RANKS.includes(x.rank)||![0,1].includes(x.faction)||!Object.hasOwn(MILITARY_VIEWS,x.view)||!Object.hasOwn(MILITARY_ROUTES,x.route)||!finite(x.agenda)||!finite(x.relation)||typeof x.player!=='boolean'||x.player!==(i===0)||!Number.isInteger(x.last)||x.last>v.q||x.candidate!==null&&(!Number.isInteger(x.candidate)||!v.political.candidates[x.candidate])))return false;
 if(m.members.filter(x=>x.faction===1).length<2||m.members.filter(x=>x.faction===1).length>3||!m.members.some(x=>x.rank==='中将')||m.members.filter(x=>['少将','准将'].includes(x.rank)).length<2||new Set(m.members.map(x=>x.name)).size!==m.members.length)return false;
 if(!Number.isInteger(m.lastQ)||m.lastQ>v.q||!Number.isInteger(m.lastEventQ)||m.lastEventQ>v.q||!Array.isArray(m.history)||m.history.some(h=>!Number.isInteger(h.q)||h.q>v.q||typeof h.text!=='string')||!Array.isArray(m.voteHistory)||!Array.isArray(m.completedSeen)||m.completedSeen.some(i=>!REFORMS[i]))return false;
 const active=v.situations.active.filter(x=>x.kind==='military-transition');if(!m.resolved){if(v.political.regime!=='tyranny'||active.length!==1||active[0].id!==m.situationId||v.political.factions.length!==3||v.situations.active.some(x=>x.kind==='justice'))return false;for(const x of m.members)if(x.candidate!==null&&v.political.candidates[x.candidate].judicialCareer)return false}else if(active.length)return false;return true};
// Inactive judicial effects are omitted from choices and reports as well as from calculation.
function militaryEffectText(text){return String(text).replace(/司法独立(?:度|变化)?\s*[＋+−-]\s*\d+(?:\.\d+)?\s*[；，。]?/g,'').replace(/；[；。]/g,'；')}
const militaryImpactBefore=impactText;
impactText=function(values){if(militaryGovernment()){values={...values};delete values.judicial}return militaryImpactBefore(values)};
const militaryOptionBefore=option;
option=function(...args){const o=militaryOptionBefore(...args);if(militaryGovernment()){o.detail=militaryEffectText(o.detail);o.values={...o.values};delete o.values.judicial}return o};
const militarySituationChoicesBefore=situationActions;
situationActions=function(x){const actions=militarySituationChoicesBefore(x);if(!militaryGovernment())return actions;return actions.map(a=>({...a,detail:militaryEffectText(a.detail).replace('期间司法独立须保持 ＞40、福利 ＞8%','期间须维持福利 ＞8%并保持改革可信度')}))};
const militaryOfficialBefore=officialPanel;
officialPanel=function(k){let html=militaryOfficialBefore(k);return militaryGovernment()?militaryEffectText(html).replace('任命司法主管或政府首脑也会立即影响司法独立。','军政期间的宪制事务由宪法法庭办理。'):html};
const militaryAppointBefore=appointPreview;
appointPreview=function(k,id){militaryAppointBefore(k,id);if(militaryGovernment())$('modal').innerHTML=militaryEffectText($('modal').innerHTML)};
const militarySitPageBefore=situationsPage;
situationsPage=function(){let html=militarySitPageBefore();return militaryGovernment()?html.replace('一个长期问题','一个长期问题 + 枕戈待旦'):html};

const militaryStartBefore=startSituation;
startSituation=function(kind,opening=false){if(kind==='military-transition'&&!militaryActive())return null;return militaryStartBefore(kind,opening)};

// Keep department directions meaningful while the independence scalar is suspended.
const militaryTaskBefore=departmentTask105;
departmentTask105=function(...args){const task=militaryTaskBefore(...args);if(!militaryGovernment()||!task)return task;const texts={justice_independent:['保障审判程序','保障审判程序与监督，提高信心；程序调整会降低短期稳定。'],justice_control:['强化行政司法协同','强化军政部门与法庭的流程协调，提升短期稳定，但削弱公众信任。'],interior_security:['强化治安管控','集中资源维持治安，稳定提升较快，但会损害公众支持。']};const values={...task.values};delete values.judicial;return {...task,values,...(texts[task.id]?{name:texts[task.id][0],text:texts[task.id][1]}:{})}};
const militaryTaskOptionsBefore=cabinetTaskOptions105;
cabinetTaskOptions105=function(k){return militaryTaskOptionsBefore(k).map(([id,name])=>[id,militaryGovernment()&&id==='justice_independent'?'保障审判程序':name])};
const militaryTaskStatusBefore=taskStatus105;
taskStatus105=function(...args){const html=militaryTaskStatusBefore(...args);return militaryGovernment()?html.replace('保障司法独立','保障审判程序'):html};
