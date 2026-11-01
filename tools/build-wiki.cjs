// Export native Wiki Markdown from the same catalog as the illustrated edition.
// The maintained landing page, sidebar and footer are intentionally preserved.
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
require('./build-portal.cjs');
const source=path.join(root,'wiki-source'),out=process.argv[2]?path.resolve(process.argv[2]):source,dir=path.join(root,'wiki/data');fs.mkdirSync(out,{recursive:true});
const data=JSON.parse(fs.readFileSync(path.join(dir,'index.json'))),base='https://henrada.github.io/nation-state/wiki/',shards={},pages=new Map();
const groupPages={start:'快速入门',state:'创建世界与政体',law:'议事机关与联合政府',cabinet:'内阁与人事',money:'财政与预算',vote:'民意与选举',crisis:'局势与危机',archive:'国家档案与评估'};
function topic(e){if(e.topic==='部长提案')return '部长提案图鉴';if(e.topic==='内阁任务')return '内阁任务图鉴';if(e.topic==='宪法与司法')return '司法与政治稳定';if(e.topic==='结构性改革'||['reform-window','reforms'].includes(e.id))return '结构性改革';if(e.id.startsWith('ap-')||['ap','research'].includes(e.id))return '行动点与科研';if(['approval','stability','gdp','growth','inflation','unemployment','debt','judicial','confidence','rate'].includes(e.id))return '核心指标';if(e.topic==='存档与设置'||e.topic==='页面与操作'&&e.group==='start')return '界面教程与存档';if(e.group==='archive')return '任期评估与统治倾向';return groupPages[e.group]}
const article=e=>base+'#entry/'+encodeURIComponent(e.id);
for(const e of data.articles){const key=topic(e),shard=shards[e.file]??=JSON.parse(fs.readFileSync(path.join(dir,e.file+'.json'))),v=shard[e.id];let lines=pages.get(key)||[];lines.push(`<a name="concept-${e.id}"></a>\n\n## ${e.title}\n\n${v.length===1?v[0].text:`本条目有依政体而异的说明，请在图文版选择政体查阅。`}\n\n[阅读词条](${article(e)})${e.aliases.length?' · 搜索词：'+e.aliases.join('、'):''}`);pages.set(key,lines)}
for(const [name,lines]of pages)fs.writeFileSync(path.join(out,name+'.md'),`# ${name}\n\n[百科首页](${base}) · [搜索词条](${base}#search)\n\n`+lines.join('\n\n')+'\n');
fs.writeFileSync(path.join(out,'搜索与术语索引.md'),`# 搜索与术语索引\n\n[搜索全部 ${data.articles.length} 个词条](${base}#search)\n\n`+Object.entries(data.groups).map(([k,label])=>`## ${label}\n\n`+data.articles.filter(e=>e.group===k).map(e=>`- [${e.title}](${article(e)})`).join('\n')).join('\n\n')+'\n');
fs.writeFileSync(path.join(out,'更新日志.md'),'# 开发日志\n\n[阅读最新开发日志](https://github.com/henrada/nation-state/blob/main/README.md) · [近期收录]('+base+'#updates)\n');
for(const file of ['Home.md','_Sidebar.md','_Footer.md','常见问题.md'])if(out!==source&&fs.existsSync(path.join(source,file)))fs.copyFileSync(path.join(source,file),path.join(out,file));
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({edition:'测试版',revision:data.revision,entryCount:data.articles.length,pages:fs.readdirSync(out).filter(f=>f.endsWith('.md')).sort()},null,2)+'\n');
console.log(`Exported Wiki Markdown to ${out}. Publishing GitHub Wiki pages is a separate step.`);
