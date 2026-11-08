const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),nodes={},storage={};
const c={console,setTimeout:()=>{},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},document:{getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',style:{},showModal(){this.open=true},close(){this.open=false},addEventListener(){}})}};
vm.createContext(c);
for(const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^?]+)\?/g))vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c,{filename:file});
const run=code=>vm.runInContext(code,c);
run(`function financingFixture(id){
 selectedRegime=id;pendingAdmin107=false;create('financing-removal-'+id);
 s.situations.active=[];s.situations.notices=[];
 if(s.constitution?.minority)Object.assign(s.constitution.minority,{status:'resolved',resolution:'amendment',resolvedQ:s.q});
 s.inflation=3;s.unemployment=6;s.debt=s.gdp*2.5;s.confidence=10;
 s.approval=80;s.stability=95;pstate().judicial=75;pstate().current=null;pstate().queue=[];
 s.pending=null;s.officePreferences={skipUnusedActionWarning:true};
}`);
for(const regime of run('REGIMES.map(r=>r.id)')){
 c.targetRegime=regime;run('financingFixture(targetRegime);advance()');
 assert.equal(run('s.q'),1,regime+' advances normally');
 assert.equal(run('s.adminMode'),false,'ordinary mode');
 assert.equal(run('s.debt/s.gdp>1.9&&s.confidence<25'),true,regime+' still satisfies removed condition');
 assert.ok(!run('s.ended'),regime+' no financing defeat');
 assert.ok(run('pstate().current'),regime+' quarterly events remain available');
 assert.ok(run('s.situations.active.some(x=>x.kind==="economy")'),regime+' economic crisis still applies');
}
run("financingFixture('presidential');originalAdvance()");
assert.equal(run('s.q'),1,'original quarter path advances');
assert.ok(!run('s.ended'),'original quarter path has no financing defeat');
run("financingFixture('presidential');s.stability=19;advance()");
assert.ok(run('s.ended'),'political-stability defeat is retained');
run("financingFixture('presidential');s.approval=0;publicSupportQuarter107()");
assert.ok(run('s.ended'),'zero democratic approval defeat is retained');
console.log('PASS financing defeat removed in all 12 regimes and original quarter path; crises and political defeat rules retained.');
