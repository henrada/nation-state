/* Reference content only. Thresholds describe the simulation; this module never changes it. */
const GUIDE_METRICS={
 ap:{
  increase:['进入新季度会获得本季额度，剩余点数不结转。提高教育与科研预算、完成教育部门提案，可加快科研升级，从而提高后续季度的行动能力。','A new quarter grants that quarter’s allocation; unused points do not carry over. Education-and-research spending and a completed education programme accelerate research, improving future allocations.'],
  decrease:['协商、会见、任免、提交表决、推进部长提案和多数局势行动通常消耗1点；具体以按钮所列费用为准。上院复审、部分国家转型选择、回复季度事件与查阅资料不消耗行动点。','Negotiations, meetings, appointments, dismissals, votes, departmental actions and most situation responses usually cost 1 point. Check the action’s stated cost. Upper-house review, certain transition decisions, quarterly event replies and reading references cost no action points.'],
  thresholds:['剩余行动点不足所需费用时，相应操作不可执行。降至0不会直接结束游戏，仍可回复事件与进入下一季度。\n固定模式：每季3点，每级科研增加1点，上限6点。随机模式：初始1—6点，每级科研提高下限1点，最高成为6—6。伪随机模式：预排1—6点加科研等级，可以超过6点。','An action is unavailable when remaining points cannot cover its cost. Reaching 0 does not end the game; event replies and quarter advancement remain available.\nFixed: 3 per quarter, plus 1 per research level, capped at 6. Random: initially 1–6, with the lower bound rising by 1 per research level until 6–6. Planned: a prearranged 1–6 roll plus research level, which may exceed 6.'],
  notes:['本季剩余点数与本季总额度不同：行动会减少前者，科研主要提高以后发放的额度。科研在新季度发点前结算；刷新、读档、切换页面或语言不会重新发点。','Remaining points differ from the quarter’s total allocation: actions reduce the former, while research improves future grants. Research is processed before the new allocation. Reloading, importing a save, changing pages or switching language does not grant points again.']
 },
 approval:{
  increase:['改善就业、使实际增长高于2%、让通胀接近2%，会改善经济模型中的民意目标。提高医疗卫生与社会保障预算、降低个人所得税，以及选择有支持率收益的事件、改革和部长措施，也有利于全国支持率。\n解决危机、履行政治承诺和减轻财政压力，可减少持续损耗；只提高某一地区支持率的措施不一定直接增加全国支持率。','Lower unemployment, real growth above 2% and inflation closer to 2% improve the economic approval target. Healthcare and social-protection spending, lower income tax, and events, reforms or departmental actions with approval rewards also help.\nResolving crises, fulfilling political promises and easing fiscal pressure reduce ongoing losses. An action that improves one region’s support need not directly raise national approval.'],
  decrease:['失业增加、增长走弱、物价偏离2%、削减医疗和社会保障、提高个税或财产税等会压低民意目标。危机持续、失信、部分强制政策和撤换官员也可能直接扣减支持率。','Higher unemployment, weaker growth, inflation farther from 2%, healthcare or welfare cuts, and higher income or property taxes lower the approval target. Continuing crises, broken promises, some coercive policies and dismissals may also deduct approval directly.'],
  thresholds:['低于50%出现执政提醒。\n民主国家：低于20%时，每季度额外稳定−4、信心−3；降至0%结束执政。\n非民主政体（包括象征性民主与本游戏中的神权共和制）：低于20%必定触发“国家名之春”；降至0%时每季度额外稳定−12。\n非民主政体另有每季度（全国支持率−55）×0.08的稳定修正：低于55会拖累稳定，高于55则改善。管理员模式保留指标影响，但不触发失败结局。','Below 50% produces an alert.\nDemocratic systems: below 20% causes an additional −4 stability and −3 confidence per quarter; reaching 0% ends your rule.\nNon-democratic systems, including Nominal Democracy and this game’s Theocratic Republic: below 20% triggers the country’s Spring movement; at 0%, stability suffers an additional −12 each quarter.\nNon-democratic systems also apply a quarterly stability adjustment of (national approval − 55) × 0.08: approval below 55 harms stability, while approval above 55 helps it. Administrator Mode retains numerical consequences but prevents defeat.'],
  notes:['范围0—100%。这是全国公众认可度，也是地区支持率计算的基准；它不等于加权支持率或院内支持率。\n全国支持率的经济变化逐季传导；短期事件效果可以立即出现。','Range: 0–100%. This measures national public approval and forms the baseline for regional support. It is distinct from weighted support and chamber support.\nEconomic changes to approval feed through over time; direct event effects may be immediate.']
 },
 forecast:{
  title:['加权支持率','Weighted Support'],
  intro:['将各地区的支持率按人口权重汇总，反映政府在全国各地的实际支持基础。所有政体都使用这一指标。','Regional support aggregated by population weight, measuring the government’s support across the country. Every government system uses this indicator.'],
  aliases:['当前加权选票预测','全国加权选票预测','加权选票','加权支持度','加权支持','地方加权认同','weighted support','weighted approval','weighted vote forecast'],
  increase:['提高全国支持率；回应地区产业与社会基础所对应的诉求；通过契合当地需要的政策、改革与部长措施；改善地区发展。人口权重较大的地区变化，对全国加权结果的影响更大。\n完成相应倾向部长的提案，可减轻今后的地区支持衰退；这是减少以后损耗，不是返还过去已扣的支持。','Raise national approval, fulfil regional demands, enact policies, reforms and departmental measures suited to local needs, and improve regional development. Changes in more populous regions have greater weight.\nCompleting programmes by eligible ministerial outlooks reduces future regional support decay. It prevents future losses rather than refunding past ones.'],
  decrease:['全国支持率下降、地方诉求未完成、政策与当地需要不符、发展受损，会降低地区支持。没有豁免局势时，每季随机一个地区还会承受基础5个百分点的支持衰退；党内路线与部长成果会修正该数值。','Falling national approval, unmet demands, policy mismatches and damage to regional development reduce regional support. Outside exempt situations, one random region also loses a base 5 percentage points each quarter, adjusted by ruling-party routes and completed ministerial programmes.'],
  thresholds:['低于50%出现提醒，但不在平时直接判定选举失败。民主国家在选举结算时必须超过50%才能胜选，恰好50%不算胜选。\n非民主国家的权力评议会按高于或低于50%的差额修正稳定，不统一套用民主国家的败选结局。\n社会多元修正案：长期少数群体问题仍存在且未采取强制措施时，加权支持率达到80%、稳定达到60，才可提出；这不等于修宪已经通过。\n联邦委员会制修宪审查：司法赞成达到半数的同时，加权支持率必须超过50%。','Below 50% produces an alert, but does not immediately cause an election loss between elections. Democratic election settlement requires more than 50% to win; exactly 50% is insufficient.\nNon-democratic legitimacy reviews adjust stability according to the gap above or below 50%, rather than applying the democratic defeat rule universally.\nThe Social Pluralism Amendment requires weighted support of at least 80% and stability of at least 60 while an unresolved minority issue has no coercive policy underway. Meeting these conditions only unlocks the proposal.\nFederal amendment review requires judicial approval of at least half and weighted support above 50% at the same time.'],
  notes:['加权支持率＝各地区支持率×该地区人口权重，再全部相加。地区支持率由全国支持率、诉求履约、历史政策、发展、开局民意修正与季度累计修正共同决定。\n未履约最多使基准支持乘80%；超额履约最多增加8%的基准修正。开局地区差异会保留，地区支持在计算中限制为1%—99%。\n议会换届的政党得票另有政策契合与竞选表现权重，不能把它与此项指标混为一谈。','Weighted support is the sum of each region’s support multiplied by its population weight. Regional support combines national approval, demand fulfilment, past policy, development, starting support offsets and accumulated quarterly changes.\nCompletely unmet demands can multiply the baseline by 80%; overdelivery adds at most an 8% baseline bonus. Starting regional differences persist. Regional support is bounded to 1–99% in this calculation.\nParty votes used to redistribute legislative seats also incorporate policy fit and campaign decisions; that is a separate calculation.']
 },
 growth:{
  increase:['维持教育与基础设施投资以积累人力和生产资本；完成具有长期增长收益的改革；改善信心；选择带有正向增长压力的措施。增加公共需求、降低税负或实际利率，也可能提高增长目标。','Sustain education and infrastructure investment, complete reforms with lasting growth benefits, improve confidence, and choose measures with positive growth pressure. Stronger public demand, lower tax burdens or lower real interest rates may also lift the growth target.'],
  decrease:['紧缩公共支出、加税、较高实际利率、出口环境恶化和负向增长压力会拖累增长。大罢工、经济危机、灾害与叛乱等局势还会直接削减当季增长及经济总量。','Public-spending cuts, higher taxes, higher real interest rates, weaker export conditions and negative growth pressure restrain growth. Strikes, economic crises, disasters and rebellions can also directly reduce current growth and output.'],
  thresholds:['高于0%表示实际经济扩张，低于0%表示实际收缩。高于潜在增长有助于降低失业，却会增加通胀压力；低于潜在增长则相反。\n增长本身没有单独的失败门槛，但持续低增长会通过民意、就业和债务风险威胁执政。','Above 0% means real expansion; below 0% means real contraction. Growth above potential tends to reduce unemployment but adds inflationary pressure; growth below potential has the opposite effects.\nGrowth has no standalone defeat threshold, but persistently weak growth threatens your rule through approval, employment and debt risk.'],
  notes:['这是年化实际增长率，不是每季度GDP直接增加的比例。每年六季度，名义GDP每季按（实际年化增长＋通胀）÷600调整。\n增长向目标平滑靠近：旧增长占55%，本季目标占45%，另有外部波动和局势修正。','This is annualized real growth, not the percentage by which GDP increases every quarter. With six quarters per year, nominal GDP changes each quarter by (annualized real growth + inflation) ÷ 600.\nGrowth adjusts gradually: 55% of the previous rate plus 45% of the new target, with additional variation and situation effects.']
 },
 'growth-pressure':{
  title:['增长压力','Growth Pressure'],intro:['事件、局势和施政措施在若干季度内对增长目标施加的临时修正。正值推动增长，负值拖累增长。','A temporary adjustment to the growth target from events, situations and government actions. Positive values support growth; negative values restrain it.'],aliases:['年化增长压力','临时增长修正','growth pressure','temporary growth modifier'],
  increase:['选择标注“增长压力＋”的事件、改革配套或部门措施；例如成功举办奥运会可带来六季度的正向增长压力。负向效果到期消失，也会使净压力回升。','Choose events, reform measures or departmental actions showing positive growth pressure. A successful Olympics, for example, provides a positive modifier for six quarters. Expiring negative effects also improve the net modifier.'],
  decrease:['负向经济冲击、债务重组、工资与利润管制等选项可施加负向压力。正向效果到期后，净压力也会下降。','Adverse economic shocks, debt restructuring and wage-and-profit controls can add negative pressure. Expiring positive effects also lower the net modifier.'],
  thresholds:['以0为中性；没有单独由增长压力触发的危机或失败门槛。多个尚未到期的增长效果相加，最终仍通过实际增长、就业、通胀和民意影响国家。','Zero is neutral. Growth pressure has no independent crisis or defeat threshold. Active modifiers add together and affect the country through actual growth, employment, inflation and approval.'],
  notes:['“增长压力＋1”不是立刻给GDP加1%，也不是保证当季实际增长率增加1个百分点。其他条件不变时，它使增长目标提高1点，经济计算先传导约0.45点，随后仍受旧增长、其他修正和波动影响。\n效果通常有持续季度，按选项注明的期限逐季扣除；已完成改革的永久潜在增长收益另行计算。','“Growth pressure +1” does not immediately add 1% to GDP or guarantee a one-point increase in actual growth. Holding other conditions constant, it raises the target by one point, of which about 0.45 feeds into that quarter’s economic calculation. Other modifiers and variation still apply.\nModifiers expire after their stated duration. Permanent potential-growth benefits from completed reforms are calculated separately.']
 },
 potential:{
  title:['潜在增长','Potential Growth'],intro:['由国家初始条件、基础设施、人力资本与已落地改革共同形成的长期增长基准。','The long-run growth benchmark shaped by starting conditions, infrastructure, human capital and implemented reforms.'],aliases:['潜在增长率','长期增长潜力','potential growth'],
  increase:['持续提高基础设施与人力资本，完成带有潜在增长收益的结构性改革。基础设施每增加1点，潜在增长提高0.022个百分点；人力资本每增加1点，提高0.025个百分点。','Build infrastructure and human capital, and complete structural reforms with potential-growth benefits. Each infrastructure point adds 0.022 percentage points to potential growth; each human-capital point adds 0.025.'],
  decrease:['投资长期不足导致资本积累回落，或灾害和其他选择直接损害基础设施、人力资本时，潜在增长会下降。仅施加负向临时增长压力不会直接删去已落地的长期改革收益。','Prolonged underinvestment, disasters or choices that damage infrastructure or human capital reduce potential growth. A negative temporary growth modifier does not itself remove lasting benefits from completed reforms.'],
  thresholds:['没有独立的失败或危机门槛。实际增长高于或低于潜在增长的差额，会影响失业、通胀以及央行的利率反应。','There is no independent defeat or crisis threshold. The gap between actual and potential growth affects unemployment, inflation and the central bank’s response.'],
  notes:['潜在增长＝国家基础潜力＋（基础设施−50）×0.022＋（人力资本−50）×0.025＋已生效改革增长收益。改革尚未落地时不计入长期收益。','Potential growth = the country’s baseline + (infrastructure − 50) × 0.022 + (human capital − 50) × 0.025 + implemented reform growth benefits. Unfinished reforms do not yet contribute their lasting benefits.']
 },
 gdp:{
  increase:['改善实际增长，积累生产资本与人力资本，完成改革。部分选项直接改变GDP；通胀也会抬高名义GDP，但不等于实际产出或居民购买力提高。','Improve real growth, accumulate productive and human capital, and complete reforms. Some options directly change GDP. Inflation also raises nominal GDP, but this is not the same as greater real output or purchasing power.'],
  decrease:['实际增长与通胀之和为负时，季度名义GDP会收缩。罢工、经济危机、灾害和叛乱等额外经济损耗也会减少GDP。','Nominal GDP contracts in the quarterly calculation when real growth plus inflation is negative. Additional losses from strikes, economic crises, disasters and rebellions can also reduce GDP.'],
  thresholds:['没有以某个GDP总量判定游戏失败的门槛。GDP下降会抬高同一笔公债的债务/GDP比例，并改变所有按GDP比例计价的支出。','There is no defeat threshold based on GDP size alone. A lower GDP raises the debt-to-GDP ratio for an unchanged debt stock and changes the value of GDP-priced expenditures.'],
  notes:['单位为十亿元标准货币。基础季度计算：新GDP＝旧GDP×［1＋（实际增长＋通胀）÷600］，之后仍可能受到局势等额外影响。\n一次性“支出1% GDP”按执行时GDP计价，并计入债务；它不是把名义GDP本身直接扣去1%。','GDP is measured in billions of standard currency. The base quarterly calculation is old GDP × [1 + (real growth + inflation) ÷ 600], followed by any additional effects.\nA one-off cost of 1% of GDP is priced using GDP at execution and added to debt; it does not directly subtract 1% from GDP itself.']
 },
 'per-capita':{
  increase:['在本版固定人口下，提高名义GDP即可提高人均名义GDP；若希望反映真实发展，应同时观察实际增长与通胀。','With population fixed in this version, higher nominal GDP raises nominal GDP per capita. Read it alongside real growth and inflation when judging real development.'],
  decrease:['人口不变时，名义GDP下降会使人均名义GDP同步下降。','With unchanged population, falling nominal GDP lowers GDP per capita.'],
  thresholds:['没有独立危机或失败门槛，也没有达到某个数值就直接增加支持率的奖励。','There is no independent crisis or defeat threshold, or automatic approval reward for reaching a particular value.'],
  notes:['人均名义GDP＝GDP÷人口，并换算为标准货币。它不等于工资、中位收入、财富分配或实际购买力。','Nominal GDP per capita is GDP divided by population, converted to standard currency. It is not wages, median income, wealth distribution or real purchasing power.']
 },
 inflation:{
  increase:['债务货币化、量化宽松应急安排和部分供应冲击会提高通胀。增长高于潜在水平、较低实际利率和提高关税也会增加物价压力。','Debt monetization, emergency quantitative easing and some supply shocks raise inflation. Growth above potential, lower real interest rates and higher tariffs also add price pressure.'],
  decrease:['减少持续的通胀冲击，控制过热需求与进口关税；央行加息会抑制物价压力。经济危机中的工资与利润管制可直接降低5个百分点通胀，但会损害就业、支持和信心。','Reduce inflationary shocks, excessive demand and tariffs; central-bank tightening restrains price pressure. Wage-and-profit controls during an economic crisis directly cut inflation by 5 percentage points, at a cost to employment, approval and confidence.'],
  thresholds:['央行目标为2%；偏离2%越远，民意目标受到的损害越大，过低甚至负通胀也不等于没有代价。超过45%出现风险提醒。\n达到50%可触发经济危机。结束危机必须同时满足通胀低于20%、债务/GDP低于60%，仅降低其中一项不够。','The central bank targets 2%. Greater deviation from 2% harms the approval target; very low or negative inflation is not costless. Above 45% produces a risk alert.\nReaching 50% can trigger an economic crisis. Recovery requires both inflation below 20% and debt-to-GDP below 60%; improving only one is insufficient.'],
  notes:['通胀会改变名义GDP、实际利率、公众支持与央行决策。用通胀稀释债务比例也可能引发更高利率和危机，不能视为无代价偿债。','Inflation affects nominal GDP, real interest rates, public approval and central-bank decisions. Inflating away the debt ratio may also cause higher interest rates and crisis; it is not costless debt repayment.']
 },
 unemployment:{
  increase:['实际增长落后于潜在增长时，就业压力会上升。经济危机每季额外失业率＋1个百分点；快速私有化、部分紧缩措施与灾害也可能直接增加失业。','Employment pressure rises when actual growth falls below potential. Economic crisis adds 1 percentage point of unemployment per quarter. Rapid privatization, some austerity measures and disasters may also increase it directly.'],
  decrease:['提高实际增长，采用就业、劳动保障和民生措施。大罢工中：紧急救济支出2% GDP，失业率−1.5；公共工程支出5% GDP，四季度后失业率−3、基础设施＋5。\n社会保障预算至少15%连续四季度可降低失业率4点；教育科研至少8%连续四季度可降低2点。须先在局势中作出相应承诺并通过预算。','Improve real growth and implement employment, labour-protection and social measures. During a general strike, emergency relief costs 2% of GDP and reduces unemployment by 1.5 points; public works cost 5% of GDP and, after four quarters, reduce unemployment by 3 points and add 5 infrastructure.\nA pledged welfare budget of at least 15% for four consecutive quarters reduces unemployment by 4 points; pledged education-and-research spending of at least 8% for four quarters reduces it by 2. First select the corresponding situation pledge and pass the budget.'],
  thresholds:['超过8%出现提醒；达到10%可触发全国大罢工。大罢工要在失业率严格低于5%时才结束，恰好5%仍未达到结束条件。\n失业率本身没有直接失败门槛，但高失业会损害民意，并通过罢工持续损害增长、稳定与信心。','Above 8% produces an alert; reaching 10% can trigger a general strike. The strike ends only when unemployment is strictly below 5%; exactly 5% is insufficient.\nUnemployment has no direct defeat threshold, but harms approval and can sustain a strike that damages growth, stability and confidence.'],
  notes:['经济模型比较实际增长与潜在增长，并使就业状态逐步向中长期水平调整。因此正增长也不保证失业必然下降。救济等直接效果与后续经济变化会共同结算。','The economic model compares actual with potential growth and gradually adjusts employment toward its long-run level. Positive growth does not guarantee falling unemployment. Direct relief effects and subsequent economic changes both contribute.']
 },
 debt:{
  increase:['财政赤字、事件或部长提案的一次性投入会增加公债。即使债务金额不变，GDP下降也会提高债务/GDP。量化宽松暂移的公债在危机结束后的回表事件中恢复。','Fiscal deficits and one-off event or departmental spending increase public debt. A falling GDP raises the ratio even if the debt stock is unchanged. Debt temporarily moved off the books by emergency quantitative easing returns through a post-crisis event.'],
  decrease:['通过提高收入或控制支出形成财政盈余；选择注明偿债、减记或追回资金的措施。一次性遗产税特别征收完成时清偿当时现存公债的50%。\nGDP增长也能降低债务比例，但不代表同额债务已经偿还。','Generate a fiscal surplus through revenue or spending measures, or choose debt repayments, write-downs and recoveries. Completing the one-off inheritance levy repays 50% of the debt outstanding at completion.\nGDP growth can lower the ratio without repaying the same amount of debt.'],
  thresholds:['债务/GDP超过65%开始压低经济模型中的信心目标；超过70%增加执政财政压力；超过90%出现提醒；达到100%可触发经济危机，超过100%还会提高国债风险溢价。\n经济危机解除须债务/GDP低于60%，且通胀低于20%。\n债务/GDP超过190%，同时信心低于25，会失去可持续融资渠道并结束游戏；管理员模式除外。','Debt-to-GDP above 65% lowers the model’s confidence target; above 70% adds governing fiscal pressure; above 90% produces an alert; reaching 100% can trigger an economic crisis, and exceeding 100% adds a bond-risk premium.\nEconomic-crisis recovery requires debt-to-GDP below 60% and inflation below 20%.\nDebt-to-GDP above 190% together with confidence below 25 ends the game through loss of sustainable financing, except in Administrator Mode.'],
  notes:['公债金额与债务/GDP是两个不同量。公债减少10%表示现存债务乘0.9，不是把债务/GDP直接减10个百分点；金额和比例需结合GDP判断。','The debt stock and debt-to-GDP ratio are different quantities. A 10% reduction in outstanding debt multiplies the stock by 0.9; it does not directly subtract 10 percentage points from debt-to-GDP.']
 },
 confidence:{
  increase:['控制公债和赤字，维持较稳定的融资条件；开启债务刹车会使基础信心目标增加4点。司法公开意见、国际合作、投资改革和部分部长措施可直接提高信心，具体看各选项效果。','Control debt and deficits and maintain stable financing. Enabling the debt brake adds 4 points to the base confidence target. Public legal opinions, international cooperation, investment reforms and some departmental actions can also raise confidence directly.'],
  decrease:['债务/GDP超过65%和赤字超过3% GDP会压低基础信心目标；财政压力还会追加损耗。经济危机、罢工、丑闻、叛乱、债务重组和部分管制措施也会损害信心。','Debt-to-GDP above 65% and deficits above 3% of GDP lower the base confidence target; governing fiscal pressure adds further losses. Economic crises, strikes, scandals, rebellions, debt restructuring and some controls also damage confidence.'],
  thresholds:['信心低于25且债务/GDP超过190%时，会触发融资失败结局。单独低于25并不立即结束游戏。\n信心越低，国债风险溢价越高、信用评级越差；高信心则有利增长与融资。','Confidence below 25 together with debt-to-GDP above 190% triggers financing failure. Confidence below 25 alone does not immediately end the game.\nLower confidence raises bond-risk premiums and worsens credit ratings; higher confidence supports growth and financing.'],
  notes:['范围0—100。经济结算会逐步向目标靠近，季度公式为旧信心×85%＋目标×15%，事件和局势损耗另计。\n信心每比65高1点，增长目标增加0.015点；低于65则反向。','Range: 0–100. Economic settlement moves confidence gradually toward its target: 85% of the previous value plus 15% of the target, before other event and situation effects.\nEach confidence point above 65 adds 0.015 points to the growth target; points below 65 subtract the same amount.']
 },
 rate:{
  increase:['通胀上升，或实际增长高于潜在增长时，央行的目标利率通常提高；央行逐季调整，玩家不能直接设置政策利率。','Higher inflation or actual growth above potential usually raises the central bank’s target rate. Adjustment is gradual; you cannot set the policy rate directly.'],
  decrease:['缓解通胀、降低过热需求，会减轻加息压力；增长低于潜在水平时也可能促使央行降息。不存在由玩家直接执行的降息按钮。','Easing inflation and excessive demand reduces tightening pressure. Growth below potential can also prompt lower rates. There is no player-operated rate-cut button.'],
  thresholds:['没有单独的利率危机或失败门槛。较高实际利率会拖累增长并抑制通胀，较低实际利率则支持需求，也可能放大物价压力。政策利率上升还会传入国债收益率和利息支出。','There is no standalone interest-rate crisis or defeat threshold. Higher real rates restrain growth and inflation; lower real rates support demand but can increase price pressure. Higher policy rates also feed into bond yields and interest costs.'],
  notes:['央行反应目标＝0.75＋1.1×通胀＋0.3×（实际增长−潜在增长）。每季度采用旧利率的75%与目标的25%，政策利率限制在0%—80%。\n增长与物价还参考“政策利率−通胀−1”的实际货币条件。档案中的央行报告记录历季调整与本季建议。','The central-bank target is 0.75 + 1.1 × inflation + 0.3 × (actual growth − potential growth). Each quarter combines 75% of the old rate with 25% of the target, bounded to 0–80%.\nGrowth and prices also respond to policy rate − inflation − 1. The Archive’s central-bank reports record past adjustments and current advice.']
 },
 yield:{
  increase:['政策利率上升、信心下降或债务/GDP超过100%，都会增加国债收益率的计算值。','Higher policy rates, lower confidence or debt-to-GDP above 100% raise the calculated bond yield.'],
  decrease:['改善信心、控制债务比例，能够压低风险溢价；央行降息也会降低基础融资成本。不能在预算中直接指定国债收益率。','Improve confidence and control the debt ratio to reduce risk premiums. Central-bank easing also lowers the base financing cost. Bond yields cannot be set directly in the budget.'],
  thresholds:['债务/GDP超过100%后，每再增加1个百分点，会额外增加0.03个百分点的收益率风险溢价。没有仅由收益率数值触发的失败门槛，但高利率会推高财政利息与赤字。','Above 100% debt-to-GDP, each additional percentage point adds 0.03 percentage points to the yield premium. Yield alone has no defeat threshold, but higher borrowing costs increase interest expenditure and deficits.'],
  notes:['收益率＝政策利率＋信心风险溢价＋高债务溢价。信心溢价为（100−信心）×0.06，最低0.3个百分点；最终收益率限制在0.4%—100%。','Yield = policy rate + confidence premium + high-debt premium. The confidence premium is (100 − confidence) × 0.06, with a minimum of 0.3 percentage points. Final yields are bounded to 0.4–100%.']
 },
 rating:{
  increase:['降低债务/GDP或提高投资者信心，使风险分数下降，即可改善评级。','Reduce debt-to-GDP or raise investor confidence to lower the risk score and improve the rating.'],
  decrease:['提高债务比例或损害信心，会增加风险分数，导致评级下调。','Higher debt ratios or weaker confidence raise the risk score and worsen the rating.'],
  thresholds:['风险分数＝债务/GDP百分数＋（70−信心）×0.7。\n低于45：AAA；45至不足65：AA；65至不足85：A；85至不足105：BBB；105至不足135：BB；135至不足170：B；达到170：CCC。\n评级本身不会额外触发失败；融资失败仍看债务与信心的实际门槛。','Risk score = debt-to-GDP percentage + (70 − confidence) × 0.7.\nBelow 45: AAA; 45 to below 65: AA; 65 to below 85: A; 85 to below 105: BBB; 105 to below 135: BB; 135 to below 170: B; 170 or more: CCC.\nThe rating itself adds no defeat trigger; financing failure uses the underlying debt and confidence thresholds.'],
  notes:['评级是风险的分档展示，并不是额外一次随机掷骰，也不会在已经计算的信心和债务风险上再加一层利率惩罚。','The rating displays a risk band. It is not another random roll and does not add a second interest penalty on top of the debt and confidence calculations.']
 },
 revenue:{
  increase:['通过预算提高税率，会按各自税基提高收入占GDP的比例。所得税每加1点增加0.48% GDP收入，企业税为0.19%，消费税0.62%，财产税0.2%，关税0.2%；神权政体宗教税为0.4%。','A passed tax increase raises revenue as a share of GDP according to its tax base. Each rate point adds 0.48% of GDP for income tax, 0.19% for corporate tax, 0.62% for consumption tax, 0.2% for property tax, 0.2% for tariffs, or 0.4% for a theocratic religious levy.'],
  decrease:['降低税率会相应减少收入比例。GDP下降会减少同一收入比例对应的货币金额。','Lower tax rates reduce the revenue share. Falling GDP reduces the cash amount represented by an unchanged revenue share.'],
  thresholds:['没有固定收入失败门槛。收入低于公共支出与利息之和时形成赤字，高于二者之和则形成盈余。高税收还会影响经济与预算表决支持，不能只看收入增加。','There is no fixed revenue defeat threshold. Revenue below spending plus interest produces a deficit; revenue above them produces a surplus. Higher taxes also affect the economy and legislative support.'],
  notes:['五种基础税按各自税基折算，再加其他收入1%；符合政体条件时另计宗教税。界面收入是年化占GDP比例，不等于各项税率直接相加。','Five ordinary taxes are weighted by their tax bases, plus 1% of GDP in other revenue and any applicable religious levy. Displayed revenue is an annualized GDP share, not the simple sum of tax rates.']
 },
 spending:{
  increase:['在预算中提高教育科研、医疗、社会保障、基础设施或行政安全投入，法案生效后持续支出增加。相应服务、科研、资本或稳定收益通常需要时间传导。','Increase education and research, healthcare, social protection, infrastructure or security budgets. Recurring expenditure rises after enactment; service, research, capital and stability benefits may take time.'],
  decrease:['降低各项公共预算会减少持续支出。开启债务刹车且赤字超过3% GDP时，每季度按下限规则削减基础设施与社会保障各0.5个百分点。','Cut public-budget allocations to reduce recurring spending. With the debt brake enabled and a deficit above 3% of GDP, infrastructure and welfare are each cut by 0.5 percentage points per quarter, subject to their minimums.'],
  thresholds:['公共支出没有统一的失败门槛，但与利息合计超过财政收入就会产生赤字。过度削减教育、基建或民生投入，会损害长期发展、就业与支持；超过收入能力的扩张会增加债务和融资风险。','Public spending has no single defeat threshold, but spending plus interest above revenue causes a deficit. Excessive cuts harm development, employment and approval, while unaffordable expansion raises debt and financing risk.'],
  notes:['公共支出为五项公共预算之和，另加固定行政3% GDP；利息单独计算。事件、提案和改革的一次性GDP支出另计债务，不包含在持续预算合计中。','Recurring public spending is the sum of five public allocations plus a fixed 3% of GDP administration cost. Interest is separate. One-off event, proposal and reform costs add to debt outside this recurring total.']
 },
 balance:{
  increase:['增加财政收入、降低持续公共支出、降低债务或融资利率，都可改善财政余额。需在财政改善与经济、民意、地方诉求之间权衡。','Higher revenue, lower recurring spending, lower debt or cheaper financing improve the fiscal balance. Weigh the improvement against economic, approval and regional-demand effects.'],
  decrease:['降税、扩张公共预算或利息负担增加会降低余额。一次性支出通常直接增加公债，随后通过利息影响持续财政余额。','Tax cuts, larger public budgets and higher interest costs worsen the balance. One-off costs usually add directly to debt and subsequently affect the recurring balance through interest.'],
  thresholds:['大于0为盈余，低于0为赤字。赤字超过3% GDP会压低信心目标，并在开启债务刹车时触发预算削减；赤字超过4% GDP还会追加执政财政压力。\n没有由赤字单独决定的立即失败门槛，但长期赤字会累积公债。','Above 0 is a surplus; below 0 is a deficit. A deficit above 3% of GDP lowers the confidence target and activates cuts if the debt brake is enabled. Above 4% adds governing fiscal pressure.\nDeficit alone does not immediately end the game, but repeated deficits accumulate debt.'],
  notes:['财政余额＝财政收入−公共支出−利息支出，单位为年化% GDP。每年六季度，基础季度新增债务＝GDP×赤字百分数÷600；盈余反向偿债，债务最低为0。','Fiscal balance = revenue − public spending − interest, expressed as annualized % of GDP. With six quarters per year, base quarterly debt change is GDP × deficit percentage ÷ 600. Surpluses repay debt, down to a minimum of zero.']
 },
 interest:{
  increase:['债务比例提高，或国债收益率上升，会增加利息支出占GDP的比例。','Higher debt-to-GDP or higher bond yields increase interest spending as a share of GDP.'],
  decrease:['偿还公债、提高GDP以降低债务比例、改善信心并降低风险溢价，可减轻利息负担。央行降息也可能降低国债收益率。','Repay debt, grow GDP to reduce the debt ratio, or improve confidence to reduce risk premiums. Central-bank easing may also lower bond yields.'],
  thresholds:['没有单独的利息失败门槛。利息会占用财政空间，使原本收支平衡的公共预算变成赤字；公债为0时，此项支出为0。','There is no independent interest-cost defeat threshold. Interest consumes fiscal space and may turn an otherwise balanced budget into a deficit. With zero debt, interest expenditure is zero.'],
  notes:['利息支出/GDP＝债务/GDP的小数值×债券收益率百分数。例如债务为GDP的70%、收益率5%，年化利息为3.5% GDP。','Interest as % of GDP = debt/GDP as a decimal × bond yield as a percentage. Debt of 70% of GDP at a 5% yield therefore costs 3.5% of GDP per year.']
 },
 capital:{
  increase:['实际执行的基础设施预算高于3.5% GDP时，基础设施存量逐季增加。公共工程、重建、部分改革和环境部门施政也可直接增加基础设施。','Effective infrastructure spending above 3.5% of GDP grows the infrastructure stock over time. Public works, reconstruction, some reforms and environmental-department actions can also add directly to it.'],
  decrease:['实际执行的基础设施预算低于3.5% GDP时，存量逐季下降。灾害、推迟维护和某些负面选择会造成额外损失。','Effective infrastructure spending below 3.5% of GDP reduces the stock over time. Disasters, deferred maintenance and some adverse choices cause additional losses.'],
  thresholds:['3.5%是基础设施预算的基础维护分界，恰好3.5%时这项积累项为0。基础设施指数没有独立失败门槛；较高指数提高潜在增长，较低指数削弱长期生产能力。','3.5% is the infrastructure-spending maintenance baseline; exactly 3.5% produces zero change from this accumulation term. The stock has no independent defeat threshold; higher stock raises potential growth.'],
  notes:['基础季度变化＝（实际执行基建预算−3.5）×0.22。预算投入、国家基础设施存量与单个地区发展是不同指标，不能互相替代。','Base quarterly change = (effective infrastructure budget − 3.5) × 0.22. Budget spending, the national infrastructure stock and an individual region’s development are distinct indicators.']
 },
 human:{
  increase:['实际执行教育预算高于4.5% GDP时，人力资本逐季积累。教育部门任务、教育科研承诺兑现与部分改革也会提高人力资本。','Effective education spending above 4.5% of GDP accumulates human capital. Education-department tasks, fulfilled education pledges and some reforms also improve it.'],
  decrease:['实际执行教育预算低于4.5% GDP时，人力资本逐季回落；会直接扣减人力资本的事件另行计算。','Effective education spending below 4.5% of GDP gradually reduces human capital; events with direct losses apply separately.'],
  thresholds:['4.5%是基础积累分界。人力资本没有单独危机或失败门槛；每增加1点，潜在增长提高0.025个百分点。人力资本达到100不会直接增加行动点，行动点由科研等级决定。','4.5% is the accumulation baseline. Human capital has no separate crisis or defeat threshold; each point adds 0.025 percentage points to potential growth. Reaching 100 does not grant action points: research level determines those benefits.'],
  notes:['基础季度变化＝（实际执行教育预算−4.5）×0.12。人力资本、科研等级与科研进度分别计算。','Base quarterly change = (effective education budget − 4.5) × 0.12. Human capital, research level and research progress are tracked separately.']
 },
 research:{
  increase:['提高已通过预算中的教育与科研投入。通常每季度增加“教育预算百分数×2”的研究进度；教育部门提案完成后改为×3，例如8%预算对应每季度16%或24%进度。','Raise education-and-research spending in the enacted budget. Research normally gains the budget percentage × 2 progress per quarter; after completion of the education programme, the multiplier becomes 3. An 8% budget therefore gives 16% or 24% progress.'],
  decrease:['削减教育预算会降低今后的进度增长速度，不会撤回已经取得的科研等级。进度跨过100%时扣除100并升级，看起来下降属于结算，溢出进度保留。','Cutting education spending slows future research; it does not remove earned levels. On reaching 100%, progress is reduced by 100 and a level is awarded. This apparent decrease is settlement, and excess progress is retained.'],
  thresholds:['每达到100%进度增加1级。固定行动点模式最多提高到每季6点；随机模式提高最低点数直到固定6点；伪随机模式每级加1点，没有6点总额上限。\n低科研不会直接引发危机或失败，但会限制每季可采取的政治行动。','Every 100% progress grants one level. Fixed allocations rise to at most 6 per quarter; Random raises the minimum until it is always 6; Planned adds 1 per level with no six-point total cap.\nLow research does not directly trigger crisis or defeat, but limits political action capacity.'],
  notes:['科研以已通过的当前预算计算，不等待经济模型的35%政策滞后；在新季度行动点发放前结算。查阅或刷新界面不会重复升级或发点。','Research uses the current enacted budget without waiting for the economic model’s 35% policy lag. It is processed before the quarter’s action-point grant. Reading or refreshing the interface does not duplicate levels or points.']
 }
};
Object.assign(GUIDE_METRICS,{
 judicial:{
  increase:['请求公开法律意见可提高司法独立2点并增加信心1点；保障司法预算与任期需支出0.2% GDP，可提高5点，均消耗1行动点。任命法治倾向的政府首脑、司法主管，或选择保护司法的事件也能改善独立性。','Requesting a public legal opinion adds 2 judicial independence and 1 confidence; protecting judicial funding and tenure costs 0.2% of GDP and adds 5 independence. Each costs 1 action point. Rule-of-law appointments and protective event choices can also help.'],
  decrease:['要求司法机关配合行政议程会降低6点独立性；强硬集权倾向官员施政、司法压力与部分强制措施也会降低独立性。最高司法权移交议事机关的修宪生效时降低20点。','Demanding judicial cooperation with the executive reduces independence by 6. Centralizing officials, judicial pressure and some coercive measures also reduce it. An amendment transferring supreme judicial authority to the legislature reduces it by 20 on enactment.'],
  thresholds:['低于35：每季度支持−2、稳定−2；低于20时改为各−3，不与前一档重复。达到20或更低可触发司法公平事件；该局势需独立性超过40才结束，恰好40不足。\n达到70时增加连续高位季度；连续四季度高位后，原有司法互动概率从通常12%、高位25%提高至45%。独立性过低本身不立即结束游戏，但会通过民意与稳定造成危险。','Below 35: −2 approval and −2 stability per quarter. Below 20 this becomes −3 each, replacing the previous tier. At 20 or lower a judicial-fairness movement can start; recovery requires independence above 40, not exactly 40.\nAt least 70 builds the high-independence streak. Four consecutive high quarters raise the base judicial-interaction chance from the usual 12%, or 25% at high independence, to 45%. Low independence is not an immediate defeat by itself, but threatens approval and stability.'],
  notes:['军政府期间司法独立不适用，界面显示“−”，不触发司法公平事件；法官互动与宪制审查仍存在。其他政体的法官投票还取决于法官倾向和本案意愿，独立性高不等于一定支持政府议案。','Under Military Government this metric is inapplicable, displayed as “−”, and judicial-fairness movements do not trigger. Judicial interactions and constitutional review remain. Elsewhere, judges’ votes also depend on outlook and willingness for the case; independence does not guarantee support for government proposals.']
 },
 development:{
  increase:['推进符合当地产业与民生需要的政策、部长任务和结构性改革；完成救灾重建可恢复受灾地区发展。具体措施是否提高发展指数，以选项注明的地区效果为准。','Advance policies, departmental tasks and reforms suited to local industry and social needs. Completed disaster reconstruction restores regional development. Check each option for its regional effects.'],
  decrease:['灾害、破坏设施、放弃维护及会损害当地发展的事件，会降低地区发展。全国经济表现与地区发展指数不是同一数值。','Disasters, damaged facilities, deferred maintenance and adverse regional events can reduce development. National economic performance and regional development are separate indicators.'],
  thresholds:['范围0—100，50为地区支持计算的中性点；低于50产生负修正，高于50产生正修正。发展对支持率的修正最多为正负7%，不是直接增加或减少7个百分点。没有单一发展指数失败门槛。','Range: 0–100, with 50 neutral in regional-support calculation. Below 50 gives a negative modifier and above 50 a positive one. The modifier is capped at ±7% of the baseline, not a direct ±7 percentage points. There is no standalone defeat threshold.'],
  notes:['地区发展修正＝（发展指数−50）÷500，并限制在−0.07至0.07。它与诉求履约、历史政策、开局和季度民意修正共同形成地区支持率。','The development modifier is (development − 50) ÷ 500, bounded to −0.07 to 0.07. It combines with demand fulfilment, past policy, starting support and quarterly sentiment.']
 },
 'local-demands':{
  increase:['选择与当地需要相符的事件、预算、改革和部长措施。一般相关决策、预算与部长行动推进速度不同；以各选项显示的履约进度为准，完成并不要求把所有预算都提高。','Choose events, budgets, reforms and departmental measures that match local needs. Their progress contributions differ; consult the stated fulfilment effects. Completion does not require increasing every budget.'],
  decrease:['每12季度进入新一轮地方诉求，新的诉求从头计算；过去的完成记录会保留，但不会自动算作新要求已经完成。拖延虽不一定直接扣进度，却会持续损害支持和稳定。','Every 12 quarters a new demand cycle begins. Previous completion records remain, but do not automatically fulfil new demands. Delay may not directly subtract progress, yet it harms support and stability.'],
  thresholds:['达到100%完成本轮要求，不再继续出现同一项未完成诉求事件。完全未履约时，地区基准支持最多扣减20%；超额履约最多额外增加8%基准修正。\n进入诉求第六季度后，未履约开始追加执政压力；灾区可暂缓原诉求惩罚。稳定连续两季度低于35且至少三地未履约时，还会满足叛乱的常规触发条件之一。','100% fulfils the current demand, preventing repeated requests for that same unfinished demand. Completely unmet demands can reduce baseline regional support by 20%; overdelivery adds at most an 8% baseline bonus.\nFrom the sixth quarter of a cycle, unmet demands add governing pressure; affected disaster regions can be exempted. At least three unmet regions, together with two quarters of stability below 35, also satisfy the ordinary rebellion trigger conditions.'],
  notes:['履约进度主要影响地区支持；事件选项另外写出的全国支持、稳定或财政变化会单独结算。','Fulfilment primarily affects regional support. Any separately stated national approval, stability or fiscal changes apply in addition.']
 },
 pressure:{
  increase:['地方诉求长期未回应、公债比例过高或赤字过大，会增加季度执政压力。这里的“提高”通常是不利变化。','Long-unmet regional demands, excessive debt or large deficits increase quarterly governing pressure. An increase in this metric is usually harmful.'],
  decrease:['完成地方诉求、将债务/GDP压回70%以内、将赤字控制在4% GDP以内，可消除对应追加压力。基本执政损耗仍然存在。','Fulfil regional demands, reduce debt-to-GDP to at most 70%, and keep the deficit at no more than 4% of GDP to remove the corresponding additional pressures. Base governing losses remain.'],
  thresholds:['基础每季支持−0.6、稳定−0.2。地方诉求进入第六季度后，未履约追加损耗。债务/GDP超过70%或赤字超过4% GDP产生财政压力，进一步损害支持、稳定与信心。没有单独“压力达到多少即失败”的判定。','The base quarterly loss is −0.6 approval and −0.2 stability. Unmet demands add losses from the sixth quarter of their cycle. Debt-to-GDP above 70% or a deficit above 4% of GDP adds fiscal pressure on approval, stability and confidence. There is no separate pressure-based defeat threshold.'],
  notes:['执政压力与随机地区支持衰退、危机损耗分别计算。暂停地区衰退的局势，不代表所有来源的执政压力也都暂停。','Governing pressure, random regional support decay and crisis losses are separate systems. A situation that pauses regional decay does not necessarily pause other governing losses.']
 },
 'faction-relation':{
  increase:['通过协商、兑现承诺、符合该派系偏好的政策、人事安排和事件回应来改善关系。组建联盟前也可先会见该党代表。','Improve relations through negotiation, kept promises, policies suited to the faction, appointments and event responses. You can meet its representative before inviting it into a coalition.'],
  decrease:['违背承诺、反对其关键要求、撤换相关官员或选择损害其利益的政策，可能降低团体关系。议程倾向每季损耗与团体关系下降不是同一机制。','Broken promises, rejected demands, related dismissals or policies harming the faction can lower relations. Quarterly agenda decay is separate from group relations.'],
  thresholds:['范围0—100。符合组阁条件的政体中，关系达到70后可邀请该党加入联合政府。政治盟友关系低于50会引发政府危机；修复原盟友关系需达到危机规则要求的60以上，并保持足够联盟席位。\n政府危机的期限与后果随政体变化，详情见该局势。','Range: 0–100. In systems that allow coalitions, a relation of at least 70 unlocks a coalition invitation. An ally below 50 can trigger a government crisis. Repairing the original alliance requires the crisis rule’s relationship threshold above 60 and sufficient coalition seats.\nThe deadline and consequences of government crisis depend on the system; consult that situation.'],
  notes:['关系只是议程倾向的一个来源，关系高不代表每项预算都能通过；税收和公共预算偏好仍会改变本案门槛。','Relations are one source of agenda willingness. Good relations do not guarantee passage of every budget; tax and spending preferences still change each bill’s threshold.']
 },
 'member-relation':{
  increase:['会见议长、秘书长和各团体代表，回应其要求；选择提高个人关系的协商和事件选项。','Meet speakers, secretaries and group representatives, respond to their requests, and choose interactions or events with personal-relation gains.'],
  decrease:['拒绝或违背其要求、政治交换失信及相关负面事件，可能降低个人关系。','Rejected demands, broken political bargains and adverse events may reduce personal relations.'],
  thresholds:['没有统一的个人关系失败门槛。下院主要成员关系通过所属派系成员的平均关系影响议程倾向；军委会委员的本案意愿和上院临时协商有各自规则。','There is no universal personal-relation defeat threshold. Lower-house leaders’ average relations influence faction willingness. Military committee votes and upper-house temporary negotiations follow their own rules.'],
  notes:['个人关系不等于团体关系，也不等于内阁忠诚。某人兼任政府职务时，机构会见与内阁互动仍可分别计算。','Personal relations, group relations and cabinet loyalty are distinct. When someone also holds a government office, institutional and cabinet interactions can be calculated separately.']
 },
 agenda:{
  increase:['改善团体与主要成员关系，履行协商承诺，提出符合派系偏好的议案；协商可给予临时支持，并抵消部分已积累的季度损耗。','Improve group and leader relations, fulfil bargains and propose bills matching faction preferences. Negotiations can add temporary support and offset some accumulated quarterly decay.'],
  decrease:['非玩家派系每季度议程倾向衰减2点；失信、关系恶化、司法争议或家族离心也可能压低倾向。临时支持到期会消失。','Non-player factions lose 2 agenda points per quarter. Broken promises, weaker relations, judicial disputes or alienated noble families can also lower willingness. Temporary support expires.'],
  thresholds:['普通团体按本案折算倾向计算：50对应0%支持，51对应10%，60对应100%，中间线性变化并限制在0%—100%。\n下院折算倾向低于50时，法案通过后每低1点额外稳定−0.1，各团体累加；上院不适用这一惩罚。军委会则按每位委员本案意愿达到60投赞成票。','Ordinary groups use effective willingness: 50 means 0% support, 51 means 10%, and 60 means 100%, linearly scaled and bounded to 0–100%.\nA lower-house group below 50 costs 0.1 stability per missing point after passage, summed across groups. The upper house does not apply this penalty. Military committee members instead vote yes when their case willingness reaches 60.'],
  notes:['原始议程倾向还要扣除本案全票门槛相对60的偏移。因此同一派系在加税与减税方案中，院内支持贡献可以不同。','Raw agenda willingness is adjusted by the bill’s full-support threshold relative to 60. The same faction can therefore contribute different support to a tax rise and a tax cut.']
 },
 'pass-rate':{
  increase:['争取占比更大的党派或派系，改善其议程倾向；调整预算以满足其税收、公共服务偏好。上院可与代表或议长协商本案修订，获得仅限本案的临时支持。','Win over larger parties or factions, improve their willingness and adjust budgets to their tax and service preferences. Upper-house representatives or the speaker can negotiate bill-specific amendments and temporary support.'],
  decrease:['临时支持到期、关系恶化、议程衰减或议案与派系偏好冲突都会降低支持。换届重新分配席位后，即使同样的倾向也可能产生不同的总支持率。','Expired bargains, weaker relations, agenda decay or mismatches between a bill and faction preferences reduce support. Seat redistribution can change total support even when willingness is unchanged.'],
  thresholds:['设有上院时，普通预算与改革在两院均须超过50%；无上院的一般预算与改革须达到51%，军委会与联邦的特别程序须超过50%。释宪须超过50%。修宪通常需要下院三分之二，再经适用的上院复审和司法审查。联邦制度另有全国支持率或加权支持率条件；军委会按人数逐票计算。\n未通过不会实现政策；退回、复议、延迟和流案规则随政体与议案类型不同。完整门槛见下方本局规则。','Bicameral budgets and reforms require more than 50% in each chamber. Ordinary unicameral budgets and reforms require at least 51%; special military and federal procedures require more than 50%. Interpretations require more than 50%. Amendments normally need two thirds in the lower house, followed by any upper-house and judicial review. Federal rules add national-approval or weighted-support requirements; the military committee counts individual votes.\nRejection does not enact policy. Return, reconsideration, delay and lapse rules depend on system and bill type. See the current-system reference below.'],
  notes:['这是实际支持比例，不是随机通过的概率。普通议院按席位权重汇总，各院单独计算；全国支持率不能替代院内支持率。','This is a support share, not a random chance of passage. Ordinary chambers aggregate seat-weighted support separately. National approval does not substitute for chamber support.']
 },
 loyalty:{
  increase:['推进部长提案选项通常可使对应官员忠诚提高1—3点；满足部门需求、维持内阁承诺和部分事件也有帮助。联邦委员可通过施政协商提高合作意愿。','Departmental actions usually add 1–3 loyalty to their minister. Meeting departmental needs, keeping cabinet commitments and some events also help. Federal commissioners can be persuaded through policy-coordination meetings.'],
  decrease:['未完成部门提案通常每季忠诚−0.5；拒绝部长要求、涉案调查及部分司法或政治选择可能造成额外下降。联邦委员不承担未完成提案的季度忠诚损耗。','Unfinished programmes normally cost 0.5 loyalty per quarter. Rejected demands, investigations and some judicial or political choices can cause additional losses. Federal commissioners are exempt from the unfinished-programme decay.'],
  thresholds:['范围0—100。部分人事事件处理后，仍在任且忠诚低于30的官员会主动辞职；不是所有低于30的数值变化都会立即触发辞职。\n联邦委员会制：达到70解锁玩家协助推进提案和调整任务方向，低于70重新锁定。','Range: 0–100. After certain personnel events, an incumbent below 30 resigns; not every change below 30 triggers an immediate resignation.\nFederal Council: at least 70 unlocks player-directed programme actions and task directions; falling below 70 locks them again.'],
  notes:['高忠诚提高自主任务的执行强度和成功概率；它与人物能力、所属党派关系及机构成员关系分别计算。','Higher loyalty improves autonomous task strength and success probability. It is separate from skill, party relations and institutional personal relations.']
 },
 skill:{
  increase:['常规玩法没有通用的“训练加能力”按钮。能力主要在人物生成时确定；可通过任命更高能力的候选人，提高该岗位的执行能力。','Ordinary play has no universal skill-training button. Skill is primarily determined when a character is generated; appointing a more skilled candidate improves the office’s capability.'],
  decrease:['任命能力较低者会降低该岗位的能力水平；忠诚下降或任务受阻并不等同于人物能力值下降。','Appointing a less skilled candidate lowers the office’s capability. Falling loyalty or a blocked task is not the same as losing skill points.'],
  thresholds:['没有能力低于某值就结束游戏的门槛。能力越高，自主任务成功率与执行强度通常越高；部长提案能力系数＝0.75＋能力÷200。','There is no skill-based defeat threshold. Higher skill generally improves autonomous task success and strength. A programme’s skill multiplier is 0.75 + skill ÷ 200.'],
  notes:['提案进度还受人物倾向与提案契合度加权；费用折扣主要由公共投资决定。高能力不等于零费用或必然成功。','Programme progress is also weighted by outlook compatibility. Cost discounts mainly depend on public investment. High skill does not mean zero cost or guaranteed success.']
 },
 achievements:{
  increase:['官员自主任务成功，以及完成部门提案，可以积累政绩。季度施政报告会记录任务成果。','Successful autonomous tasks and completed departmental programmes accumulate achievements. Quarterly reports record these results.'],
  decrease:['任务执行受阻或失败可能削减累计政绩；更换官员后，新任者使用自己的政绩记录，不继承前任的人物政绩。','Blocked or failed tasks may reduce accumulated achievements. A new appointee uses their own achievement record rather than inheriting the predecessor’s personal score.'],
  thresholds:['没有统一的政绩失败门槛。撤换政绩较高的官员通常会产生更明显的民意或稳定代价，具体后果还取决于职位和政体。','There is no universal achievement defeat threshold. Dismissing a more accomplished official usually carries larger approval or stability costs, also depending on office and government system.'],
  notes:['人物政绩与部门项目进度不同。换人并不会把部门已经完成的项目奖励再发一遍。','Personal achievements differ from departmental programme progress. Replacing a minister does not award completed programme benefits again.']
 },
 'clergy-loyalty':{
  increase:['当前普通玩法没有通用的直接恢复神职人员忠诚度按钮。通过协商与预算让步，提高各神职团体的本案倾向至60或以上，可以避免后续扣减；这不会返还已经失去的忠诚度。','Ordinary play currently has no universal action that directly restores clerical loyalty. Negotiations and budget concessions can lift each clerical group’s willingness to at least 60, preventing future losses without refunding past losses.'],
  decrease:['法案通过时，参与计算的神职团体每比60少1点本案倾向，忠诚度就扣1点，多个团体累加。预算使用折算倾向，上院包括本案协商加成；流案或撤回不扣减。','On passage, each relevant clerical group deducts one loyalty point for every point its case willingness falls below 60, summed across groups. Budgets use effective willingness and the upper house includes negotiated bonuses. Rejected or withdrawn bills do not deduct loyalty.'],
  thresholds:['初始100%。低于40：每季全国支持率−1，并出现提醒；低于20：每季全国支持率−1、稳定−2，取代前档。\n归零：神权专制结束统治；神权共和制触发神职叛乱，平息后转为象征性民主制。管理员模式不因失败判定结束。','Starts at 100%. Below 40: −1 national approval per quarter and an alert. Below 20: −1 approval and −2 stability, replacing the earlier tier.\nAt zero, Theocratic Absolutism ends in defeat; a Theocratic Republic faces a clerical rebellion and becomes Nominal Democracy after it is resolved. Administrator Mode prevents defeat endings.'],
  notes:['神权共和制的议会换届中，忠诚度还会小幅修正执政阵营结果：50为中性，最低−2、最高＋2个百分点。此项与内阁中神职官员的个人忠诚分开计算。','In a Theocratic Republic’s legislative election, loyalty also adjusts the governing camp’s result: neutral at 50, bounded to −2 to +2 percentage points. This is separate from a clerical cabinet official’s personal loyalty.']
 },
 'family-recognition':{
  increase:['分化继承人集团可提高10点承认、稳定−3；同家族结盟可提高25点承认、中央集权−10。满足家族要求或利用已掌握情报进行要挟，也能提高承认。','Splitting an heir group adds 10 recognition at a cost of 3 stability; allying adds 25 at a cost of 10 central authority. Meeting family demands or leveraging acquired intelligence can also improve recognition.'],
  decrease:['拒绝家族要求、通过损害其势力的改革或公开调查夺取其产业，会降低承认。','Rejecting family demands, enacting reforms against its interests or publicly investigating and seizing its powers lowers recognition.'],
  thresholds:['玩家家族固定100。其他活跃家族低于80时，关联派系议程倾向每低1点扣0.25；达到40或更低时，每家每季全国支持−0.5、稳定−1；低于20时封锁枢密院表决。\n三个仍有势力的家族承认归零会结束统治。恢复至20解除对应封锁，高于40解除对应季度损耗。','Your own family remains at 100. For other active families, each point below 80 reduces linked faction willingness by 0.25. At 40 or below, each family costs 0.5 approval and 1 stability per quarter; below 20, it blocks council votes.\nThree families with remaining powers at zero recognition end your rule. Reaching 20 removes the corresponding voting block; exceeding 40 removes its quarterly penalty.'],
  notes:['家族失去全部势力后停止参与承认惩罚，也不能继续互动。完成贵族强人路线后，中央集权与家族承认的相关结算停止。','A family without any powers stops contributing recognition penalties and becomes unavailable for interaction. Completing the aristocratic strongman route ends the associated central-authority and recognition calculations.']
 },
 'central-authority':{
  increase:['玩家家族每项势力贡献5点；夺取其他家族势力可以加强中央权力。指定司法、公民权利与社会多元修宪生效各加10；国家导向型改革完成可各加5，具体名单见完整说明。','Each power held by your family contributes 5 points; acquiring other families’ powers strengthens the centre. Specified judicial, civil-rights and pluralism amendments add 10 on enactment; eligible state-directed reforms add 5 on completion. See the full reference for the list.'],
  decrease:['同其他家族结盟会降低10点中央集权，接受部分让渡权力的家族要求也会降低。','Allying with another family reduces central authority by 10; accepting some demands that concede power also reduces it.'],
  thresholds:['达到100触发“重新决定国家未来”。可保留贵族制并终止家族承认与集权计算，或转为君主专制、君主立宪制，选择不消耗行动点。低集权本身没有直接失败门槛。','At 100, “Decide the Nation’s Future” begins. You may retain Aristocratic Rule and end recognition/centralization calculations, or become an Absolute or Constitutional Monarchy. These choices cost no action points. Low authority alone does not cause defeat.'],
  notes:['仅贵族制家族政治适用。中央集权不等于政治稳定，也不能直接替代其他家族的合法性承认。','Applies to aristocratic family politics. Central authority is not stability and does not directly substitute for other families’ legitimacy recognition.']
 },
 'military-backing':{
  increase:['军政派系沟通、委员项目、军政事件与特定改革可以提高拥护。行政安全预算达到5%时，每季度额外＋0.5；军政化达到70时也有每季＋0.5，但同时损害民意。','Faction talks, committee projects, military events and eligible reforms can raise backing. Security spending of at least 5% adds 0.5 per quarter. Militarization of at least 70 also adds 0.5, but harms public approval.'],
  decrease:['违背军方要求或选择削减其权限的方案会降低拥护。行政安全预算低于3%时每季−1；军政化低于40时每季−1。','Defying military demands or curtailing military privileges can reduce backing. Security spending below 3% costs 1 per quarter; militarization below 40 also costs 1.'],
  thresholds:['低于40：每季稳定−1并出现提醒；低于20：每季稳定−3、全国支持−1，替代前档；归零时委员会罢免主席，普通模式下游戏结束。','Below 40: −1 stability per quarter and an alert. Below 20: −3 stability and −1 national approval, replacing the earlier tier. At zero, the committee removes its chair and ordinary play ends.'],
  notes:['范围0—100，开局75—85。它是军方整体对统治的拥护，与单个委员的本案意愿不同；转型后停止军政专属结算。','Range: 0–100, starting at 75–85. It measures collective military backing, distinct from an individual committee member’s willingness. Military-specific settlement stops after transition.']
 },
 militarization:{
  increase:['扩充军方行政权限、强化军政机构和部分集权路线行动，会提高军政化。','Expanding military administrative powers, strengthening military institutions and some centralization-route actions raise militarization.'],
  decrease:['文官试点、军队专业化改革及扩大专业行政权限的选项会降低军政化。','Civilian pilots, military professionalization and empowering professional administration reduce militarization.'],
  thresholds:['达到70：每季全国支持−0.5、军方拥护＋0.5。低于40：每季全国支持＋0.5、军方拥护−1。40至不足70不产生这项固定修正。\n没有单独的军政化失败门槛，但其民意、军方后果及路线开放条件会影响转型。','At least 70: −0.5 national approval and +0.5 military backing each quarter. Below 40: +0.5 approval and −1 backing. From 40 to below 70, neither fixed modifier applies.\nThere is no standalone militarization defeat threshold, but its approval, backing and route-eligibility effects shape the transition.'],
  notes:['范围0—100，开局65—75。不是“越高越好”或“越低越好”，需配合全国支持、军方拥护与所选路线；转型后停止计算。','Range: 0–100, starting at 65–75. Neither higher nor lower is universally better; consider public approval, military backing and your route. Calculation stops after transition.']
 }
});

