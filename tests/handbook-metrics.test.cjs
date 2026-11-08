const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function boot(language){
 const nodes={},storage={'nation-state-language':language};
 const c={console,setTimeout:()=>{},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},document:{getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',style:{},showModal(){this.open=true},close(){this.open=false},addEventListener(){}})}};
 vm.createContext(c);
 for(const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^?]+)\?/g))vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c,{filename:file});
 return {c,nodes,storage,run:code=>vm.runInContext(code,c)};
}
let total=0;
for(const language of ['zh','en']){
 const {c,nodes,run}=boot(language);
 for(const regime of ['presidential','federal','party','theorepublic','aristocracy','tyranny']){
  c.targetRegime=regime;run("selectedRegime=targetRegime;create('metric-guide-'+targetRegime);hbPrepareEntries()");
  const before=run('JSON.stringify(s)');
  const missing=run("Object.keys(GUIDE_METRICS).filter(id=>(id!=='upper-support'||hasUpper108())&&!handbookState.byId.has(id))");
  assert.equal(missing.length,0,'missing metric entries: '+missing.join(','));
  for(const id of run('handbookState.entries.filter(e=>e.metricGuide).map(e=>e.id)')){
   c.entryId=id;
   assert.equal(run("['increase','decrease','notes'].every(k=>metricGuideDefinition(entryId)[k].length===2&&metricGuideDefinition(entryId)[k].every(t=>t.length>20))"),true,id+' complete bilingual guidance');
   run('hbSelectEntry(entryId)');
   for(const label of language==='zh'?['如何提高','如何降低','计算与关联']:['How to Increase','How to Decrease','Calculation &amp; Connections'])assert.ok(nodes['guide-results'].innerHTML.includes(label),id+' '+label);
   const riskEntries=['approval','forecast','inflation','unemployment','debt','confidence','judicial','local-demands','faction-relation','loyalty','clergy-loyalty','family-recognition','central-authority','military-backing'];
   assert.equal(nodes['guide-results'].innerHTML.includes(language==='zh'?'数值与门槛':'Values &amp; Thresholds'),riskEntries.includes(id),id+' only real risk or situation thresholds get a section');
   const retainedEffects=run('metricGuideLanguage(metricGuideDefinition(entryId).effects)');
   if(retainedEffects){c.retainedEffects=retainedEffects;assert.ok(nodes['guide-results'].innerHTML.includes(run('hbParagraphs(retainedEffects)')),id+' ordinary effects retained under calculation');}
   assert.doesNotMatch(nodes['guide-results'].innerHTML,/没有独立危机或失败门槛|没有单独由增长压力触发|no independent crisis or defeat threshold/);
   assert.doesNotMatch(nodes['guide-results'].innerHTML,/<details[^>]*\sopen(?:[\s=>])/);
   total++;
  }
  const queries=language==='zh'?{'增长压力':'growth-pressure','潜在增长':'potential','加权支持率':'forecast','当前加权选票预测':'forecast','加权支持度':'forecast'}:{'Growth Pressure':'growth-pressure','Potential Growth':'potential','Weighted Support':'forecast','Weighted Vote Forecast':'forecast'};
  for(const [query,id]of Object.entries(queries)){c.query=query;run('searchGuide104(query)');assert.equal(run('handbookState.selected'),id,query);assert.match(nodes['guide-results'].innerHTML,new RegExp('data-hb-article="'+id+'"'));}
  for(const id of ['growth-pressure','potential']){c.entryId=id;assert.equal(run('hbCategory(handbookState.byId.get(entryId))'),'economy');}
  assert.equal(run("handbookState.byId.get('forecast').title"),language==='zh'?'加权支持率':'Weighted Support');
  assert.equal(run("EXTRA_SERIES107.find(x=>x[0]==='forecast')[1]"),'加权支持率');
  assert.equal(run("metricGuideDefinition('approval').thresholds[0].includes('联邦委员会制另要求')"),regime==='federal');
  assert.equal(run('JSON.stringify(s)'),before,'reading does not change simulation');
 }
}
console.log('PASS '+total+' metric articles: bilingual measures/thresholds, collapsed details, terminology/legacy searches, regime-specific guidance, and unchanged simulation');
