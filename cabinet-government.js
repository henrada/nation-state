/* Cabinet tenure, budget confidence and regime-specific dismissal costs. */
const CABINET_CONFIDENCE_EVENT='cabinet-confidence';
const CABINET_RULES={
 semi:'半总统制中的总统仅可补任内阁空缺。在任总理与阁员的去留由政府信任程序处理。连续三次预算表决受阻后，出现“政府停摆导致不信任案”：批准则解散整个政府，拒绝则全国支持率降低8个百分点。预算正式生效后清零受阻次数；上院退回也计一次，改革案单独处理。',
 dismissal:'军政府、贵族制与神权共和制中，撤换普通阁员在原有后果之外，额外降低其所属派系团体关系5点、政治稳定2点；撤换政府首脑额外降低所属派系团体关系10点、政治稳定4点。替换在任官员同样承担这些后果。',
 slots:'设有总理、宰相、首相或同等政府首脑职位时，内阁只保留一位政府首脑。由玩家直接担任政府首脑的君主立宪制与西敏议会制保留副职；联邦委员会按集体施政设置委员。'
};
function semiCabinetProtected(){return regime().id==='semi'}
function cabinetRemovalBlocked(k){return semiCabinetProtected()&&!!pstate().cabinet[k]}
function cabinetConfidencePending(){return [pstate().current,...pstate().queue].some(e=>e?.type===CABINET_CONFIDENCE_EVENT)}
function normalizeCabinetGovernment(){
 const p=pstate();
 if(p.budgetDefeats===undefined||!semiCabinetProtected())p.budgetDefeats=0;
 if(regime().head){
  delete p.cabinet.deputy;
  // Completed work remains in the historical department record; it grants no new award.
  if(!rules103().proposals.deputy?.completed)delete rules103().proposals.deputy;
  if(cabinetSlot==='deputy')cabinetSlot='head';
 }
 for(const k of cabinetSlots103()){
  if(!Object.hasOwn(p.cabinet,k))p.cabinet[k]=null;
  rules103().proposals[k]??={progress:0,completed:false,spent:0,actions:[]};
 }
}
const initBeforeCabinetGovernment=initPolitics;
initPolitics=function(...args){if(s?.political&&s.rules103)normalizeCabinetGovernment();initBeforeCabinetGovernment(...args);normalizeCabinetGovernment()};
const saveBeforeCabinetGovernment=save;
save=function(){if(s?.political&&s.rules103)normalizeCabinetGovernment();return saveBeforeCabinetGovernment()};

// Called at real ballot outcomes, after action checks. A lower-house referral is
// not an enacted budget. Unrelated bills never affect this streak.
function budgetConfidenceOutcome(b,passed){
 if(!semiCabinetProtected()||b?.kind!=='budget')return;
 const p=pstate();
 if(passed){p.budgetDefeats=0;return}
 if(cabinetConfidencePending())return;
 p.budgetDefeats=(p.budgetDefeats||0)+1;
 if(p.budgetDefeats<3)return;
 p.budgetDefeats=0;
 const e=eventFrom('政府停摆导致不信任案','预算表决已连续三次受阻，政府陷入施政僵局。立法机构提出对整个政府的不信任案，请你决定是否批准解散政府。现行预算继续执行。',[
  option('批准不信任案，解散政府','总理与全部阁员离任，所有内阁职位转为空缺。随后可任命新政府，部门提案进度与成果保留。',{}, {law:3,authority:-2}),
  option('拒绝不信任案，保留政府','全国支持率−8个百分点，现任总理与阁员留任。',{approval:-8},{authority:3,law:-2})
 ],CABINET_CONFIDENCE_EVENT);
 e.constitutionalSpecial=true;pushEvent(e);showPoliticalEvent();
}
const voteBeforeCabinetConfidence=voteBill,upperReviewBeforeCabinetConfidence=upperReview108;
function pendingCabinetConfidenceBlocksVote(){
 if(!semiCabinetProtected()||!cabinetConfidencePending())return false;
 showPoliticalEvent();return true;
}
voteBill=function(){if(pendingCabinetConfidenceBlocksVote())return;return voteBeforeCabinetConfidence()};
upperReview108=function(){if(pendingCabinetConfidenceBlocksVote())return;return upperReviewBeforeCabinetConfidence()};
const resolveBeforeCabinetConfidence=resolvePolitical;
resolvePolitical=function(i){
 const p=pstate(),e=p.current;if(!e?.options[i]||s.ended)return;
 if(e.type===CABINET_CONFIDENCE_EVENT){
  if(!semiCabinetProtected()){
   e.options=e.options.map(()=>option('结束原政府信任程序','国家政体已改变，本次政府信任程序结束。'));
  }else if(i===0){
   const departing=cabinetSlots103().filter(k=>p.cabinet[k]);
   log('政府解散',departing.map(k=>office(k)+' '+p.candidates[p.cabinet[k].candidate].name).join('、'));
   for(const k of cabinetSlots103())p.cabinet[k]=null;
   p.memory.dismissals+=departing.length;
  }
  p.budgetDefeats=0;
 }
 return resolveBeforeCabinetConfidence(i);
};
const assessmentKindBeforeCabinetConfidence=eventAssessmentKind107;
eventAssessmentKind107=function(e,o){return e.type===CABINET_CONFIDENCE_EVENT?'head':assessmentKindBeforeCabinetConfidence(e,o)};

