const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function boot(language){
 const nodes={},storage={'nation-state-language':language};
 const c={console,setTimeout:()=>{},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},document:{getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',style:{},showModal(){this.open=true},close(){this.open=false},addEventListener(){}})}};
 vm.createContext(c);
 for(const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^?]+)\?/g))vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c,{filename:file});
 return {c,nodes,storage,run:code=>vm.runInContext(code,c)};
}
let checked=0;
for(const language of ['zh','en']){
 const {c,nodes,storage,run}=boot(language);
 for(const regime of run('REGIMES.map(r=>r.id)')){
  c.targetRegime=regime;run("selectedRegime=targetRegime;create('handbook-'+targetRegime)");
  const before=run('JSON.stringify(s)'),draftBefore=run('JSON.stringify(draft)');
  const saveBefore={...storage};
  // Opening a reference must preserve any budget/decision dialog beneath it.
  run("$('modal').innerHTML='<p>Pending decision</p>';$('modal').showModal();showHelp()");
  assert.equal(nodes['handbook-modal'].open,true);
  assert.equal(run("hbCategoryTitle('legislature')"),run("institutionSectionName()==='监察机构'")?(language==='zh'?'监察机构':'Oversight Institutions'):(language==='zh'?'立法机构':'Legislative Institutions'));
  assert.equal(nodes.modal.open,true);assert.equal(nodes.modal.innerHTML,'<p>Pending decision</p>');
  assert.equal(run('handbookState.entries.length===new Set(handbookState.entries.map(e=>e.id)).size'),true,'unique entries');
  assert.equal(run('guideCatalog104().every(e=>handbookState.byId.has(e.id)&&e.aliases.every(a=>handbookState.byId.get(e.id).aliases.includes(a)))'),true,'complete catalogue and aliases');
  assert.equal(run('handbookState.entries.every(e=>HANDBOOK_CATEGORIES.some(c=>c[0]===hbCategory(e)))'),true,'every entry categorized');
  assert.equal(run('{const tree=hbSidebarHTML();handbookState.entries.every(e=>tree.includes(`data-hb-entry="${esc(e.id)}"`))}'),true,'every entry reachable from contents');
  const failures=run(`handbookState.entries.filter(e=>{const html=hbArticleHTML(e);return /<details[^>]*\\sopen(?:[\\s=>])/.test(html)||!html.includes(hbParagraphs(e.text))}).map(e=>e.id)`);
  assert.equal(failures.length,0,'original reference retained and all article details closed: '+failures.join(','));
  for(const query of language==='zh'?['稳定','稳定度','政治稳定']:['stability','political stability']){
   c.query=query;run('searchGuide104(query)');assert.equal(run('handbookState.selected'),'stability');assert.match(nodes['guide-results'].innerHTML,/data-hb-article="stability"/);
  }
  c.query=language==='zh'?'失业':'unemployment';run('searchGuide104(query)');assert.equal(run('handbookState.selected'),'unemployment');
  c.query=language==='zh'?'政策利率、':'policy interest rate';run('searchGuide104(query)');assert.equal(run('handbookState.selected'),'rate');
  run("searchGuide104('<img src=x onerror=alert(1)>not-a-concept')");
  assert.match(nodes['guide-results'].innerHTML,language==='zh'?/该概念不存在于此游戏/:/This concept does not exist in this game/);
  assert.doesNotMatch(nodes['guide-results'].innerHTML,/<img/,'unknown query cannot inject markup');
  run("searchGuide104('');hbSelectEntry('ap');hbClose()");
  assert.equal(nodes['handbook-modal'].open,false);assert.equal(nodes.modal.open,true);assert.equal(nodes.modal.innerHTML,'<p>Pending decision</p>');
  assert.equal(run('JSON.stringify(s)'),before,language+' '+regime+' game state unchanged');
  assert.equal(run('JSON.stringify(draft)'),draftBefore,'budget draft unchanged');
  for(const [key,value] of Object.entries(saveBefore))assert.equal(storage[key],value,'only reference history may be stored');
  assert.deepEqual(Object.keys(storage).filter(k=>!(k in saveBefore)),['nation-state-handbook-recent'].filter(k=>!(k in saveBefore)));
  assert.ok(JSON.parse(storage['nation-state-handbook-recent']).length<=6);
  checked++;
 }
 // English searches remain valid after a Chinese-created world is translated.
 run("setGameLanguage('zh');hbPrepareEntries();setGameLanguage('en');hbPrepareEntries();searchGuide104('stability')");
 assert.equal(run('handbookState.selected'),'stability');
 assert.match(nodes['guide-results'].innerHTML,/Values &amp; Risks/);
}
console.log('PASS '+checked+' regime/language combinations: complete catalogue, categorized navigation, aliases, collapsed details, safe empty search, modal preservation and no game/save changes');