function metricGuideLanguage(value){return value?.[typeof gameLanguage!=='undefined'&&gameLanguage==='en'?1:0]||''}
Object.assign(GUIDE_METRICS,{
 'full-support':{
  increase:['相对现行预算提高个税、消费税和企业税，通常提高全票门槛。削减某派系重视的服务，或调整其反对的财产税、关税与宗教税，也可能提高该派门槛。','Raising income, consumption and corporate taxes relative to the enacted budget generally raises the full-support threshold. Cutting a faction’s preferred services or changing property, tariff or religious taxes against its preferences may also raise its threshold.'],
  decrease:['降低上述税率，或增加该派系偏好的公共投入，可降低其门槛。提高公共预算并非对每个派系都有效，需查看该派“查看细则”中的偏好。','Reducing those taxes or increasing a faction’s preferred public spending can lower its threshold. More spending does not please every faction; inspect each faction’s detailed preferences.'],
  thresholds:['基准60；该派议程倾向达到本案门槛即全票支持，低于门槛10点时不提供支持，中间线性计算。更高的门槛代表更难争取全票，不代表更多议席支持。','The baseline is 60. A faction fully supports a bill when its willingness reaches the bill’s threshold; 10 points below it yields no support, with linear scaling in between. A higher threshold means full support is harder to secure, not that more seats support the bill.'],
  notes:['预算比较的是新草案与现行政策的差额，执政党也受公共预算偏好影响；没有单独由门槛高低触发的危机或失败结局。','Budget calculations compare the draft with enacted policy. Public-budget preferences also apply to the ruling party. This threshold has no standalone crisis or defeat condition.']
 },
 'effective-agenda':{
  increase:['提高派系议程倾向，或修改草案以降低该派全票门槛，两种方式都能提高折算倾向。','Improve faction willingness or revise the draft to lower its full-support threshold. Both raise effective willingness.'],
  decrease:['议程倾向衰退、协商加成到期，或草案提高该派全票门槛，会降低折算倾向。','Agenda decay, expired bargains and a draft that raises the faction’s full-support threshold reduce effective willingness.'],
  thresholds:['50对应本团体0%支持；51对应10%；60及以上对应100%。下院低于50时，议案通过后每低1点扣0.1稳定，各派累加；上院没有这项低倾向惩罚。','50 gives no group support; 51 gives 10%; 60 or higher gives 100%. A lower-house group below 50 costs 0.1 stability per missing point after passage, summed across groups. Upper-house groups do not apply this penalty.'],
  notes:['折算倾向＝议程倾向−（本案全票支持门槛−60）。贡献的院内支持率还须乘以该派席位占比。','Effective willingness = agenda willingness − (the bill’s full-support threshold − 60). Its chamber-support contribution is further multiplied by the faction’s seat share.']
 },
 'upper-support':{
  increase:['与上院议长或团体代表协商并接受本案条件。议长每案可提高全体临时倾向，最多10；代表每季可为本团体增加15点本案倾向，可跨季继续争取。','Negotiate and accept bill-specific conditions from the upper-house speaker or group representatives. The speaker can grant all groups up to 10 temporary points once per bill. A representative can add 15 bill-specific points for their group each quarter.'],
  decrease:['非玩家团体的议程倾向每季度−2；议案与该派偏好冲突会降低支持。临时协商只对当前议案有效，结案清除，不能留给下一项法案。','Non-player groups lose 2 agenda points each quarter. Bills conflicting with their preferences reduce support. Negotiated bonuses apply only to the current bill and expire when it closes.'],
  thresholds:['倾向50对应0%本团体支持，51对应10%，60对应100%，按席位占比汇总；复审必须严格超过50%。不通过的退回或流案规则取决于政体和议案类型。低于50不扣下院那种稳定惩罚。','Willingness of 50 gives 0% group support, 51 gives 10%, and 60 gives 100%, aggregated by seat share. Review requires strictly more than 50%. Return or lapse rules depend on the system and bill. Low willingness does not apply the lower house’s stability penalty.'],
  notes:['复审投票不消耗行动点；接受协商条件消耗1点及所列资源。上院支持和下院支持分别计票，不能相互替代。','The review vote costs no action points; accepting negotiated conditions costs 1 point plus the listed resources. Upper- and lower-house support are counted separately and cannot substitute for each other.']
 },
 population:{
  increase:['本版总人口、地区人口权重和初始年龄结构固定，普通政策不能直接提高这些数值。','Total population, regional population weights and initial age structure are fixed in this version. Ordinary policies cannot directly increase them.'],
  decrease:['本版未模拟人口迁移或人口增减，因此没有通过预算或事件降低人口与人口权重的常规机制。','Population migration and population changes are not simulated, so there is no ordinary budget or event mechanism for reducing population or regional weights.'],
  thresholds:['没有人口高低直接触发的危机或失败门槛。人口权重较大的地区，对加权支持率和议会换届全国结果的影响更大。','There is no population-based crisis or defeat threshold. More populous regions have greater influence on weighted support and nationwide legislative-election results.'],
  notes:['加权支持率按人口权重汇总地方支持；人均GDP则用总GDP除以人口。人口固定时，人均GDP的变化来自GDP。','Weighted support aggregates regional support using population weights. GDP per capita divides total GDP by population; with population fixed, changes come from GDP.']
 }
});
function metricPolicyDefinition(key){
 const tax=Object.hasOwn(TAX_BASES107,key),m=policyInfo107(key),cap=budgetCap(key);
 const name=typeof translateGameText==='function'?translateGameText(m[0]):m[0];
 const d={
  increase:[`在“财政与预算”提高${m[0]}，提交并通过立法程序后生效。仅移动预算滑块不会改变现行政策。`,`Raise ${name} in Fiscal Policy & Budget, then submit and pass the bill. Moving a draft slider alone does not change enacted policy.`],
  decrease:[`在预算中下调${m[0]}并完成审议。降低税率通常减少财政收入；降低公共预算通常减少支出，但相关服务和发展收益也会减弱。`,`Lower ${name} in the budget and complete its legislative process. Lower taxes reduce revenue; lower public budgets reduce expenditure but also weaken associated services and development benefits.`],
  thresholds:[`本局可调整范围为${m[1]}%至${cap}%。达到上限后不能继续提高；公共预算上限可通过相应释宪每次增加1个百分点，税率上限不采用此规则。`,`The current range is ${m[1]}–${cap}%. The upper limit cannot be exceeded. Applicable constitutional interpretations can raise a public-budget cap by 1 percentage point each; tax caps do not use this rule.`],
  notes:tax?[`每提高1个百分点税率，财政收入增加${TAX_BASES107[key]}% GDP。预算审议还会受到各派系税收偏好的影响；名称随政体改变，税基系数按税种计算。`,`Each rate point adds ${TAX_BASES107[key]}% of GDP in revenue. Faction preferences also affect legislative support. Names vary by government system; tax-base coefficients depend on the tax type.`]:['这是持续的GDP预算占比，每增加1个百分点，年化公共支出增加1% GDP。相关提案的费用折扣与进度效果应按具体提案查看。','This is a recurring GDP allocation. Each percentage point adds 1% of GDP in annualized public expenditure. Proposal-specific cost discounts and progress effects are shown in the proposal.']
 };
 const impact={
  income:['每提高1个百分点个税，预算全票支持门槛提高1点；民意目标降低0.5。降税反向计算。','Each income-tax point raises the budget’s full-support threshold by 1 and lowers the approval target by 0.5. Cuts reverse these effects.'],
  corporate:['每提高2个百分点企业税，预算全票支持门槛提高1点；税收增加还会通过财政需求项影响增长。','Each 2 corporate-tax points raise the budget’s full-support threshold by 1. Higher receipts also affect growth through fiscal demand.'],
  vat:['每提高1.5个百分点消费税，预算全票支持门槛提高1点；降税反向计算。税收变化通过财政需求影响增长。','Each 1.5 consumption-tax points raise the budget’s full-support threshold by 1; cuts reverse this. Receipts affect growth through fiscal demand.'],
  property:['以5%为中性基准：每高1点，增长目标−0.015、民意目标−0.12；低于5%时反向。不同倾向的党派对增减此税的支持不同。','5% is neutral: each point above it subtracts 0.015 from the growth target and 0.12 from the approval target; below 5% the effects reverse. Factions have different preferences for this tax.'],
  tariff:['以5%为中性基准：每高1点，增长目标−0.04×国家开放系数、通胀压力＋0.02、民意目标−0.1；低于5%时反向。','5% is neutral: each point above it subtracts 0.04 × economic openness from the growth target, adds 0.02 inflation pressure and subtracts 0.1 from the approval target; below 5% the effects reverse.'],
  tithe:['仅神权共和制与神权专制可征收，固定范围0%—10%，0%停止征收，不随释宪提高上限。每提高1点，民意目标−0.25；什一税、教会税和寺院捐效果相同。','Only a Theocratic Republic or Theocratic Absolutism can collect it. Its fixed range is 0–10%; 0% stops collection. Interpretations cannot raise its cap. Each rate point lowers the approval target by 0.25. Tithe, Church Tax and Temple Levy have identical mechanics.'],
  education:['超过4.5%有利人力资本积累，低于4.5%会逐季回落。科研每季增加预算数值×2，教育部门提案完成后×3。大罢工的8%教育承诺须连续四季兑现。','Above 4.5% accumulates human capital; below 4.5% reduces it. Research gains the budget percentage × 2 per quarter, or × 3 after the education programme. The strike’s 8% education pledge requires four consecutive quarters.'],
  health:['经济模型以6%为基准；每高1个百分点，民意目标提高1.3点，低于基准则反向。医疗提案的费用可能随相关投入下降。','The economic model uses 6% as baseline. Each percentage point above it raises the approval target by 1.3; below baseline the effect reverses. Relevant investment can also lower health-programme costs.'],
  welfare:['经济模型以8%为基准；每高1个百分点，民意目标提高1.3点。大罢工中已承诺的15%预算连续四季可降低失业率4点；中途不足会重新计时。','The economic baseline is 8%; each point above it raises the approval target by 1.3. During a strike, a pledged 15% budget sustained for four quarters cuts unemployment by 4 points; dropping below it resets the streak.'],
  infrastructure:['超过3.5%有利基础设施存量积累，低于3.5%会逐季回落。更多建设投入支持短期需求、长期生产能力，也可降低有关提案费用。','Above 3.5% accumulates infrastructure stock; below 3.5% reduces it. Construction spending supports short-term demand, long-term productive capacity and some proposal cost discounts.'],
  security:['稳定目标中的此项为（预算−3）×2：预算每高1个百分点，稳定目标高2点，实际稳定逐季靠近目标。军政府下，达到5%每季军方拥护＋0.5，低于3%每季−1。','The stability-target contribution is (budget − 3) × 2: each extra budget point raises the target by 2, with actual stability adjusting gradually. Under Military Government, spending of at least 5% adds 0.5 backing per quarter; below 3% costs 1.']
 };
 if(impact[key])d.thresholds=d.thresholds.map((v,i)=>v+'\n'+impact[key][i]);
 if(key==='tithe')d.thresholds=impact.tithe;
 d.notes=d.notes.map((v,i)=>v+'\n'+['经济影响每季度吸收约35%的政策差额；科研、提案费用与局势预算承诺按已通过预算检查。','Economic effects absorb about 35% of the policy gap each quarter; research, proposal costs and situation pledges use the enacted budget.'][i]);
 return d;
}
function metricGuideDefinition(id){
 const base=id.startsWith('policy-')&&policyMeta[id.slice(7)]?metricPolicyDefinition(id.slice(7)):GUIDE_METRICS[id];
 if(!base)return null;
 const out={...base};
 if(id==='approval'&&regime().id==='federal')out.thresholds=base.thresholds.map((v,i)=>v+'\n'+['联邦委员会制另要求预算与改革通过时全国支持率达到50%。连续两季低于30%后，每个仍低于30%的季度有35%概率触发公众信任危机；四季度内必须恢复到40%，否则执政结束。','Federal Council additionally requires national approval of at least 50% when passing budgets or reforms. After two consecutive quarters below 30%, each further low quarter has a 35% chance to trigger a public-trust crisis. Restore approval to at least 40% within four quarters or your rule ends.'][i]);
 return out;
}
const guideCatalogBeforeMetricDetails=guideCatalog104;
guideCatalog104=function(){
 const entries=guideCatalogBeforeMetricDetails();
 for(const id of ['growth-pressure','potential']){
  const d=GUIDE_METRICS[id];
  entries.push({id,title:metricGuideLanguage(d.title),aliases:[...d.title,...d.aliases],text:metricGuideLanguage(d.intro),category:entries.find(e=>e.id==='growth')?.category||'经济与财政'});
 }
 return entries.map(e=>{
  const d=metricGuideDefinition(e.id);if(!d)return e;
  let aliases=[...e.aliases,...(d.aliases||[])];
  if(e.id==='growth')aliases=aliases.filter(a=>!['潜在增长','增长压力','年化增长压力','Potential Growth','Growth Pressure','Annualized Growth Pressure'].some(x=>guideNormalize104(a)===guideNormalize104(x)));
  return {...e,title:d.title?metricGuideLanguage(d.title):e.title,aliases:[...new Set(aliases)],metricGuide:d};
 });
};
function hbMetricSections(entry){
 const d=entry.metricGuide;if(!d)return null;
 const fold=(key,zh,en,hintZh,hintEn)=>hbFold(hbText(zh,en),hbText(hintZh,hintEn),hbParagraphs(metricGuideLanguage(d[key])));
 return {
  lead:d.intro?metricGuideLanguage(d.intro):entry.text.match(/^.*?(?:[。！？]|\.(?:\s|$)|$)/s)?.[0]||entry.text,
  sections:fold('thresholds','数值与门槛','Values & Thresholds','阶段变化、危机与结束条件','Ranges, risks and recovery conditions')+
   fold('increase','如何提高','How to Increase','可采取的措施与生效方式','Actions and how they take effect')+
   fold('decrease','如何降低','How to Decrease','消耗、削减与负面来源','Spending, reductions and causes of decline')+
   fold('notes','计算与关联','Calculation & Connections','与其他指标的区别和相互影响','How this metric relates to others')+
   hbFold(hbText('完整说明','Full Reference'),hbText('本局规则与制度差异','Current rules and system differences'),hbParagraphs(entry.text))
 };
}
