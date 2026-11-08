const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function boot(storage={}){
 const nodes={},writes=[];
 const ctx={console:{log(){},error(){}},setTimeout(){},localStorage:{
  getItem:k=>storage[k]??null,
  setItem(k,v){if(ctx.failStorage&&k==='nation-state-v1')throw Error('Storage unavailable');storage[k]=v;writes.push(k)},
 },document:{getElementById:id=>nodes[id]??={innerHTML:'',textContent:'',style:{},showModal(){this.open=true},close(){this.open=false},addEventListener(){}}}};
 vm.createContext(ctx);
 for(const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^?]+)\?/g))vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
 const run=code=>vm.runInContext(code,ctx);
 run(`function freshSaveTest(id='presidential',seed='original'){
  selectedRegime=id;pendingAdmin107=true;create(seed);pstate().current=null;pstate().queue=[];save();
 }`);
 async function importText(text){ctx.fileInput={files:[{size:Buffer.byteLength(text),text:async()=>text}]};await run('importSave(fileInput)')}
 return {ctx,run,storage,nodes,writes,importText};
}
(async()=>{
 let b=boot();b.run('freshSaveTest();draft.income+=1');
 const original=b.run('JSON.stringify(s)'),originalDraft=b.run('JSON.stringify(draft)'),raw=b.storage['nation-state-v1'];
 const envelope=()=>({version:1,state:JSON.parse(original)});
 for(const mutate of [
  x=>{x.state.history=[null]},x=>{x.state.history=[{}]},x=>{x.state.history[0].gdp=null},
  x=>{x.state.history[0].inflation='bad'},x=>{x.state.logs=[null]},x=>{x.state.effects=[null]},
  x=>{x.state.reforms=[null]},x=>{x.state.political.members=[null]},x=>{x.version=999},
 ]){
  const data=envelope();mutate(data);await b.importText(JSON.stringify(data));
  assert.equal(b.run('JSON.stringify(s)'),original,'invalid import preserves live state');
  assert.equal(b.run('JSON.stringify(draft)'),originalDraft,'invalid import preserves unsent budget');
  assert.equal(b.storage['nation-state-v1'],raw,'invalid import preserves autosave');
  assert.equal(b.nodes.toast.textContent,'存档导入失败，当前进度保持不变');
 }
 await b.importText('{broken JSON');assert.equal(b.storage['nation-state-v1'],raw);
 // Fail after the normal save hooks run, including a save attempted from rendering.
 for(const phase of ['migration','save','render','storage']){
  b=boot();b.run('freshSaveTest();draft.income+=1;tab="archive"');
  const before=b.run('JSON.stringify(s)'),draft=b.run('JSON.stringify(draft)'),stored=b.storage['nation-state-v1'];
  const imported=JSON.parse(before);imported.seed='replacement-'+phase;
  b.ctx.phase=phase;
  b.run(`const savedInit=initPolitics,savedSave=save,savedRender=render;
   if(phase==='migration')initPolitics=function(...a){savedInit(...a);if(s.seed.startsWith('replacement-')){save();throw Error('Migration failure')}};
   if(phase==='save')save=function(){savedSave();if(s.seed.startsWith('replacement-'))throw Error('Save hook failure')};
   if(phase==='render')render=function(){savedRender();if(s.seed.startsWith('replacement-')){save();throw Error('Render failure')}};
  `);
  b.ctx.failStorage=phase==='storage';const writeCount=b.writes.filter(k=>k==='nation-state-v1').length;
  await b.importText(JSON.stringify({version:1,state:imported}));
  assert.equal(b.run('JSON.stringify(s)'),before,phase+' rollback');
  assert.equal(b.run('JSON.stringify(draft)'),draft,phase+' draft rollback');
  assert.equal(b.run('tab'),'archive',phase+' page rollback');
  assert.equal(b.storage['nation-state-v1'],stored,phase+' original autosave');
  assert.equal(b.writes.filter(k=>k==='nation-state-v1').length,writeCount,phase+' never commits failed state');
  assert.equal(b.run('deferSaveWrite'),false,'save suspension released');
  b.ctx.failStorage=false;b.run('initPolitics=savedInit;save=savedSave;render=savedRender;s.approval-=1;save()');
  assert.notEqual(b.storage['nation-state-v1'],stored,'ordinary saving works after rollback');
 }
 // Older histories may omit indicators introduced later; preserve those gaps.
 b=boot();b.run('freshSaveTest()');const legacy=JSON.parse(b.run('JSON.stringify(s)'));
 legacy.q=1;legacy.history=legacy.history.map(({q,gdp,growth,debt,approval})=>({q,gdp,growth,debt,approval}));
 await b.importText(JSON.stringify({version:1,state:legacy}));
 assert.equal(b.run('s.q'),1,'legacy history is accepted');
 assert.equal(b.run('s.history[0].inflation'),undefined,'missing historical values stay unrecorded');
 assert(b.run('validSave(s)'),'migrated legacy history remains valid');
 // User seed text is data, including angle brackets; other untrusted HTML remains rejected.
 for(const language of ['zh','en']){
  b=boot({'nation-state-language':language});
  for(const id of b.run('REGIMES.map(r=>r.id)'))for(const seed of ['A>B','A<B & "test"','<img src=x onerror=alert(1)>']){
   b.ctx.testRegime=id;b.ctx.testSeed=seed;b.run('freshSaveTest(testRegime,testSeed)');
   assert(b.run('validSave(s)'),id+' special seed valid');
   assert(!b.run('archive().includes("<img src=x")'),'seed cannot create markup');
   const snapshot=b.run('JSON.stringify(s)'),restored=boot({...b.storage});restored.run('bootGame()');
   assert.equal(restored.run('JSON.stringify(s)'),snapshot,id+' exact save restoration');
   b.run('freshSaveTest("presidential","to-replace")');
   const commits=b.writes.filter(k=>k==='nation-state-v1').length;
   await b.importText(JSON.stringify({version:1,state:JSON.parse(snapshot)}));
   assert.equal(b.run('JSON.stringify(s)'),snapshot,id+' successful import');
   assert.equal(b.writes.filter(k=>k==='nation-state-v1').length,commits+1,'successful import commits once');
   const hostile=JSON.parse(snapshot);hostile.name='<img src=x onerror=alert(1)>';b.ctx.hostile=hostile;
   assert(!b.run('validSave(hostile)'),'seed exception is limited to seed');
  }
 }
 console.log('PASS save integrity: malformed records, migration/save/render/storage rollback, draft preservation, resumed saving, 72 bilingual regime/seed reloads and imports, escaped seed rendering and single commit.');
})().catch(e=>{console.error(e);process.exitCode=1});
