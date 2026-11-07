/* The handbook reads the existing reference catalogue; it never writes game state. */
const HANDBOOK_RECENTS_KEY='nation-state-handbook-recent';
const handbookState={entries:[],byId:new Map(),selected:'stability',query:'',recent:[],focus:null,category:'basics'};
function hbText(zh,en){return typeof gameLanguage!=='undefined'&&gameLanguage==='en'?en:zh}
function hbLocalized(text){return typeof translateGameText==='function'?translateGameText(text):text}
const HANDBOOK_CATEGORIES=[
 ['basics','执政基础','Governing Essentials','book'],['economy','财政与经济','Finance & Economy','ledger'],
 ['legislature','立法机构','Legislative Institutions','assembly'],['cabinet','内阁与人事','Cabinet & Appointments','assembly'],
 ['justice','司法与宪法','Judiciary & Constitution','scales'],['elections','民意与选举','Opinion & Elections','map'],
 ['reforms','结构性改革','Structural Reforms','ledger'],['situations','局势与危机','Situations & Crises','map'],
 ['systems','特殊政体','Government Systems','assembly'],['records','数据与任期评估','Records & Assessment','book']
];
function hbCategoryTitle(id){if(id==='legislature'&&typeof institutionSectionName==='function'&&institutionSectionName()==='监察机构')return hbText('监察机构','Oversight Institutions');const c=HANDBOOK_CATEGORIES.find(c=>c[0]===id);return c?hbText(c[1],c[2]):id}
function hbCategory(entry){
 const id=entry.id,is=(...names)=>names.some(name=>entry.category===name||entry.category===hbLocalized(name));
 if(['country','calendar','ap','approval','stability','confidence','player','overview','advance','alerts','pressure','guide','tutorial','page-tutorial'].includes(id)||id.startsWith('ap-')||/^office-(desk|files|phone|map|calendar)$/.test(id))return 'basics';
 if(id.startsWith('reform-')||['reforms','sports','culture'].includes(id))return 'reforms';
 if(['judicial','judicial-pressure','judiciary','court-actions','casting-vote','competitive-amendment','pluralism-amendment'].includes(id)||/^(constitution|judg|judicial)/.test(id))return 'justice';
 if(is('家族政治','军政府与转型','联邦委员会制')||id.startsWith('regime-')||['party-routes','clergy-loyalty'].includes(id))return 'systems';
 if(is('局势与处置','局势处置')||['situations','government','minority-issue','forced-migration','forced-assimilation'].includes(id))return 'situations';
 if(is('地区与选举','选举与换届')||['elections','capital-city'].includes(id))return 'elections';
 if(is('内阁与科研','内阁与人事','人物倾向','内阁任务','部长提案')||/^(office-|role-)/.test(id)||['cabinet','appoint','replace','dismiss','premier','chancellor','finance-minister','honours'].includes(id))return 'cabinet';
 if(is('立法与政治','两院立法')||id.startsWith('member-')||['assembly','negotiate','faction-details','meet','vote','withdraw','whip'].includes(id))return 'legislature';
 if(is('经济与财政')||['budget','budget-submit','budget-reset'].includes(id))return 'economy';
 return 'records';
}
function hbSubgroup(entry){
 const id=entry.id,category=hbCategory(entry);
 if(category==='basics'){
  if(id.startsWith('ap-'))return 'action-modes';
  if(['overview','advance','alerts','guide','tutorial','page-tutorial'].includes(id)||id.startsWith('office-'))return 'navigation';
 }
 if(category==='cabinet'){
  if(/^programme-.+-(action|trait)-/.test(id)||/^programme-(head|deputy|foreign|defence|justice|interior|labour|education|health|culture|environment)$/.test(id))return 'proposals';
  if(id.startsWith('task-'))return 'tasks';if(id.startsWith('trait-'))return 'traits';
  if(/^(office-|role-)/.test(id))return 'offices';
 }
 if(category==='systems'&&id.startsWith('regime-'))return 'regimes';
 if(category==='situations'&&id.startsWith('situation-action-'))return 'responses';
 if(category==='records'&&(id.startsWith('ideology-')||id.startsWith('axis-')))return 'assessment';
 if(category==='justice'&&id.startsWith('judge-view-'))return 'judges';
 return '';
}
function hbSubgroupTitle(id){const names={navigation:['办公桌与功能入口','Desk & Navigation'],'action-modes':['行动点模式','Action Point Modes'],proposals:['部长提案','Departmental Proposals'],tasks:['任务方向','Assignments'],traits:['人物倾向','Political Outlooks'],offices:['职务与称号','Offices & Titles'],regimes:['各类政体','Government Systems'],responses:['局势处置选项','Situation Responses'],assessment:['评估维度与统治倾向','Assessment & Ideologies'],judges:['法官倾向','Judicial Outlooks']};return names[id]?hbText(...names[id]):id}
function hbIcon(name){
 const paths={
  book:'M24 10C18 6 10 6 4 8v31c7-2 14-2 20 2 6-4 13-4 20-2V8c-6-2-14-2-20 2Zm0 0v31M9 13c4-1 8 0 11 1M9 19c4-1 8 0 11 1M9 25c4-1 8 0 11 1M9 31c4-1 8 0 11 1M28 14c3-1 7-2 11-1M28 20c3-1 7-2 11-1M28 26c3-1 7-2 11-1M28 32c3-1 7-2 11-1',
  assembly:'M3 16 24 5l21 11H3Zm4 25h34M4 45h40M10 20v17m7-17v17m14-17v17m7-17v17M8 20h11m10 0h11M8 37h11m10 0h11M21 20h6v17h-6V20Z',
  scales:'M24 5v35m-8 4h16M7 13h34M24 9l-4 4 4 4 4-4-4-4ZM12 14 5 31h14l-7-17Zm24 0-7 17h14l-7-17ZM5 31c0 8 14 8 14 0m10 0c0 8 14 8 14 0',
  ledger:'M10 8h31v30H10a5 5 0 0 0 0 10M10 8a5 5 0 0 0-5 5v30a5 5 0 0 0 5 5h31M12 13h24M12 19h24M12 25h16M12 31h18M11 43h30',
  map:'m3 9 14-4 14 4 14-4v34l-14 4-14-4-14 4V9Zm14-4v34m14-30v34M7 18l7 3m7-5 7 6m7 4 6-9M8 33l5-5m10 3 4 5',
  search:'M32 32 44 44M36 21a15 15 0 1 1-30 0 15 15 0 0 1 30 0Z',
  desk:'M3 25h42M7 25v18m34-18v18M11 15h23v10M16 15V8h12v7M10 33h7m14 0h7',
  close:'m12 12 24 24M36 12 12 36'
 };
 return `<svg class="hb-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.book}"/></svg>`;
}
function hbPrepareEntries(){
 const unique=new Map();for(const entry of guideCatalog104()){if(!entry?.id)continue;const old=unique.get(entry.id);unique.set(entry.id,{...entry,aliases:[...new Set([...(old?.aliases||[]),...entry.aliases])]})}
 handbookState.entries=[...unique.values()];handbookState.byId=unique;guideEntries104=handbookState.entries;
 try{const saved=JSON.parse(localStorage.getItem(HANDBOOK_RECENTS_KEY)||'[]');handbookState.recent=Array.isArray(saved)?saved.filter(id=>typeof id==='string'&&unique.has(id)).slice(0,6):[]}catch(_){handbookState.recent=[]}
 if(!unique.has(handbookState.selected))handbookState.selected='stability';
}
function hbEntryButton(entry,extra=''){return `<button type="button" class="hb-entry-link ${extra}" data-hb-entry="${esc(entry.id)}"${entry.id===handbookState.selected?' aria-current="page"':''}>${esc(entry.title)}</button>`}
function hbSidebarHTML(){
 const order=['country','calendar','ap','approval','stability','confidence','player'];
 return HANDBOOK_CATEGORIES.map(([id])=>{
  let entries=handbookState.entries.filter(e=>hbCategory(e)===id);if(!entries.length)return '';
  if(id==='basics')entries.sort((a,b)=>{const ai=order.indexOf(a.id),bi=order.indexOf(b.id);return (ai<0?100:ai)-(bi<0?100:bi)});
  const direct=entries.filter(e=>!hbSubgroup(e)),groups=[...new Set(entries.map(hbSubgroup).filter(Boolean))];
  return `<details class="hb-category" data-hb-category="${id}"${hbCategory(handbookState.byId.get(handbookState.selected))===id?' open':''}><summary>${esc(hbCategoryTitle(id))}</summary><div class="hb-category-items">${direct.map(e=>hbEntryButton(e)).join('')}${groups.map(group=>`<details class="hb-subgroup" data-hb-subgroup="${group}"><summary>${esc(hbSubgroupTitle(group))}</summary>${entries.filter(e=>hbSubgroup(e)===group).map(e=>hbEntryButton(e)).join('')}</details>`).join('')}</div></details>`;
 }).join('');
}
function hbRecentHTML(){return handbookState.recent.filter(id=>id!==handbookState.selected).slice(0,4).map(id=>hbEntryButton(handbookState.byId.get(id))).join('')||`<p>${hbText('尚无查阅记录','No recently viewed entries')}</p>`}
function hbAliases(entry){const seen=new Set([guideNormalize104(entry.title)]);return entry.aliases.map(hbLocalized).filter(alias=>{const key=guideNormalize104(alias);if(seen.has(key))return false;seen.add(key);return true})}
function hbParagraphs(text){return String(text).split(/\n+/).filter(Boolean).map(p=>`<p>${esc(p)}</p>`).join('')}
function hbFold(title,hint,html,extra=''){return `<details class="hb-rule ${extra}"><summary><span>${esc(title)}</span>${hint?`<small>${esc(hint)}</small>`:''}</summary><div class="hb-rule-body">${html}</div></details>`}
function hbRelated(entry){
 const links={stability:['approval','policy-security','rebellion'],approval:['stability','forecast','spring'],ap:['research','calendar','advance'],rate:['inflation','yield','centralbank'],debt:['balance','interest','economy-situation'],research:['policy-education','ap','programme-education'],'pass-rate':['agenda','full-support','effective-agenda'],forecast:['local-demands','regional-start','elections'],guide:['tutorial','page-tutorial','office-desk']};
 let ids=links[entry.id];
 if(!ids){ids=[];const category=hbCategory(entry);for(const candidate of handbookState.entries){if(candidate.id!==entry.id&&hbCategory(candidate)===category&&!hbSubgroup(candidate))ids.push(candidate.id);if(ids.length===3)break}}
 return ids.filter(id=>handbookState.byId.has(id)).slice(0,3).map(id=>hbEntryButton(handbookState.byId.get(id),'hb-related-link')).join('');
}
function hbArticleHTML(entry){
 let lead=entry.text.match(/^.*?(?:[。！？]|\.(?:\s|$)|$)/s)?.[0]||entry.text,sections='';
 const original=hbParagraphs(entry.text),aliases=hbAliases(entry);
 if(entry.id==='stability'){
  lead=hbText('衡量国家秩序、政府运作与社会冲突的可控程度。\n支持率反映民意，稳定度反映国家能否维持正常运转。','Measures how well the country maintains order, functioning government and control of social conflict.\nApproval measures popular support; stability measures the state’s ability to keep functioning.');
  sections+=hbFold(hbText('数值与风险','Values & Risks'),hbText('0—100 · 低于20会结束统治','0–100 · Below 20 ends your rule'),`<dl class="hb-values"><div><dt>${hbText('数值范围','Range')}</dt><dd>0—100</dd></div><div><dt>${hbText('低于 35','Below 35')}</dt><dd class="hb-caution">${hbText('持续低位会增加叛乱风险','Prolonged low stability raises rebellion risk')}</dd></div><div><dt>${hbText('低于 20','Below 20')}</dt><dd class="hb-danger">${hbText('统治结束','Your rule ends')}</dd></div></dl><p>${hbText('叛乱还受持续季度与未完成地方诉求影响。管理员模式不触发失败结局。','Rebellion also depends on consecutive quarters and unmet regional demands. Administrator Mode prevents defeat endings.')}</p>`);
  sections+=hbFold(hbText('如何提高稳定度','Improving Stability'),hbText('事件选择、局势应对、行政安全预算','Events, situation responses and security spending'),hbParagraphs(hbText('部分事件和局势选项可以提高稳定度。增加行政安全预算，会逐步提高经济模型中的稳定目标；具体费用、效果与生效时间以对应选项为准。','Some event choices and situation responses improve stability. Higher administration-and-security spending gradually raises the model’s stability target. Consult each option for its costs, effects and timing.')));
  sections+=hbFold(hbText('哪些行为会降低稳定度','What Reduces Stability'),hbText('危机、预算削减、官员去职','Crises, spending cuts and dismissals'),hbParagraphs(hbText('危机、削减行政安全预算，以及撤换部长、总理或宰相等行为可能降低稳定度。撤换后果还取决于官员政绩和国家政体。','Crises, cuts to administration-and-security spending and dismissing officials can reduce stability. Dismissal penalties also depend on the official’s record and your government system.')));
  sections+=hbFold(hbText('叛乱的具体触发条件','Rebellion Conditions'),hbText('连续季度、地方诉求与触发概率','Consecutive quarters, demands and probability'),`<ol><li>${hbText('政治稳定连续两季度低于35。','Stability stays below 35 for two consecutive quarters.')}</li><li>${hbText('至少三个地区尚未完成地方诉求。','At least three regional demands remain unfulfilled.')}</li><li>${hbText('满足上述条件后，每季度有35%的概率触发叛乱。','Once both conditions hold, each quarter has a 35% chance of triggering a rebellion.')}</li></ol><p>${hbText('并非低于35就必然发生叛乱。部分特殊政体另有独立触发机制。','Stability below 35 does not guarantee rebellion. Certain government systems also have separate triggers.')}</p>`);
  sections+=hbFold(hbText('制度与完整说明','System Rules & Full Reference'),hbText('查看当前规则说明','Read the complete entry'),original+(s?.adminMode?`<p class="hb-caution">${hbText('本局已开启管理员模式，不会因稳定度过低而结束。','Administrator Mode is active; low stability cannot end this game.')}</p>`:''));
 }else if(entry.id==='rate'){
  lead=hbText('中央银行调节货币环境的基准利率。','The central bank’s benchmark for monetary conditions.');
  sections+=hbFold(hbText('由谁决定','Who Sets the Rate'),hbText('中央银行根据经济形势调整','The central bank responds to economic conditions'),hbParagraphs(hbText('央行根据通胀与经济增长自主调整政策利率，玩家不能直接设定。','The central bank adjusts its policy rate in response to inflation and economic growth. You cannot set it directly.')));
  sections+=hbFold(hbText('加息与降息的影响','Effects of Rate Changes'),hbText('投资、通胀与借贷成本','Investment, inflation and borrowing costs'),hbParagraphs(hbText('加息通常抑制投资需求和通胀，但抬高借贷成本；降息支持经济活动，也可能增加通胀压力。','Higher rates usually restrain investment demand and inflation, but increase borrowing costs. Lower rates support economic activity and may increase inflationary pressure.')));
  sections+=hbFold(hbText('完整规则与报告','Full Rules & Reports'),hbText('查看政策说明与相关报告','Read the policy reference'),original);
 }else{
  sections=hbFold(hbText('规则与影响','Rules & Effects'),hbText('展开查看完整说明','Expand to read the full reference'),original);
 }
 if(aliases.length)sections+=hbFold(hbText('可搜索的别称','Searchable Aliases'),aliases.slice(0,3).join(hbText('、',', ')),`<p>${aliases.map(esc).join(hbText('、',', '))}</p>`,'hb-aliases');
 const related=hbRelated(entry);
 return `<article class="hb-article" data-hb-article="${esc(entry.id)}"><div class="hb-breadcrumb">${esc(hbCategoryTitle(hbCategory(entry)))} <span>/</span> ${esc(entry.title)}</div><div class="hb-title-line"><h3 id="handbook-entry-title" tabindex="-1">${esc(entry.title)}</h3>${aliases.length?`<span>${esc(aliases.slice(0,2).join(' · '))}</span>`:''}</div><div class="hb-intro">${hbParagraphs(lead)}</div><div class="hb-rules">${sections}</div>${related?`<section class="hb-related" aria-label="${hbText('相关条目','Related Entries')}"><h4>${hbText('相关条目','Related Entries')}</h4>${related}</section>`:''}</article>`;
}
function hbSelectEntry(id,{clearSearch=true,remember=true,focus=false}={}){
 const entry=handbookState.byId.get(id);if(!entry)return;handbookState.selected=id;handbookState.category=hbCategory(entry);
 if(clearSearch){handbookState.query='';if($('guide-query'))$('guide-query').value=''}
 $('guide-results').innerHTML=hbArticleHTML(entry);$('guide-results').scrollTop=0;
 if(remember){handbookState.recent=[id,...handbookState.recent.filter(x=>x!==id)].slice(0,6);try{localStorage.setItem(HANDBOOK_RECENTS_KEY,JSON.stringify(handbookState.recent))}catch(_){}}
 if($('handbook-recent'))$('handbook-recent').innerHTML=hbRecentHTML();
 const panel=$('handbook-modal');
 panel?.querySelectorAll?.('[data-hb-entry]').forEach(button=>{if(button.dataset.hbEntry===id)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')});
 panel?.querySelectorAll?.('[data-hb-category]').forEach(details=>{if(details.dataset.hbCategory===handbookState.category)details.open=true});
 panel?.querySelectorAll?.('[data-hb-subgroup]').forEach(details=>{if(details.dataset.hbSubgroup===hbSubgroup(entry))details.open=true});
 panel?.querySelectorAll?.('[data-hb-shortcut]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.hbShortcut===handbookState.category)));
 hbSetDirectory(false);hbSearchStatus();if(focus)$('handbook-entry-title')?.focus?.({preventScroll:true});
}
function hbSearchStatus(message=''){
 if($('handbook-search-status'))$('handbook-search-status').textContent=message;
 if($('handbook-search-clear'))$('handbook-search-clear').hidden=!handbookState.query;
}
function hbSearch(query){
 if(!handbookState.entries.length)hbPrepareEntries();
 const normalized=String(query??'');handbookState.query=normalized;
 const input=$('guide-query');if(input&&input.value!==normalized)input.value=hbLocalized(normalized);
 if(!normalized.trim()){hbSelectEntry(handbookState.selected,{clearSearch:false,remember:false});return}
 const matches=guideMatches104(normalized,handbookState.entries);
 const count=hbText('找到 '+matches.length+' 个条目',matches.length+' matching '+(matches.length===1?'entry':'entries'));
 if(matches.length===1){hbSelectEntry(matches[0].id,{clearSearch:false});hbSearchStatus(count);return}
 $('guide-results').innerHTML=matches.length?`<section class="hb-search-results"><div class="hb-breadcrumb">${hbText('概念搜索','Concept Search')}</div><h3>${esc(hbText('搜索结果','Search Results'))}</h3><p class="hb-result-count">${esc(count)}</p>${matches.map(e=>`<button type="button" class="hb-search-result" data-hb-entry="${esc(e.id)}"><span>${esc(e.title)}</span><small>${esc(hbCategoryTitle(hbCategory(e)))}</small><b aria-hidden="true">›</b></button>`).join('')}</section>`:`<div class="hb-empty">${hbIcon('search')}<h3>${hbText('未找到对应条目','No Matching Entry')}</h3><p>${hbText('该概念不存在于此游戏，请检查输入是否正确','This concept does not exist in this game. Please check your search.')}</p><p>${hbText('可尝试别称，例如“稳定”“稳定度”或“政治稳定”。','Try a synonym, such as “stability” or “political stability”.')}</p><button type="button" data-hb-clear>${hbText('返回当前条目','Return to Current Entry')}</button></div>`;
 $('guide-results').scrollTop=0;hbSearchStatus(count);
}
function hbSetDirectory(open){const dialog=$('handbook-modal');dialog?.classList?.toggle('hb-directory-open',open);$('handbook-directory-toggle')?.setAttribute?.('aria-expanded',String(open))}
function hbClose(toDesk=false){
 const panel=$('handbook-modal');panel?.close?.();hbSetDirectory(false);
 if(toDesk&&typeof officeUI!=='undefined'&&!$('modal').open)officeUI.close();
 handbookState.focus?.focus?.({preventScroll:true});
}
function hbOpen(){
 hbPrepareEntries();handbookState.query='';handbookState.focus=typeof document!=='undefined'?document.activeElement:null;
 const panel=$('handbook-modal');if(!panel)return;
 const back=typeof officeUI!=='undefined'&&!$('modal').open;
 panel.innerHTML=`<div class="hb-frame"><header class="hb-header"><div class="hb-brand">${hbIcon('book')}<h2 id="handbook-title">${hbText('治国指南','Governing Handbook')}</h2>${hbText('<span>GOVERNING HANDBOOK</span>','')}</div><div class="hb-header-controls"><button type="button" id="handbook-directory-toggle" aria-controls="handbook-sidebar" aria-expanded="false" data-hb-directory>${hbIcon('book')}<span>${hbText('目录','Contents')}</span></button><button type="button" class="hb-back" data-hb-back>${hbIcon('desk')}<span>${back?hbText('返回办公桌','Return to Desk'):hbText('返回原页面','Return')}</span></button><button type="button" class="guide-close hb-close" aria-label="${hbText('关闭治国指南','Close Governing Handbook')}" data-hb-close>${hbIcon('close')}</button></div></header><div class="hb-body"><button type="button" class="hb-sidebar-scrim" aria-label="${hbText('收起目录','Hide Contents')}" data-hb-hide-directory></button><aside id="handbook-sidebar" class="hb-sidebar" aria-label="${hbText('指南目录','Handbook Contents')}"><div class="hb-shortcuts">${['basics','legislature','justice','economy','elections'].map(id=>{const c=HANDBOOK_CATEGORIES.find(c=>c[0]===id);return `<button type="button" title="${esc(hbCategoryTitle(id))}" aria-label="${esc(hbCategoryTitle(id))}" data-hb-shortcut="${id}">${hbIcon(c[3])}</button>`}).join('')}</div><div class="hb-directory-label">${hbText('目录','Contents')}</div><div id="handbook-tree" class="hb-tree">${hbSidebarHTML()}</div><section class="hb-recent"><h3>${hbText('最近查阅','Recently Viewed')}</h3><div id="handbook-recent">${hbRecentHTML()}</div></section></aside><section class="hb-reader"><form class="hb-search" role="search" id="handbook-search-form"><label class="hb-search-input">${hbIcon('search')}<span class="hb-sr-only">${hbText('搜索概念、别称或局势','Search concepts, aliases or situations')}</span><input id="guide-query" class="guide-query" type="search" aria-label="${hbText('搜索概念、别称或局势','Search concepts, aliases or situations')}" placeholder="${hbText('搜索概念、别称或局势…','Search concepts, aliases or situations…')}" autocomplete="off" spellcheck="false" aria-controls="guide-results"><button type="button" id="handbook-search-clear" data-hb-clear aria-label="${hbText('清空搜索','Clear Search')}" hidden>×</button></label><button type="submit">${hbText('搜索','Search')}</button></form><div id="handbook-search-status" class="hb-sr-only" role="status" aria-live="polite"></div><div id="guide-results" class="hb-reading-area"></div><footer class="hb-footer"><span>${hbText('点击目录查阅 · 输入别称也可搜索','Browse the contents · Search by a term or synonym')}</span><span class="hb-key-hint">Esc <span>${hbText('关闭','Close')}</span></span></footer></section></div></div>`;
 hbSelectEntry(handbookState.selected,{remember:false});if(!panel.open)panel.showModal();
 setTimeout(()=>{if(panel.open&&typeof window!=='undefined'&&window.innerWidth>760)$('guide-query')?.focus?.({preventScroll:true})},0);
}
showHelp=hbOpen;
searchGuide104=hbSearch;
if(typeof window!=='undefined'&&document.getElementById('handbook-modal')){
 const panel=$('handbook-modal');
 panel.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.hbEntry){hbSelectEntry(button.dataset.hbEntry,{focus:true});return}
  if(button.hasAttribute('data-hb-close')){hbClose();return}
  if(button.hasAttribute('data-hb-back')){hbClose(true);return}
  if(button.hasAttribute('data-hb-clear')){hbSearch('');$('guide-query').focus();return}
  if(button.hasAttribute('data-hb-directory')){hbSetDirectory(!panel.classList.contains('hb-directory-open'));return}
  if(button.hasAttribute('data-hb-hide-directory')){hbSetDirectory(false);return}
  if(button.dataset.hbShortcut){const preferred={basics:'stability',economy:'budget',legislature:'assembly',justice:'judiciary',elections:'elections'};hbSelectEntry(preferred[button.dataset.hbShortcut],{focus:true})}
 });
 panel.addEventListener('input',event=>{if(event.target.id==='guide-query')hbSearch(event.target.value)});
 panel.addEventListener('submit',event=>{if(event.target.id==='handbook-search-form'){event.preventDefault();hbSearch($('guide-query').value)}});
 panel.addEventListener('cancel',event=>{event.preventDefault();hbClose()});
 document.addEventListener('keydown',event=>{
  if(!panel.open)return;
  // A handbook key must never advance an underlying tutorial or open a desk object.
  event.stopImmediatePropagation();
  if(event.key==='Escape'){event.preventDefault();if(panel.classList.contains('hb-directory-open'))hbSetDirectory(false);else hbClose()}
 },true);
}
