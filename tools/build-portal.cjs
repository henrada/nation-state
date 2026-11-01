/* Rebuild the public handbook from the same guide used by all twelve playable regimes. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),out=path.join(root,'wiki'),nodes={},ctx={console,setTimeout:()=>{},localStorage:{getItem:()=>null,setItem(){}},document:{getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',style:{},close(){this.open=false},showModal(){this.open=true},addEventListener(){}})}};
vm.createContext(ctx);for(const [,src] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^?]+)\?/g))vm.runInContext(fs.readFileSync(path.join(root,src),'utf8'),ctx,{filename:src});
const get=code=>JSON.parse(vm.runInContext('JSON.stringify('+code+')',ctx));
const regimes=get('REGIMES.map(r=>({id:r.id,name:r.name,player:r.player,motto:REGIME_ART[r.id].motto,focus:REGIME_ART[r.id].focus,body:CHAMBERS108[r.id]?.[0]||r.body,upper:CHAMBERS108[r.id]?.[1]||null,court:r.court,executive:EXECUTIVE_NAMES[r.id]}))');
const groups={start:'初次执政',state:'政体与国家',law:'立法与司法',cabinet:'内阁与人事',money:'财政与改革',vote:'地方与选举',crisis:'局势与危机',archive:'档案与评估'};
function group(e){const {id,category:c}=e;if(id==='military-transition')return 'crisis';if(id==='military-reforms')return 'money';if(id==='military-council'||id==='military-factions')return 'law';if(c==='军政府与转型')return 'state';if(id==='quickstart'||/^(office-(desk|files|phone|map|calendar)|ap($|-)|research|calendar|country|new-world|seed|difficulty|guide|tutorial|page-tutorial|advance|alerts|console|overview)$/.test(id)||id.startsWith('ap-'))return 'start';
 if(['appoint','dismiss','replace','office-archives'].includes(id))return id==='office-archives'?'archive':'cabinet';
 if(['court-actions','faction-details','meet','withdraw'].includes(id))return 'law';if(id==='reforms')return 'money';if(id==='situations')return 'crisis';if(id==='capital-city')return 'vote';
 if(/^(regime-|role-|chamber-configuration|famil|central-authority|national-future|political-ally|party-route)/.test(id)||c==='家族政治')return 'state';
 if(/^(electoral-|legislative-election|policy-fit|campaign-performance|upper-renewal|clergy-election|election-|elections$|sector-|regional-|local-demands)/.test(id)||['地区与选举','选举与换届'].includes(c))return 'vote';
 if(['宪法与司法','两院立法','立法与政治'].includes(c)||['assembly','negotiate','vote','coalition','judiciary','judicial','whip','clergy-loyalty'].includes(id))return 'law';
 if(['部长提案','内阁与科研','内阁任务','人物倾向','政体与职务','联邦委员会制'].includes(c)||/^(programme-|office-|task-|cabinet|minister-|federal-)/.test(id))return 'cabinet';
 if(['经济与财政','结构性改革'].includes(c)||/^(tax-|reform-|budget|policy-|rate$|centralbank|bank-advice)/.test(id))return 'money';
 if(c.includes('局势')||['government','strike','scandal','spring','rebellion','olympics','disaster'].includes(id))return 'crisis';
 if(['历史与评估','统治倾向'].includes(c)||['approval','stability','judicial','pressure','score','charts','save','import','export','archive','settlement'].includes(id))return 'archive';
 return c==='政治机制'?'law':'start';}
const entries=new Map();
function ingest(e,r){if(!e||!e.id||!e.title||!e.text)return;if(e.id==='ap')e={...e,text:'每季度可用的政治行动额度由创建世界时选择的固定、随机或伪随机模式决定。协商、表决、任免等通常消耗行动点；查阅资料与季度事件回复不消耗行动点。未用完的点数不结转至下季度。'};
 if(e.id==='coalition')e={...e,text:'君主立宪、西敏与半总统制开局组成执政联盟。民主及象征性民主政体可与团体关系达到70的党团代表会面，消耗1行动点邀请组阁。联盟成员可入阁。第24季度换届时，执政党与盟友分别计票；失去多数或盟友失信可能触发政府危机。'};
 if(e.id==='spring')e={...e,aliases:['民主化运动','之春','XX之春','民主化运动局势']};
 let item=entries.get(e.id);if(!item){item={id:e.id,group:group(e),topic:e.category,title:e.title,aliases:[],variants:[]};entries.set(e.id,item)}
 const aliases=(e.aliases||[]).filter(a=>typeof a==='string');item.aliases=[...new Set([...item.aliases,...aliases,e.title])].filter(a=>a!==item.title);
 let body=e.text;if(r==='federal'&&e.category==='部长提案')body=body.replace('未完成每季度主管忠诚−0.5','委员未完成提案不扣忠诚');
 if(e.id.startsWith('situation-action-national-future-'))body=body.replace('执行需1行动点。','不消耗行动点。');
 let v=item.variants.find(v=>v.text===body&&v.title===e.title);if(!v)item.variants.push(v={title:e.title,text:body,regimes:[]});if(!v.regimes.includes(r))v.regimes.push(r);}
for(const r of regimes){ctx.worldRegime=r.id;vm.runInContext("selectedRegime=worldRegime;create('encyclopedia-'+worldRegime)",ctx);const list=get('officeGuideEntries104(guideCatalog104())');for(const e of list)ingest(e,r.id)}
const starters=[['quickstart','第一季度怎么过',['快速入门','新手指南','第一回合'],'从档案查看执政总览：先找出最接近危机门槛的指标，再决定本季行动。\n\n打开电话，查看内阁空缺和立法机构里的党派关系。需要调预算或提交改革时，回到文件拟案；预算草案须完成相应审议才生效。\n\n打开地图检查地方诉求与选票预测。准备好后选择“进入下一季度”，回复当季事件，再查阅新一季报告。每年6季度，标准任期总长48季度。'],['office-archives','档案',['档案入口'],'从办公桌的档案进入执政总览、国家档案或央行报告。点击指标可查看历季折线；国家档案还保留宪法条目、机构记录和存档导出入口。']];
for(const [id,title,aliases,body]of starters)for(const r of regimes)ingest({id,title,aliases,text:body,category:'页面与操作'},r.id);
const articles=[...entries.values()].sort((a,b)=>a.id.localeCompare(b.id,'en'));for(const e of articles){for(const v of e.variants)if(v.regimes.length===12)v.regimes=[];}
const dataDir=path.join(out,'data');fs.mkdirSync(dataDir,{recursive:true});
const index=[],shards={};let part=0,batch={},bytes=0;
function flush(){if(!bytes)return;const key='terms-'+part++;shards[key]=JSON.stringify(batch)+'\n';for(const e of index)if(!e.file)e.file=key;batch={};bytes=0;}
for(const e of articles){const size=Buffer.byteLength(JSON.stringify(e.variants));if(bytes+size>85000)flush();batch[e.id]=e.variants;bytes+=size;index.push({id:e.id,group:e.group,topic:e.topic,title:e.title,aliases:e.aliases});}
flush();for(const [key,content]of Object.entries(shards))fs.writeFileSync(path.join(dataDir,key+'.json'),content);
for(const file of fs.readdirSync(dataDir))if(/^terms-\d+\.json$/.test(file)&&!Object.hasOwn(shards,file.slice(0,-5)))fs.unlinkSync(path.join(dataDir,file));
fs.writeFileSync(path.join(dataDir,'index.json'),JSON.stringify({schema:1,revision:require('node:crypto').createHash('sha256').update(JSON.stringify(articles)).digest('hex').slice(0,12),groups,regimes,articles:index})+'\n');
console.log(`${articles.length} entries; ${regimes.length} regimes; ${Object.keys(shards).length} detail files`);