const dismissalImpactBeforeCabinetGovernment=dismissalImpact;
dismissalImpact=function(k){
 const result=dismissalImpactBeforeCabinetGovernment(k);
 if(['tyranny','aristocratic','theorepublic'].includes(regime().id)){
  result.relation-=k==='head'?10:5;result.stability-=k==='head'?4:2;
 }
 return result;
};
const SEMI_REMOVAL_MESSAGE='内阁去留须经政府信任程序决定；请选择空缺职位进行补任。';
const dismissPreviewBeforeCabinetGovernment=dismissPreview,dismissBeforeCabinetGovernment=dismissOfficial;
dismissPreview=function(k){if(cabinetRemovalBlocked(k))return toast(SEMI_REMOVAL_MESSAGE);return dismissPreviewBeforeCabinetGovernment(k)};
dismissOfficial=function(k){if(cabinetRemovalBlocked(k))return toast(SEMI_REMOVAL_MESSAGE);return dismissBeforeCabinetGovernment(k)};
const replaceBeforeCabinetGovernment=replacementDialog,appointPreviewBeforeCabinetGovernment=appointPreview,appointBeforeCabinetGovernment=appointOfficial;
replacementDialog=function(k){if(cabinetRemovalBlocked(k))return toast(SEMI_REMOVAL_MESSAGE);return replaceBeforeCabinetGovernment(k)};
appointPreview=function(k,id){if(cabinetRemovalBlocked(k))return toast(SEMI_REMOVAL_MESSAGE);return appointPreviewBeforeCabinetGovernment(k,id)};
appointOfficial=function(k,id){if(cabinetRemovalBlocked(k))return toast(SEMI_REMOVAL_MESSAGE);return appointBeforeCabinetGovernment(k,id)};
const officialBeforeCabinetGovernment=officialPanel;
officialPanel=function(k){
 let html=officialBeforeCabinetGovernment(k);
 if(cabinetRemovalBlocked(k))html=html.replace(/<button[^>]*onclick="(?:dismissPreview|replacementDialog)\([^>]*>[\s\S]*?<\/button>/g,'');
 return html;
};
const cabinetBeforeCabinetGovernment=cabinet;
cabinet=function(){
 let html=cabinetBeforeCabinetGovernment();
 if(semiCabinetProtected()){
  if(pstate().cabinet[cabinetSlot])html=html.replace(/<div class="section-label"><h3>候选人名册<\/h3>[\s\S]*?(?=<\/section><\/div><div class="card")/,'');
  html=`<div class="card"><b>政府任免与信任</b><p>在任总理与阁员的去留由政府信任程序处理；空缺职位可由总统补任。</p><details><summary>查看任免与预算受阻规则</summary><p>${CABINET_RULES.semi}</p><p>连续预算受阻次数：${pstate().budgetDefeats||0} / 3</p></details></div>`+html;
 }else if(['tyranny','aristocratic','theorepublic'].includes(regime().id)){
  html=`<details class="card"><summary>查看罢免的额外政治后果</summary><p>${CABINET_RULES.dismissal}</p></details>`+html;
 }
 return html;
};
// Scandal accountability offers the same tenure protection as the cabinet page.
const situationActionsBeforeCabinetGovernment=situationActions;
situationActions=function(x){const actions=situationActionsBeforeCabinetGovernment(x);return semiCabinetProtected()&&x.kind==='scandal'?actions.filter(a=>a.key!=='dismiss'):actions};

function cabinetGovernmentGuide(entries){
 const find=id=>entries.find(e=>e.id===id);
 const add=(id,title,aliases,text)=>entries.push({id,title,aliases,text,category:'内阁与科研'});
 add('cabinet-tenure','政府任免与信任',['政府停摆导致不信任案','预算连续受阻','解散政府'],CABINET_RULES.semi);
 add('cabinet-dismissal-cost','罢免的额外政治后果',['罢免代价','派系支持降低'],CABINET_RULES.dismissal);
 add('cabinet-leadership','政府首脑与副职',['副宰相','副首相','内阁职位设置'],CABINET_RULES.slots);
 if(semiCabinetProtected()){
  for(const id of ['appoint','replace','dismiss','office-head','premier'])if(find(id))find(id).text=CABINET_RULES.semi;
  for(const [key,,job]of PORTFOLIOS)if(find('office-'+key))find('office-'+key).text=`负责${job}，可安排本季任务并推进部门提案。空缺时可任命；在任阁员的去留由政府信任程序处理。`;
 }
 if(['tyranny','aristocratic','theorepublic'].includes(regime().id))for(const id of ['dismiss','replace'])if(find(id))find(id).text+=' '+CABINET_RULES.dismissal;
 if(find('regime-semi'))find('regime-semi').text+=' '+CABINET_RULES.semi;
 if(find('office-deputy'))find('office-deputy').text=CABINET_RULES.slots;
}
const validBeforeCabinetGovernment=validSave;
validSave=function(v){return validBeforeCabinetGovernment(v)&&(v.political?.budgetDefeats===undefined||Number.isInteger(v.political.budgetDefeats)&&v.political.budgetDefeats>=0&&v.political.budgetDefeats<3)};
