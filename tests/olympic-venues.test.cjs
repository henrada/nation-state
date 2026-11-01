// Exercise notices created by the simulation, not handcrafted multi-option fixtures.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function boot(dir=root,storage={}){const nodes={},ctx={console,setTimeout(){},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},document:{getElementById:id=>nodes[id]??={innerHTML:'',style:{},close(){this.open=false},showModal(){this.open=true},addEventListener(){}}}};vm.createContext(ctx);for(const [,file] of fs.readFileSync(path.join(dir,'index.html'),'utf8').matchAll(/<script src="([^?]+)\?/g))vm.runInContext(fs.readFileSync(path.join(dir,file),'utf8'),ctx,{filename:file});return ctx}
const fixture=`
function check(v,msg){if(!v)throw Error(msg)}function near(a,b,msg){check(Math.abs(a-b)<1e-7,msg+': '+a+' vs '+b)}
function fresh(){selectedRegime='presidential';pendingAdmin107=true;create('venue-options');sits().active=[];Object.assign(constitution().minority,{status:'resolved',resolution:'amendment',resolvedQ:s.q});sits().notices=[];pstate().current=null;pstate().queue=[];v3().quarterOpen=false;s.q=12;s.approval=65;s.stability=80;s.confidence=60;s.debt=s.gdp*.4;v3().sports=10;pstate().ap=0}
function invite(){let original=rand;try{rand=()=>.2;randomSituations()}finally{rand=original}flushNotices();check(pstate().current?.situationAction==='olympic-bid','real bid notice')}
function finishHosting(success=true,overrun=0){const x=activeSit('olympics');check(!!x,'host appointed');x.progress=success?100:0;x.quality=60;x.overrun=overrun;while(s.q<x.deadline){s.q++;situationQuarter()}flushNotices();check(pstate().current?.title==='局势结束：奥运筹办','separate hosting outcome');resolvePolitical(0);check(pstate().current?.situationAction==='venues','real venues notice')}
`;
const storage={},ctx=boot(root,storage);vm.runInContext(fixture+`{
 fresh();notice('普通报告','无须选择');flushNotices();check(pstate().current.options.length===1&&pstate().current.options[0].label==='确认并继续','ordinary notice unchanged');resolvePolitical(0);
 invite();check(pstate().current.options.length===2,'accept and decline offered');let debt=s.debt;resolvePolitical(1);near(s.debt,debt,'decline has no cost');check(!sits().olympicsApplied&&!activeSit('olympics'),'decline preserves chance');s.q+=12;invite();resolvePolitical(0);near(s.debt,debt+s.gdp*.003,'bid costs 0.3 percent GDP exactly once');check(sits().olympicsApplied,'chance used');
 for(const [hosted,choice,overrun,lowDebt]of [[true,0,0,false],[false,1,0,false],[true,1,50,true]]){
  fresh();invite();resolvePolitical(0);finishHosting(hosted,overrun);
  const e=pstate().current;check(e.options.length===2&&e.constitutionalSpecial,'two special-event options');check(e.text.includes(hosted?'已闭幕':'未达标'),'outcome-specific description');
  const [community,sale]=e.options;check(community.label==='转为社区体育设施'&&community.detail.includes('0.3%')&&community.detail.includes('+1'),'community effect visible');check(sale.label==='出售运营权'&&sale.detail.includes('0.2%')&&sale.detail.includes('+1'),'sale effect visible');
  if(lowDebt)s.debt=s.gdp*.001;const before={debt:s.debt,approval:s.approval,confidence:s.confidence,gdp:s.gdp,ap:pstate().ap,regular:v3().eventsChosen};
  resolvePolitical(choice);near(s.debt,choice?Math.max(0,before.debt-before.gdp*.002):before.debt+before.gdp*.003,'venue fiscal effect');near(s.approval,before.approval+(choice?0:1),'venue approval');near(s.confidence,before.confidence+(choice?1:0),'venue confidence');near(pstate().ap,before.ap,'no AP');near(v3().eventsChosen,before.regular,'special decision outside regular quota');check(!pstate().current&&!activeSit('olympics'),'event consumed');
  const end=s.debt;situationQuarter();flushNotices();near(s.debt,end,'no repeat venue effects');check(!pstate().current,'no duplicate event');check(validSave(s),'valid settled save');
 }
 fresh();invite();resolvePolitical(0);pstate().ap=3;situationAct(activeSit('olympics').id,'cancel');check(!activeSit('olympics')&&sits().olympicsApplied,'cancellation consumes bid');check(![pstate().current,...pstate().queue,...sits().notices].some(e=>e?.situationAction==='venues'),'no venue decision after voluntary cancellation');
 const guide=guideMatches104('出售运营权',guideCatalog104());check(guide[0]?.id==='olympics'&&guide[0].text.includes('0.2%'),'guide points to actual option');check(olympicBenefits104().includes(olympicVenueOptions()[0].detail),'pre-event forecast matches option');
 console.log('PASS real bid/settlement notices; accept/decline, success/failure/overrun/cancel, both fiscal and political effects, debt floor, no AP, no duplicate or regular-event slot.');
}`,ctx);
// Use an actual save from the previous runtime when available; check all pending locations.
const baseline=process.env.OLYMPIC_BASELINE_DIR;
if(baseline){for(const action of ['venues','olympic-bid'])for(const location of ['current','queue','notices']){
 const st={},old=boot(baseline,st);vm.runInContext(fixture+`fresh();${action==='venues'?"startSituation('olympics');finishHosting()":"invite()"};let placeholder=pstate().current;check(placeholder.options.length===1,'legacy bug present');pstate().current=null;pstate().queue=[];sits().notices=[];${location==='current'?'pstate().current=placeholder':location==='queue'?'pstate().queue.push(placeholder)':'sits().notices.push(placeholder)'};record();save()`,old);
 const saveBefore=JSON.parse(st['nation-state-v1']),c=boot(root,st),saveAfter=JSON.parse(st['nation-state-v1']);assert.equal(saveBefore.q,saveAfter.q);assert.equal(saveBefore.debt,saveAfter.debt);assert.equal(saveBefore.approval,saveAfter.approval);
 const event=vm.runInContext(location==='current'?'pstate().current':location==='queue'?'pstate().queue[0]':'sits().notices[0]',c);assert.equal(event.options.length,2);assert.equal(event.situationAction,action);assert(event.constitutionalSpecial);assert(vm.runInContext('validSave(s)',c));
 const raw=st['nation-state-v1'];boot(root,st);assert.equal(st['nation-state-v1'],raw,'reload does not enqueue or apply again');
 }console.log('PASS six legacy save cases: current, queued and unflushed venue/bid notices repaired without replay or costs.');}
