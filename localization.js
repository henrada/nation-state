/* Display-only localization. Simulation identifiers and rules stay in the source language. */
const LANGUAGE_KEY='nation-state-language';
let gameLanguage='zh';
try{if(localStorage.getItem(LANGUAGE_KEY)==='en')gameLanguage='en'}catch(_){}
const EN_FIRST_NAMES=('Adam Adrian Alan Albert Alexander Andrew Anthony Arthur Austin Benjamin Blake Brandon Brian Bruce Caleb Cameron Carl Charles Christian Christopher Colin Daniel David Dean Dennis Dominic Dylan Edward Edwin Elliot Eric Ethan Evan Felix Francis Frank Frederick Gabriel George Graham Grant Gregory Harry Henry Hugh Ian Isaac Jack Jacob James Jason Jeremy Jesse Joel John Jonathan Joseph Joshua Julian Justin Keith Kevin Lawrence Lee Leo Leonard Lewis Liam Logan Louis Lucas Luke Marcus Mark Martin Matthew Maxwell Michael Miles Morgan Nathan Nicholas Noah Oliver Oscar Owen Patrick Paul Peter Philip Raymond Richard Robert Roger Roland Ronald Roy Ryan Samuel Scott Sebastian Simon Spencer Stephen Steven Stuart Theodore Thomas Timothy Tobias Tristan Victor Vincent Walter Wesley William Zachary Abigail Alice Alison Amanda Amelia Amy Andrea Angela Anna Anne Audrey Barbara Beatrice Bethany Bridget Caroline Catherine Cecilia Charlotte Chloe Claire Clara Constance Daisy Danielle Deborah Diana Dorothy Edith Eleanor Elena Elizabeth Ella Ellen Emily Emma Erica Evelyn Faith Fiona Florence Frances Gabrielle Georgia Grace Hannah Harriet Hazel Heather Helen Holly Imogen Irene Isabel Jacqueline Jane Janet Jasmine Jean Jennifer Jessica Joan Joanna Josephine Joy Julia Juliet June Karen Katherine Laura Lauren Leah Lillian Lily Linda Lisa Louise Lucy Lydia Margaret Maria Marie Martha Mary Megan Melissa Mia Miriam Molly Monica Nancy Natalie Natasha Nicole Nora Olivia Paige Patricia Paula Penelope Phoebe Rachel Rebecca Rose Rosemary Ruby Ruth Sally Samantha Sandra Sarah Sophia Sophie Stella Susan Sylvia Teresa Theresa Valerie Vanessa Vera Victoria Violet Virginia Vivian Wendy Zoe').split(' ');
const EN_SURNAMES=('Abbott Adams Allen Anderson Andrews Armstrong Arnold Atkinson Austin Bailey Baker Ball Banks Barker Barnes Barrett Barton Bates Bell Bennett Benson Berry Bishop Black Blake Booth Bowen Boyd Bradley Brady Brooks Brown Bryant Burke Burns Burton Butler Campbell Carter Chandler Chapman Clark Clarke Clayton Cole Coleman Collins Cook Cooper Cox Crawford Cross Cunningham Curtis Davies Davis Dawson Dean Dixon Douglas Doyle Duncan Dunn Edwards Ellis Elliott Evans Fisher Fletcher Ford Foster Fowler Fox Francis Franklin Fraser Freeman Gardner Gibson Gilbert Graham Grant Gray Green Griffin Hall Hamilton Harding Harper Harris Harrison Hart Harvey Hawkins Hayes Henderson Henry Hicks Hill Holmes Howard Hudson Hughes Hunt Hunter Jackson James Jenkins Jennings Johnson Johnston Jones Jordan Kelly Kennedy King Knight Lambert Lane Lawrence Lawson Lee Lewis Lloyd Long Lowe Lucas Lynch Marshall Martin Mason Matthews May McCarthy McDonald McKenzie Miller Mills Mitchell Moore Morgan Morris Murphy Murray Nash Nelson Newman Newton Nichols Norman Oliver Osborne Owen Palmer Parker Parsons Patterson Payne Pearson Perry Peters Phillips Porter Powell Price Quinn Randall Reed Reid Reynolds Richards Richardson Riley Roberts Robertson Robinson Rogers Ross Russell Ryan Sanders Saunders Scott Shaw Shepherd Simpson Smith Spencer Stanley Stephens Stevens Stewart Stone Sullivan Sutton Taylor Thomas Thompson Thomson Todd Townsend Tucker Turner Underwood Walker Wallace Walsh Walters Ward Warren Watson Watts Webb Webster Wells West Wheeler White Williams Williamson Wilson Wood Woods Wright Young').split(' ');
const EN_OTHER_SURNAMES=['Wu','Tang','Park','Sakura','Chen','Wang','Zhang','Liu','Kim','Han','Choi','Sato','Tanaka','Suzuki','Nguyen','Patel','Singh','Shah','Khan','Ahmed','Ali','Hassan','Garcia','Martinez','Silva','Costa','Kowalski','Novak','Dubois','Laurent'];
const EN_COUNTRIES=['Aldoria','Ardenia','Asteria','Avernia','Belloria','Calderia','Caldor','Carmora','Castelia','Cyrentia','Dalmora','Demeria','Eldoria','Elvaria','Estavia','Evernia','Falden','Faronia','Galdor','Galenia','Halden','Helvaria','Illyra','Istraven','Kaldoria','Karsenia','Lantora','Liravia','Lorentia','Maravia','Meridia','Montavia','Neravia','Norland','Novaria','Ordelia','Orvenia','Peloria','Ravena','Rovaria','Selenia','Serevia','Solvaria','Talandia','Tavora','Valdoria','Valmere','Varenia','Veloria','Verdania','Vesperia','Westoria'];
const EN_PLACES=('Alder Ashford Ashmere Aster Bayford Beechhaven Bellhaven Blackford Briarbridge Brightwater Brookfield Calderside Cedarvale Clearhaven Coldwater Copperfield Crestwood Dunford Dunmere Eastbourne Eastbridge Elmbridge Fairhaven Fairmont Fernbrook Foxhill Glenford Glenmere Goldhaven Greenford Greyhaven Hawthorne Highbridge Hillcrest Ironford Kingsbridge Lakehaven Larkspur Lindenford Longford Maplehaven Millbridge Moorfield Newbridge Northbridge Northhaven Oakford Oakridge Pinehaven Portmere Redford Redhaven Ridgefield Riverton Rosebank Roseford Rowanford Sandford Seabrook Silverhaven Southbank Southford Stonebridge Summerford Thornfield Valehaven Westbridge Westhaven Whitehaven Willowbank Windermere Winterford Woodbridge Woodhaven').split(' ');
function localeHash(text){let h=2166136261;for(const c of String(text))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
function englishIdentity(source,seed='',attempt=0){const key=seed+'|'+source+'|'+attempt,first=EN_FIRST_NAMES[localeHash(key+'|given')%EN_FIRST_NAMES.length],pool=localeHash(key+'|culture')%100<12?EN_OTHER_SURNAMES:EN_SURNAMES;return first+' '+pool[localeHash(key+'|family')%pool.length]}
let creatingEnglishWorld=false;
const nameBeforeLocalization=personName;
personName=function(){
 const source=nameBeforeLocalization();
 if(!creatingEnglishWorld&&s?.nameLocale!=='en')return source;
 s.nameLocale='en';
 const used=new Set([...(s.political?.members||[]),...(s.political?.candidates||[]),...(s.constitution?.judges||[]),...(s.judicialStaff?.reserve||[]),...(s.bicameral108?.upper?.members||[])].map(x=>x.baseName||x.name));
 for(let i=0;i<EN_FIRST_NAMES.length*EN_SURNAMES.length;i++){const name=englishIdentity(source,s.seed,i);if(!used.has(name))return name}
 throw Error('English name pool exhausted');
};
const createBeforeLocalization=create;
create=function(...args){creatingEnglishWorld=gameLanguage==='en';try{return createBeforeLocalization(...args)}finally{creatingEnglishWorld=false;localeAliasState=null}};

const localeDictionary=globalThis.NATION_EN||{};
const localeEscape=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const localePattern=new RegExp(Object.keys(localeDictionary).sort((a,b)=>b.length-a.length).map(localeEscape).join('|')||'(?!)','g');
let localeAliasState=null,localeAliasSignature='',localeAliases={},localeAliasPattern=null,localeTitleState=null;
function localeCurrentState(){
 if(typeof s!=='undefined'&&s)return s;
 if(!localeTitleState)try{localeTitleState=JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){}
 return localeTitleState;
}
function localePeople(state){return [...(state?.political?.members||[]),...(state?.political?.candidates||[]),...(state?.constitution?.judges||[]),...(state?.judicialStaff?.reserve||[]),...(state?.bicameral108?.upper?.members||[]),...(state?.military?.members||[]),...(state?.judicialStaff?.history||[]).map(x=>x.person)].filter(Boolean)}
function localeBase(text){return String(text).replace(localePattern,key=>' '+localeDictionary[key]+' ').replace(/\s+/g,' ').trim()}
function refreshLocaleAliases(state=localeCurrentState()){
 if(!state)return;
 const people=localePeople(state),regions=state.governance?.regions||[],families=state.aristocracy?.families||[];
 const signature=[state.name,...people.map(p=>p.name),...regions.map(z=>z.name),...families.map(f=>f.name),...(state.political?.factions||[]).map(f=>f.name),...(state.bicameral108?.upper?.groups||[]).map(f=>f.name)].join('|');
 if(localeAliasState===state&&localeAliasSignature===signature)return;
 localeAliasState=state;localeAliasSignature=signature;localeAliases={};
 const set=(a,b)=>{if(a&&a!==b)localeAliases[a]=b};
 const stem=(()=>{let name=state.name||'';for(const suffix of REGIMES.map(r=>r.suffix).sort((a,b)=>b.length-a.length))if(name.endsWith(suffix))return name.slice(0,-suffix.length);return name})();
 const country=EN_COUNTRIES[localeHash(state.seed+'|country')%EN_COUNTRIES.length];
 const prefix={constitutional:'Kingdom of ',westminster:'United Kingdom of ',absolute:'Kingdom of ',aristocratic:'Commonwealth of ',federal:'Federation of ',theorepublic:'Sacred Republic of ',theoabsolute:'Holy State of ',party:"People's Republic of "}[state.political?.regime]||'Republic of ';
 if(/[\u3400-\u9fff]/.test(stem)){set(stem,country);set(state.name,prefix+country);set(stem+'之春',country+' Spring')}
 const occupied=new Set(),identities=new Map();
 for(const p of people.slice().sort((a,b)=>String(a.baseName||a.name||'').localeCompare(String(b.baseName||b.name||'')))){
  const base=p.baseName||p.name;if(!base||/主席（玩家）/.test(base)){set(base,'Chair (You)');continue}
  let name=identities.get(base)||base;
  if(!identities.has(base)&&/[\u3400-\u9fff]/.test(base)){let i=0;do{name=englishIdentity(base,state.seed,i++)}while(occupied.has(name));}
  identities.set(base,name);occupied.add(name);set(base,name);
  if(p.honour?.title)set(p.name,(localeDictionary[p.honour.title]||localeBase(p.honour.title))+' '+name);else set(p.name,name);
  if(p.rank)set(p.rank+' '+p.name,(localeDictionary[p.rank]||p.rank)+' '+name);
 }
 for(const f of [...(state.political?.factions||[]),...(state.bicameral108?.upper?.groups||[])]){
  const raw=f.name||'',national=stem&&raw.startsWith(stem),base=national?raw.slice(stem.length):raw;
  set(raw,(national?country+' ':'')+localeBase(base).replace(/(Party) (Orthodox|New Generation|Reform|Mainstream) Faction/g,'$1 — $2 Faction'));
 }
 const usedPlaces=new Set();
 for(const z of regions){let i=localeHash(state.seed+'|region|'+z.id)%EN_PLACES.length;while(usedPlaces.has(i))i=(i+1)%EN_PLACES.length;usedPlaces.add(i);const town=EN_PLACES[i];
  const suffix=z.name.slice((z.stem||'').length),kind=localeDictionary[suffix]||'Province';
  set(z.stem,town);set(z.name,town+' '+kind);
 }
 if(state.capital&&!localeAliases[state.capital])set(state.capital,EN_PLACES[localeHash(state.seed+'|capital')%EN_PLACES.length]);
 for(const f of families)set(f.name,'House '+EN_SURNAMES[(localeHash(state.seed+'|house')+f.id*19)%EN_SURNAMES.length]);
 localeAliasPattern=new RegExp(Object.keys(localeAliases).sort((a,b)=>b.length-a.length).map(localeEscape).join('|'),'g');
}
function translateGameText(value){
 const original=String(value??'');if(gameLanguage!=='en'||!/[\u3400-\u9fff]/.test(original))return original;
 if(Object.hasOwn(localeDictionary,original.trim()))return original.replace(original.trim(),localeDictionary[original.trim()]);
 const patterns=[
  [/^(.+?)每提高1个百分点、(.+?)每提高2个百分点、(.+?)每提高1\.5个百分点，全票门槛各＋1，降税相反。(.*)$/s,(_,income,corporate,sales,rest)=>`Each increase of 1 percentage point in ${translateGameText(income)}, 2 in ${translateGameText(corporate)}, or 1.5 in ${translateGameText(sales)} raises the full-support threshold by 1. Tax cuts reverse this effect. ${translateGameText(rest)}`],
  [/^折算倾向 = 议程倾向 −（本案全票门槛 − 60）。(.*)$/s,(_,rest)=>`Adjusted alignment = agenda alignment − (this bill’s full-support threshold − 60). ${translateGameText(rest)}`],
  [/^已执政 ([\d.]+) 年 · (\d+) 季度；(.*)$/s,(_,years,q,rest)=>`In office: ${years} years · ${q} quarters. ${translateGameText(rest)}`],
  [/^每 12 季度轮换，距下次换届 (\d+) 季度。.*$/s,(_,q)=>`Regional demands reset every 12 quarters; the next reset is in ${q} quarters. The earlier term-delivery indicator covers the 24-quarter electoral term. This panel shows the current regional cycle. From quarter 6 onward, unmet demands increase approval and stability losses.`],
  [/^玩家党派与政治盟友合计 ([\d.]+)% 席位。.*$/s,(_,n)=>`Your party and coalition allies hold ${n}% of seats. At 70 group relations, meet another party's caucus leader to invite them into government.`],
  [/^在任 (\d+) \/ 法定 (\d+) 席$/,(_,n,total)=>`${n} serving / ${total} statutory seats`],
  [/^执政提醒，(\d+)条，点击(展开|收起)；拖动或使用上下方向键调整位置$/,(_,n,verb)=>`Governing alerts: ${n}. Click to ${verb==='展开'?'expand':'minimize'}; drag or use the arrow keys to reposition.`],
  [/^本季还剩\s*(.*)$/,(_,rest)=>`Remaining this quarter: ${translateGameText(rest)}`],
  [/^本季已回复 (\d+) 件 · 每季至少 3 件$/,(_,n)=>`${n} responses this quarter · At least 3 events per quarter`],
  [/^当前预测 ([\d.]+)%。(.*)$/s,(_,n,rest)=>`Current forecast: ${n}%. ${translateGameText(rest)}`],
  [/^本案预计额外稳定损失 ([\d.]+)。$/,(_,n)=>`Additional stability loss if this bill passes: ${n}.`]
 ];
 for(const [pattern,replacement]of patterns)if(pattern.test(original))return original.replace(pattern,replacement);
 refreshLocaleAliases();
 let text=original;
 const protectedNames=[];
 if(localeAliasPattern)text=text.replace(localeAliasPattern,key=>{protectedNames.push(localeAliases[key]);return '\uE000'+(protectedNames.length-1)+'\uE001'});
 text=text.replace(/第\s*(\d+)\s*\/\s*(\d+|∞)\s*季度/g,'Quarter $1 / $2').replace(/第\s*(\d+)\s*季度/g,'Quarter $1').replace(/(\d{4})\s*年\s*·\s*Q(\d+)/g,'$1 · Q$2');
 if(Object.hasOwn(localeDictionary,text.trim()))text=text.replace(text.trim(),localeDictionary[text.trim()]);
 else text=text.replace(localePattern,key=>' '+localeDictionary[key]+' ');
 text=text.replace(/\uE000(\d+)\uE001/g,(_,i)=>' '+protectedNames[Number(i)]+' ');
 text=text.replace(/[，、]/g,', ').replace(/；/g,'; ').replace(/：/g,': ').replace(/。/g,'. ').replace(/（/g,'(').replace(/）/g,')').replace(/[“”「」]/g,'"').replace(/！/g,'!').replace(/？/g,'?').replace(/\s+/g,' ').replace(/\s+([,;:.!?%)])/g,'$1').replace(/\(\s+/g,'(').replace(/\b1 quarters\b/g,'1 quarter').replace(/\b1 points\b/g,'1 point').replace(/\b1 seats\b/g,'1 seat');
 return (original.startsWith(' ')?' ':'')+text.trim()+(original.endsWith(' ')?' ':'');
}
const guideMatchesBeforeLocalization=guideMatches104;
const EN_GUIDE_TEXT={
 ap:()=>`This game uses ${translateGameText(ACTION_POINT_MODES[actionMode()])}. ${translateGameText(actionModeDescription())} Negotiations, appointments, votes, proposal actions and situation responses usually cost 1 point. Reading pages, answering quarterly events and changing assignments do not. Unused points expire at the end of the quarter. Refreshing or loading cannot reroll your allocation.`,
 country:'This is the fictional country you govern. Its name identifies the world; its government system, economy, regions and your decisions determine how it plays.',
 overview:'Review the main national indicators, active situations, pending decisions and political pressures before setting your priorities for the quarter.',
 calendar:'One game year contains 6 quarters. Each term lasts 24 quarters. Democratic governments face elections at quarters 24 and 48, then receive their final assessment. Other governments may continue at quarter 48 and are asked again every 12 quarters.',
 approval:'Public approval measures confidence in your government and forms the baseline for regional voting. Employment, public services, fulfilled promises and your choices affect it. In democratic systems, approval below 20% costs 4 stability and 3 investor confidence per quarter; reaching 0% ends your rule. In non-democratic systems, including nominal democracies and theocratic republics, approval below 20% triggers a democratization movement. At 0%, an additional 12 stability is lost each quarter, alongside the existing (approval − 55) × 0.08 stability adjustment. Administrator Mode retains these effects but prevents defeat.',
 stability:'Political stability ranges from 0 to 100. Below 20, your rule ends. After two consecutive quarters below 35, with at least three regional demands unfulfilled, each quarter has a 35% chance of triggering a rebellion. Low stability alone does not guarantee a rebellion. Events, responses to situations and administration-and-security spending can improve stability; crises, spending cuts and dismissals can reduce it. Dismissal penalties also depend on the official’s record and the political system.',
 growth:'Annualized real growth measures changes in economic output after inflation. Education, infrastructure, reforms, fiscal demand and investor confidence affect it, alongside interest rates, external conditions and crises. A temporary growth modifier lasts for its stated number of quarters; it is not a cash payment.',
 gdp:'Nominal GDP measures the economy’s size in billions of the game’s standard currency. Both real growth and inflation affect it. A decision costing 1% of GDP adds that amount to government debt at the time you take it.',
 inflation:'Inflation measures rising prices. High inflation weakens purchasing power and public approval, prompting the central bank to adjust interest rates. Reaching 50% can trigger an economic crisis. Ending that crisis requires inflation below 20% and debt below 60% of GDP at the same time.',
 unemployment:'The share of the labour force without work. High unemployment damages approval; reaching 10% can trigger a General Strike. Relief, public works, social reforms and stronger growth can improve employment. Privatization and austerity may initially increase unemployment.',
 debt:'Government debt is outstanding public borrowing. Debt relative to GDP measures the burden on the economy. Deficits and special spending add debt; surpluses and repayments reduce it. Reaching 100% of GDP can trigger an economic crisis. Debt above 190% of GDP together with confidence below 25 ends the game.',
 judicial:'Judicial independence measures the courts’ freedom from executive interference. In ordinary systems, falling to 20 or below can trigger Judicial Fairness Protests; raising independence above 40 ends that situation. Persistently high independence brings more judicial scrutiny. Military government does not calculate this indicator until it changes to another system.',
 rate:'The central bank’s policy interest rate guides monetary conditions. It responds to inflation and the output gap, while retaining some inertia from the previous quarter. Higher rates restrain demand but raise borrowing costs. Lower rates ease financing but can worsen price pressure. You influence the economic conditions rather than directly setting this rate.',
 balance:'The fiscal balance equals government revenue minus public spending and debt-interest costs, expressed as a share of GDP. A negative figure is a deficit; a positive figure is a surplus.',
 research:'Each quarter, research progress rises by twice the education-and-research budget percentage. After completing the education department’s proposal, the multiplier becomes three. Every 100% raises research by one level, retaining excess progress. Research raises fixed action points up to 6, raises the minimum random roll up to 6, or adds points to the pre-rolled schedule without a 6-point cap.',
 'pass-rate':'Chamber support is the sum of each group’s voting support weighted by its seat share. Adjusted alignment of 50 gives no supporting votes from that group; 51 gives 10%, and 60 gives full support. Follow the threshold shown for the current bill: constitutional amendments and special systems may use different procedures.',
 'faction-relation':'Group relations measure your relationship with a party or faction. Negotiations, promises and decisions can change them. In systems with coalition governments, a caucus with relations of at least 70 may accept an invitation to join the government.',
 agenda:'Agenda alignment is a group’s willingness to support your programme. Bill-specific taxes, spending preferences and negotiated concessions alter the effective value. Non-player groups lose 2 alignment each quarter; negotiations can offset the decline.',
 'effective-agenda':'Adjusted alignment equals agenda alignment minus (the bill’s full-support threshold − 60). At 50, none of the group’s seats support the bill; each additional point adds 10% support, reaching 100% at 60.',
 loyalty:'Loyalty affects how reliably an official supports your government. Low loyalty can lead to resignation. An unfinished departmental proposal normally costs 0.5 loyalty each quarter. Federal councillors are exempt from this proposal penalty; loyalty of 70 unlocks player assistance with their proposals and assignments.',
 coalition:'In democratic and nominally democratic systems, ministers normally come from your party and its coalition allies. At 70 group relations, meet another party’s caucus leader and spend 1 action point to invite it into government. Its members then become eligible for cabinet appointments. Constitutional monarchies, Westminster systems and semi-presidential republics begin with coalitions; other eligible systems begin without one. Other non-democratic systems allow appointments from all factions without a coalition invitation. Losing coalition support can cause a government crisis; its specific deadline and consequences appear in the situation panel.',
 programme:'A departmental proposal reflects its minister’s political outlook and your government system. Each of its three actions has its own cost and effects, including progress and a loyalty gain of 1–3. Related investment can reduce costs; competence and political affinity increase progress. Some actions also affect public approval, group relations or scandal risk. An unfinished proposal costs its minister 0.5 loyalty each quarter, except in the Federal Council system. Projects already started retain their progress and effects after a replacement; unstarted proposals can change with the new minister. Completion rewards are granted once.',
 skill:'Competence affects an official’s performance and the progress gained from departmental proposal actions. Political outlook and relevant public investment also influence results.',
 'local-demands':'Each region has a demand tied to its economy and social base. Relevant decisions and projects increase progress. Completed demands do not repeat during that cycle. Demands reset every 12 quarters, while earlier delivery still contributes to your record.',
 olympics:'Only one hosting bid is available in each game. A successful bid begins an eight-quarter preparation period, with a 0.3% GDP initial cost and 0.15% GDP maintenance each quarter. Completion requires 100% progress and quality of at least 40. Successful games grant 6 approval, 3 confidence and a 0.5 growth modifier for six quarters. Cost overruns above 40 reduce the approval reward to 3 and add debt equal to 2% of GDP. Failure costs 8 approval, 4 confidence and 3 stability. After the scheduled conclusion, choose how to reuse the venues; voluntary cancellation skips venue disposal. Bidding opportunities are not restored after success, failure or cancellation.',
 strike:'A General Strike begins at 10% unemployment, or with 15% unemployment if selected as an opening crisis. It damages the economy and costs 2 stability and 2 approval each quarter. Reduce unemployment to the ending threshold shown in the situation panel. Sustained social-protection or education spending, emergency relief and public works offer different ways to address it. Emergency relief has no quarterly cooldown; public works have a four-quarter cooldown.',
 'military-council':'The Military Council has 12–15 members, including your chair. It includes at least 2 Generals, 2 Lieutenant Generals and 3 Brigadier Generals. Remaining ranks are weighted toward lower ranks, never below Major. Two or three members represent the Civilian Administration Bloc; the rest belong to the Military Establishment. Each member has one vote, regardless of rank. Willingness of at least 60 means a vote in favour. Budgets and reforms need a majority; amendments need two thirds before judicial review.',
 'military-backing':'Military support starts between 75 and 85. Below 40, stability falls by 1 each quarter; below 20, stability falls by 3 and approval by 1. At 0, military rule ends. Negotiations, projects, events, reforms and security spending can change support. After a political transition, these military-government rules stop applying.',
 'military-transition':'Four competing routes sum to 100%: Maintain Council Rule, Establish Civilian Government, Consolidate Personal Power, and Move Toward Oligarchy. Advancing a transition first reduces council-rule progress; if necessary, it draws proportionally from the other routes. Reaching 100% establishes Nominal Democracy, Absolute Monarchy or Aristocratic Rule respectively. The original economy, quarter and history remain. Maintaining council rule does not complete the situation.',
 save:'Your current game is saved in this browser. Export it from the National Archive to keep a portable backup. Clearing site data removes the local copy. Switching the interface language does not restart the game or reroll its decisions.',
 guide:'Search for a game concept or a synonym. English searches such as stability, approval, chamber support and policy interest rate open the corresponding entries. The guide explains mechanics, offices, proposals, reforms and situations; randomly generated names and ordinary individual events are not indexed.'
};
const EN_GUIDE_ALIASES={ap:['action points','political action points','AP','available points'],approval:['approval','public approval','national approval','public support'],stability:['stability','political stability','national stability'],research:['research','research level','research progress'],programme:['ministerial proposal','departmental proposal','proposal progress'],coalition:['coalition','coalition government','cabinet eligibility','governing coalition'],olympics:['Olympics','Olympic Games','hosting bid','Olympic preparations','venue disposal'], 'pass-rate':['chamber support','legislative support','voting threshold'], 'local-demands':['regional demands','local demands','delivery progress'],rate:['policy interest rate','policy rate','interest rate'],unemployment:['unemployment','unemployment rate']};
const guideCatalogBeforeLocalization=guideCatalog104;
guideCatalog104=function(){const entries=guideCatalogBeforeLocalization();return gameLanguage==='en'?entries.map(e=>({...e,title:translateGameText(e.title),category:translateGameText(e.category),aliases:[...new Set([...e.aliases,...e.aliases.map(translateGameText),...(EN_GUIDE_ALIASES[e.id]||[])])],text:typeof EN_GUIDE_TEXT[e.id]==='function'?EN_GUIDE_TEXT[e.id]():EN_GUIDE_TEXT[e.id]||translateGameText(e.text)})):entries};
const guideArticleBeforeLocalization=guideArticle104;
guideArticle104=function(entry){if(gameLanguage!=='en')return guideArticleBeforeLocalization(entry);const seen=new Set([guideNormalize104(entry.title)]),aliases=(EN_GUIDE_ALIASES[entry.id]||entry.aliases.map(translateGameText)).filter(a=>{const n=guideNormalize104(a);if(seen.has(n))return false;seen.add(n);return true});return `<article class="guide-entry"><span class="tag">${esc(translateGameText(entry.category))}</span><h3>${esc(translateGameText(entry.title))}</h3><p>${esc(translateGameText(entry.text))}</p>${aliases.length?`<details><summary>Also known as</summary><p>${aliases.map(esc).join(', ')}</p></details>`:''}</article>`};
guideMatches104=function(query,entries=guideCatalog104()){
 if(gameLanguage!=='en'||/[\u3400-\u9fff]/.test(query))return guideMatchesBeforeLocalization(query,entries);
 const q=guideNormalize104(query);if(!q)return guideMatchesBeforeLocalization(query,entries);
 const aliases=e=>[e.id,e.title,...e.aliases].map(a=>guideNormalize104(translateGameText(a)));
 const exact=entries.filter(e=>aliases(e).includes(q));return exact.length?exact:entries.filter(e=>aliases(e).some(a=>a.includes(q)));
};
const searchGuideBeforeLocalization=searchGuide104;
searchGuide104=function(query){searchGuideBeforeLocalization(query);if(gameLanguage==='en'&&typeof window!=='undefined'){const input=$('guide-query');if(input&&/[\u3400-\u9fff]/.test(input.value))input.value=translateGameText(input.value)}};
const tutorialStepsBeforeLocalization=tutorialSteps104;
tutorialSteps104=function(...args){
 const steps=tutorialStepsBeforeLocalization(...args);if(gameLanguage!=='en')return steps;
 const titles={welcome:'Welcome to Office','tour-roadmap':'Before You Begin','tour-duration':'Terms and Quarters','tour-mission':'Your Objective','tour-assessment':'Your Legacy','office-objects':'Govern from Your Desk',guide:'The Governing Guide','page-tutorial':'Learn One Page at a Time'};
 const copy={
  welcome:()=>{const r=regime(),host=translateGameText(TUTORIAL_HOST105[r.id][1]),address={absolute:'Your Majesty',aristocratic:'Your Grace',party:'Comrade Chair',tyranny:'Chair',theorepublic:'Supreme Leader',theoabsolute:'Supreme Prelate',presidential:'President',semi:'President',symbolic:'President',constitutional:'Prime Minister',westminster:'Prime Minister',federal:'Chancellor'}[r.id];return `Welcome, ${address}. On behalf of the ${host}, I will introduce the essentials of governing.`},
  'tour-roadmap':'Documents, Telephone, Archives and Map are your main desk controls. Each section has its own Page Tutorial. Press Space to continue, or use Skip Tutorial at the bottom right.',
  'tour-duration':()=>s.adminMode?'Administrator Mode has no quarter limit and no defeat ending. Begin a new history when you wish to replace this save.':regime().democratic?'A standard game lasts 48 quarters: two terms spanning 8 game years. The game uses 6 quarters per year. Constitutional changes may alter the term rules.':'A standard game lasts 48 quarters. Your government system permits you to continue beyond that point through later events.',
  'tour-mission':'Keep your government in power while pursuing your preferred agenda. Public approval, stability, public finances and constitutional choices shape your path.',
  'tour-assessment':'Your decisions produce a nine-dimensional political assessment at the end of your rule, weighted by their importance. While governing, track national indicators in the National Archive.',
  'office-objects':'Documents hold events, budgets, reforms, situations and constitutional business. Telephone connects you with institutions and officials. Archives contain indicators and records. Map shows regions and elections. Return to Desk to choose another object, or use keys 1–4.',
  'page-tutorial':'Open a section from your desk, then select Page Tutorial in the top-right corner. It explains only the current page, leaving you free to learn each area when you need it.',
  guide:'Use the Governing Guide whenever a concept is unclear. Search for a term or synonym—for example, stability or political stability—to find its rules, thresholds and consequences.',
  advance:'Advancing a quarter updates the economy and government, then grants new action points. Unused points do not carry over. A confirmation appears if points remain; select Do not ask again this game to hide it. Pending events must be answered first.'
 };
 return steps.map(step=>({...step,...(titles[step.id]?{title:titles[step.id]}:{}),...(copy[step.id]?{text:copy[step.id]}:{})}));
};
function setGameLanguage(language){
 if(!['zh','en'].includes(language))return;gameLanguage=language;
 try{localStorage.setItem(LANGUAGE_KEY,language)}catch(_){}
 if(typeof document!=='undefined'&&document.documentElement){document.documentElement.lang=language==='en'?'en':'zh-CN';document.documentElement.dataset.language=language;}
 if(typeof localizeDocument==='function')localizeDocument();
}

/* Translate text nodes only, after game renderers finish their own work. Never touch IDs,
   onclick handlers, values, data attributes or the simulation's Chinese lookup strings. */
let localizeDocument=null;
if(typeof window!=='undefined'&&typeof MutationObserver!=='undefined'&&document.body){
 const textRecords=new WeakMap(),attributeRecords=new WeakMap();let observer,busy=false,scheduled=false;
 const attrs=['aria-label','title','placeholder','alt'];
 const processText=node=>{let record=textRecords.get(node);const value=node.nodeValue;if(!record||value!==record.output)record={source:value,output:value};const output=translateGameText(record.source);if(value!==output)node.nodeValue=output;record.output=output;textRecords.set(node,record)};
 const processElement=el=>{for(const attr of attrs){if(!el.hasAttribute(attr))continue;let records=attributeRecords.get(el)||{},record=records[attr],value=el.getAttribute(attr);if(!record||value!==record.output)record={source:value,output:value};const output=translateGameText(record.source);if(value!==output)el.setAttribute(attr,output);record.output=output;records[attr]=record;attributeRecords.set(el,records)}};
 localizeDocument=function(){
  if(busy)return;busy=true;observer?.disconnect();
  try{
   refreshLocaleAliases();
   const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,{acceptNode(node){const el=node.nodeType===1?node:node.parentElement;return !el||el.closest('script,style,noscript,textarea,[data-no-localize]')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
   while(walker.nextNode()){const node=walker.currentNode;if(node.nodeType===3)processText(node);else processElement(node)}
   document.documentElement.lang=gameLanguage==='en'?'en':'zh-CN';document.documentElement.dataset.language=gameLanguage;
   document.title=gameLanguage==='en'?'Nation / State · A Political Strategy Game':'国策 · 国家治理模拟';
   document.querySelectorAll('[data-language-choice]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.languageChoice===gameLanguage)));
  }finally{busy=false;observer?.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attrs})}
 };
 observer=new MutationObserver(()=>{if(!scheduled){scheduled=true;queueMicrotask(()=>{scheduled=false;localizeDocument()})}});
 localizeDocument();
}
