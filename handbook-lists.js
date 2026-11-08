/* Read-only handbook presentation. Conditions and consequences stay together. */
function hbListRow(zh,en,descriptionZh,descriptionEn,tone=''){return {label:[zh,en],text:[descriptionZh,descriptionEn],tone}}
function hbListGroup(zh,en,rows,noteZh='',noteEn=''){return {title:[zh,en],rows,note:[noteZh,noteEn]}}
function hbClassifiedData(id,key,definition){
 const row=hbListRow,group=hbListGroup;
 const admin=['管理员模式保留数值影响，但不触发失败结局。','Administrator Mode retains numerical effects but prevents defeat endings.'];
 if(key==='thresholds')switch(id){
  case 'approval':return [
   group('通用提醒','General Alert',[row('低于 50%','Below 50%','出现执政提醒。','Displays a governing alert.','caution')]),
   group('民主政体','Democratic Systems',[
    row('低于 20%','Below 20%','每季度额外：稳定度 −4、信心 −3。','Additional quarterly loss: −4 stability and −3 confidence.','caution'),
    row('降至 0%','At 0%','执政结束。','Your rule ends.','danger')]),
   group('非民主政体','Non-democratic Systems',[
    row('低于 20%','Below 20%','必定触发“国家名之春”民主化运动。','Triggers the country’s Spring democratization movement.','caution'),
    row('降至 0%','At 0%','每季度额外扣除 12 点稳定度。','An additional 12 stability is lost each quarter.','danger'),
    row('低于 / 高于 55%','Below / Above 55%','每季度稳定修正＝（全国支持率 −55）×0.08；低于55拖累稳定，高于55改善稳定。','Quarterly stability adjustment = (national approval − 55) × 0.08. Below 55 harms stability; above 55 improves it.')
   ],'包括象征性民主及本游戏中的神权共和制。','Includes Nominal Democracy and this game’s Theocratic Republic.'),
   ...(regime().id==='federal'?[group('联邦委员会制附加规则','Additional Federal Council Rules',[
    row('法案通过：达到 50%','Enactment: at least 50%','预算与改革通过时，全国支持率须达到50%。','National approval must reach 50% when budgets and reforms pass.'),
    row('连续两季度低于 30%','Two quarters below 30%','此后每个仍低于30%的季度，有35%概率触发公众信任危机。','Each subsequent quarter still below 30% has a 35% chance of triggering a public-trust crisis.','caution'),
    row('危机开始后四季度内','Within four quarters of the crisis','恢复全国支持率至40%或以上；未达成则执政结束。','Restore national approval to at least 40%; otherwise your rule ends.','danger')])]:[]),
   group('模式说明','Mode Note',[],...admin)
  ];
  case 'forecast':return [group('民意提醒与评议','Approval Alerts & Reviews',[
   row('低于 50%','Below 50%','出现执政提醒。','Displays a governing alert.','caution'),
   row('民主国家：选举结算','Democracy: election settlement','加权支持率必须超过50%才能胜选，恰好50%不足。','Weighted support must exceed 50% to win; exactly 50% is insufficient.','danger'),
   row('非民主国家：权力评议','Non-democratic legitimacy review','按高于或低于50%的差额修正稳定。','Adjusts stability by the gap above or below 50%, rather than universally applying democratic election defeat.')
  ]),group('宪制条件','Constitutional Conditions',[
   row('社会多元修正案','Social Pluralism Amendment','加权支持率达到80%，且稳定达到60；长期少数群体问题仍存在、尚未采取强制措施，才可提出。','To propose: weighted support at least 80%, stability at least 60, and an unresolved minority issue with no coercive policy underway.'),
   row('联邦修宪审查','Federal amendment review','司法赞成达到半数，同时加权支持率超过50%，两项必须同时满足。','Judicial approval of at least half and weighted support above 50% must hold simultaneously.')
  ],'提出修正案后，须完成审议程序。','After proposing an amendment, complete its review procedure.')];
  case 'inflation':return [group('通胀阶段','Inflation Levels',[
   row('央行目标：2%','Central-bank target: 2%','偏离2%越远，民意目标受到的损害越大；过低或负通胀也有代价。','Greater deviation from 2% harms the approval target; very low or negative inflation also has costs.'),
   row('超过 45%','Above 45%','出现经济危机风险提醒。','Displays an economic-crisis risk alert.','caution'),
   row('达到 50%','At least 50%','可触发经济危机。','Can trigger an economic crisis.','danger'),
   row('经济危机结束','Economic-crisis recovery','通胀低于20%，且债务/GDP低于60%；仅降低其中一项不够。','Inflation below 20% AND debt-to-GDP below 60%; improving only one is insufficient.')
  ])];
  case 'unemployment':return [group('就业风险','Employment Risk',[
   row('超过 8%','Above 8%','出现大罢工风险提醒。','Displays a general-strike risk alert.','caution'),
   row('达到 10%','At least 10%','可触发全国大罢工。','Can trigger a general strike.','danger'),
   row('低于 5%','Below 5%','全国大罢工结束；恰好5%仍未达到结束条件。','The general strike ends; exactly 5% is insufficient.')
  ],'高失业损害民意，罢工还会持续损害增长、稳定与信心。','High unemployment harms approval; a continuing strike also damages growth, stability and confidence.')];
  case 'debt':return [group('债务 / GDP','Debt-to-GDP',[
   row('超过 65%','Above 65%','压低经济模型中的信心目标。','Lowers the economic model’s confidence target.'),
   row('超过 70%','Above 70%','增加执政财政压力。','Adds governing fiscal pressure.','caution'),
   row('超过 90%','Above 90%','出现经济危机风险提醒。','Displays an economic-crisis risk alert.','caution'),
   row('达到 / 超过 100%','At / Above 100%','达到100%可触发经济危机；超过100%另增加国债风险溢价。','At 100%, an economic crisis can start; above 100%, an additional bond-risk premium applies.','danger'),
   row('危机结束：两项同时满足','Recovery: both conditions','债务/GDP低于60%，且通胀低于20%。','Debt-to-GDP below 60% AND inflation below 20%.')
  ])];
  case 'judicial':return [group('低独立性与司法危机','Low Independence & Judicial Crisis',[
   row('低于 35','Below 35','每季度支持率 −2、稳定度 −2。','−2 approval and −2 stability per quarter.','caution'),
   row('低于 20','Below 20','每季度支持率 −3、稳定度 −3，按本档数值结算。','−3 approval and −3 stability per quarter, replacing the previous tier.','danger'),
   row('达到 20 或更低','20 or lower','可触发司法公平事件。','Can trigger a judicial-fairness movement.','danger'),
   row('恢复至超过 40','Recovery above 40','司法公平事件结束，恰好40不足。','The judicial-fairness movement ends; exactly 40 is insufficient.')
  ]),group('司法互动频率','Judicial Interaction Frequency',[
   row('通常情况','Usual circumstances','原有司法互动基础概率为12%。','The base judicial-interaction chance is 12%.'),
   row('达到 70','At least 70','高位互动概率为25%，开始累计连续高位季度。','The high-independence chance is 25%; the consecutive-high-quarter streak accumulates.'),
   row('连续四季度处于高位','Four consecutive high quarters','原有司法互动基础概率提高至45%。','The base judicial-interaction chance rises to 45%.')
  ])];
  case 'local-demands':return [group('履约进度','Demand Progress',[
   row('完全未履约','No fulfilment','地区基准支持最多扣减20%。','Regional baseline support can fall by up to 20%.'),
   row('达到 100%','At least 100%','完成本轮地方诉求。','Completes the current regional demand.'),
   row('超额履约','Overdelivery','最多额外增加8%的基准支持修正。','Adds at most an 8% baseline support bonus.'),
   row('诉求周期第六季度起','From the sixth quarter of a cycle','未履约追加执政压力；灾区可暂缓原诉求惩罚。','Unmet demands add governing pressure; disaster-hit regions may be temporarily exempt.','caution'),
   row('至少三地未履约','At least three unmet regions','若稳定同时连续两季度低于35，每季有35%概率触发叛乱。','With stability also below 35 for two consecutive quarters, each quarter has a 35% chance of rebellion.','caution')
  ])];
  case 'faction-relation':return [group('党派关系与联合政府','Group Relations & Coalitions',[
   row('数值范围','Range','0—100。','0–100.'),
   row('达到 70','At least 70','符合组阁条件的政体中，可邀请该党加入联合政府。','In coalition-capable systems, unlocks an invitation to join the government.'),
   row('政治盟友低于 50','An ally below 50','引发政府危机。','Triggers a government crisis.','danger'),
   row('原盟友恢复至超过 60','Original allies recover above 60','还须维持足够的联盟席位，才能修复原联合政府。','Sufficient coalition seats are also required to repair the original government.')
  ],'政府危机的期限与后果随政体变化，见该局势的说明。','Government-crisis deadlines and consequences vary by system; consult that situation.')];
  case 'loyalty':return [group('内阁忠诚','Cabinet Loyalty',[
   row('数值范围','Range','0—100。','0–100.'),
   row('低于 30','Below 30','部分人事事件处理后，仍在任的低忠诚官员会主动辞职；不是每次数值降到30以下都立即辞职。','After certain personnel events, a serving low-loyalty official resigns; not every drop below 30 causes an immediate resignation.','caution')
  ]),group('联邦委员会制','Federal Council',[
   row('达到 70','At least 70','解锁玩家协助推进该委员提案及调整任务方向。','Unlocks player-directed programme actions and task directions for that councillor.'),
   row('低于 70','Below 70','上述手动操作重新锁定。','Those manual controls become locked again.')
  ])];
  case 'clergy-loyalty':return [group('神职人员忠诚度','Clerical Loyalty',[
   row('初始数值','Starting value','100%。','100%.'),
   row('低于 40','Below 40','每季全国支持率 −1，并出现提醒。','−1 national approval per quarter and an alert.','caution'),
   row('低于 20','Below 20','每季全国支持率 −1、稳定度 −2，替代上一档。','−1 national approval and −2 stability per quarter, replacing the previous tier.','danger'),
   row('归零：神权专制','At zero: Theocratic Absolutism','统治结束。','Your rule ends.','danger'),
   row('归零：神权共和制','At zero: Theocratic Republic','触发神职叛乱，平息后转为象征性民主制。','Triggers a clerical rebellion; resolving it changes the system to Nominal Democracy.','danger')
  ],...admin)];
  case 'family-recognition':return [group('活跃家族的合法性承认','Recognition by Active Families',[
   row('玩家家族','Your own family','固定为100。','Remains fixed at 100.'),
   row('其他家族低于 80','Other families below 80','每低1点，关联派系议程倾向 −0.25。','Each missing point reduces linked faction willingness by 0.25.'),
   row('达到 40 或更低','40 or lower','每家每季全国支持率 −0.5、稳定度 −1。','Each family costs 0.5 approval and 1 stability per quarter.','caution'),
   row('低于 20','Below 20','封锁枢密院表决。','Blocks privy-council votes.','danger'),
   row('三个活跃家族归零','Three active families at zero','三个仍有势力的家族承认归零，统治结束。','Your rule ends when three families with remaining powers reach zero recognition.','danger'),
   row('恢复至 20 / 超过 40','Recovery to 20 / above 40','达到20解除对应表决封锁；超过40解除该家族季度损耗。','Reaching 20 removes its voting block; exceeding 40 removes that family’s quarterly penalty.')
  ])];
  case 'central-authority':return [group('达到100：重新决定国家未来','At 100: Decide the Nation’s Future',[
   row('保留贵族制','Retain Aristocratic Rule','终止家族承认与中央集权度计算。','Ends family-recognition and centralization calculations.'),
   row('转为君主专制','Become an Absolute Monarchy','按转型选项切换政体。','Changes the government system through the transition choice.'),
   row('转为君主立宪制','Become a Constitutional Monarchy','按转型选项切换政体。','Changes the government system through the transition choice.')
  ],'达到100触发对应局势；以上选择不消耗行动点。','Reaching 100 triggers the situation; these choices cost no action points.')];
  case 'military-backing':return [group('军方拥护度','Military Backing',[
   row('低于 40','Below 40','每季稳定度 −1，并出现提醒。','−1 stability per quarter and an alert.','caution'),
   row('低于 20','Below 20','每季稳定度 −3、全国支持率 −1，替代上一档。','−3 stability and −1 national approval per quarter, replacing the previous tier.','danger'),
   row('归零','At zero','委员会罢免主席，普通模式下游戏结束。','The committee removes its chair; ordinary play ends.','danger')
  ])];
 }
 if(key==='effects')switch(id){
  case 'confidence':return [group('融资与经济影响','Financing & Economic Effects',[
   row('信心下降','Falling confidence','国债风险溢价提高、信用评级变差。','Raises bond-risk premiums and worsens credit ratings.','caution'),
   row('信心提高','Rising confidence','有利于经济增长和融资。','Supports growth and financing.')
  ])];
  case 'ap':return [group('每季度行动点','Action Points per Quarter',[
   row('固定行动点','Fixed','每季3点＋科研等级，上限6点。','3 per quarter + research level, capped at 6.'),
   row('随机行动点','Random','初始1—6点；科研每升1级，下限提高1点，最多缩至6—6。','Initially 1–6; each research level raises the lower bound by 1, eventually reaching 6–6.'),
   row('伪随机行动点','Planned','预排的1—6点＋科研等级，可超过6点。','Prearranged 1–6 roll + research level; the total may exceed 6.'),
   row('剩余点数不足','Insufficient remaining points','无法执行费用超过剩余点数的行动。','Actions costing more than the remaining points are unavailable.'),
   row('剩余点数为 0','No points remaining','仍可回复事件、查阅资料及进入下一季度。','Event replies, reference browsing and quarter advancement remain available.')
  ])];
  case 'research':return [group('科研升级与行动点','Research & Action Points',[
   row('每达到 100% 进度','Every 100% progress','科研提高1级。','Gains one research level.'),
   row('固定模式','Fixed mode','每级增加1点季度额度，最多6点。','Each level adds 1 quarterly point, up to 6.'),
   row('随机模式','Random mode','每级提高随机下限1点，直至每季固定6点。','Each level raises the random minimum by 1 until every quarter grants 6.'),
   row('伪随机模式','Planned mode','预排点数每级加1，没有6点总额上限。','Adds 1 per level to the prearranged roll, without a six-point total cap.')
  ],'科研水平较低时，每季可采取的政治行动较少。','Lower research limits the number of political actions available each quarter.')];
  case 'growth':return [group('实际增长与潜在增长','Actual & Potential Growth',[
   row('实际增长高于 0%','Actual growth above 0%','实际经济扩张。','Real economic expansion.'),
   row('实际增长低于 0%','Actual growth below 0%','实际经济收缩。','Real economic contraction.','caution'),
   row('高于潜在增长','Above potential','有助于降低失业，也增加通胀压力。','Tends to lower unemployment but adds inflationary pressure.'),
   row('低于潜在增长','Below potential','就业压力上升，通胀压力减轻。','Raises employment pressure while easing inflation pressure.')
  ],'持续低增长会通过民意、就业和债务风险威胁执政。','Persistently weak growth threatens your rule through approval, employment and debt risk.')];
  case 'rate':return [group('货币条件的影响','Monetary Conditions',[
   row('实际利率较高','Higher real rates','拖累增长并抑制通胀。','Restrains growth and inflation.'),
   row('实际利率较低','Lower real rates','支持需求，也可能放大物价压力。','Supports demand but can increase price pressure.'),
   row('政策利率上升','A higher policy rate','传入国债收益率，提高利息支出。','Feeds into bond yields and raises interest costs.')
  ])];
  case 'rating':return [group('风险分数与评级','Risk Score & Credit Rating',[
   row('低于 45','Below 45','AAA','AAA'),row('45 至不足 65','45 to below 65','AA','AA'),
   row('65 至不足 85','65 to below 85','A','A'),row('85 至不足 105','85 to below 105','BBB','BBB'),
   row('105 至不足 135','105 to below 135','BB','BB','caution'),row('135 至不足 170','135 to below 170','B','B','caution'),
   row('达到 170','170 or more','CCC','CCC','danger')
  ],'风险分数＝债务/GDP百分数＋（70−信心）×0.7。','Risk score = debt-to-GDP percentage + (70 − confidence) × 0.7.')];
  case 'revenue':return [group('收入与财政收支','Revenue & Fiscal Balance',[
   row('收入低于支出与利息之和','Revenue below spending + interest','产生赤字。','Produces a deficit.','caution'),
   row('收入高于支出与利息之和','Revenue above spending + interest','形成盈余。','Produces a surplus.')
  ],'高税收还会影响经济和预算案的院内支持，不能只看收入增加。','Higher taxes also affect the economy and support for the budget, beyond their revenue benefit.')];
  case 'balance':return [group('财政余额','Fiscal Balance',[
   row('大于 0','Above 0','财政盈余。','Fiscal surplus.'),row('低于 0','Below 0','财政赤字。','Fiscal deficit.'),
   row('赤字超过 3% GDP','Deficit above 3% of GDP','压低信心目标；已开启债务刹车时触发预算削减。','Lowers the confidence target; triggers budget cuts when the debt brake is enabled.','caution'),
   row('赤字超过 4% GDP','Deficit above 4% of GDP','追加执政财政压力。','Adds governing fiscal pressure.','caution')
  ],'长期赤字会累积公债。','Repeated deficits accumulate public debt.')];
  case 'capital':return [group('基础设施预算与积累','Infrastructure Spending & Accumulation',[
   row('超过 3.5%','Above 3.5%','基础积累项为正，设施存量增加。','Positive baseline accumulation adds infrastructure stock.'),
   row('恰好 3.5%','Exactly 3.5%','该项积累为0。','This accumulation term is zero.'),
   row('低于 3.5%','Below 3.5%','存量逐季回落。','Stock falls over successive quarters.','caution')
  ],'较高基础设施指数提高潜在增长；较低指数削弱长期生产能力。','Higher infrastructure stock raises potential growth; lower stock weakens long-run productive capacity.')];
  case 'human':return [group('教育投入与人力资本','Education & Human Capital',[
   row('教育预算超过 4.5%','Education spending above 4.5%','人力资本积累项为正；4.5%为基础积累分界。','Positive human-capital accumulation; 4.5% is the baseline.'),
   row('每增加 1 点人力资本','Each additional human-capital point','潜在增长提高0.025个百分点。','Adds 0.025 percentage points to potential growth.'),
  ])];
  case 'development':return [group('地区发展与地方支持','Regional Development & Support',[
   row('数值范围','Range','0—100。','0–100.'),row('低于 50','Below 50','对地区支持产生负修正。','Applies a negative regional-support modifier.'),
   row('等于 50','Exactly 50','中性，无发展修正。','Neutral; no development modifier.'),row('高于 50','Above 50','对地区支持产生正修正。','Applies a positive regional-support modifier.'),
   row('修正上限','Modifier limit','最多为基准支持的正负7%，不是直接增减7个百分点。','Capped at ±7% of baseline support, not a direct ±7 percentage points.')
  ])];
  case 'pressure':return [group('执政压力来源','Sources of Governing Pressure',[
   row('基础损耗：每季度','Base loss: every quarter','全国支持率 −0.6、稳定度 −0.2。','−0.6 approval and −0.2 stability.'),
   row('诉求周期第六季度起','From the sixth demand-cycle quarter','尚未完成地方诉求会追加损耗。','Unmet regional demands add further losses.'),
   row('债务/GDP超过 70%','Debt-to-GDP above 70%','产生财政压力，损害支持、稳定与信心。','Adds fiscal pressure on approval, stability and confidence.'),
   row('赤字超过 4% GDP','Deficit above 4% of GDP','产生财政压力，损害支持、稳定与信心。','Adds fiscal pressure on approval, stability and confidence.')
  ])];
  case 'agenda':case 'effective-agenda':return [group('折算倾向与团体支持','Effective Willingness & Group Support',[
   row('折算倾向 50','Effective willingness 50','本团体0%支持。','0% of the group supports the bill.'),
   row('折算倾向 51','Effective willingness 51','本团体10%支持。','10% of the group supports the bill.'),
   row('折算倾向 60 或以上','Effective willingness 60 or higher','本团体100%支持；中间线性计算，支持比例限制在0%—100%。','100% group support; intermediate values scale linearly, bounded to 0–100%.'),
   row('下院折算倾向低于 50','Lower-house willingness below 50','法案通过后，每低1点稳定度 −0.1，各团体累加。','After passage, −0.1 stability per missing point, summed across groups.','caution'),
   ...(id==='agenda'?[row('军委会成员意愿达到 60','Committee-member willingness at least 60','该成员投赞成票；按每人一票计算。','That member votes yes; each member has one vote.')]:[])
  ])];
  case 'full-support':return [group('全票支持门槛','Full-support Threshold',[
   row('基准门槛','Baseline','60。','60.'),row('议程倾向达到本案门槛','Willingness reaches this bill’s threshold','该派系全票支持。','The faction fully supports the bill.'),
   row('低于门槛 10 点','10 points below the threshold','该派系不提供支持；中间差额按比例计算。','The faction provides no support; intermediate values scale proportionally.')
  ],'门槛越高，取得全票支持所需的议程倾向越高。','A higher threshold requires greater agenda willingness to secure full support.')];
  case 'pass-rate':return [group('法案审议条件','Legislative Requirements',[
   row('两院制：预算与改革','Bicameral budgets & reforms','两院院内支持率均须超过50%。','More than 50% chamber support in each house.'),
   row('一院制：一般预算与改革','Ordinary unicameral budgets & reforms','院内支持率须达到51%。','Chamber support must reach at least 51%.'),
   row('军委会与联邦特别程序','Military & federal procedures','院内支持率须超过50%；军委会按人数计票。','More than 50% support; the military committee counts individual members.'),
   row('释宪','Interpretation','须超过50%支持。','Requires more than 50% support.'),
   row('通常修宪程序','Usual amendment procedure','下院三分之二支持，再经适用的上院复审与司法审查。','Two-thirds lower-house support, then any applicable upper-house and judicial review.'),
   row('联邦附加条件','Additional federal conditions','依议案类型，另要求全国支持率或加权支持率达标。','The applicable national-approval or weighted-support condition must also be met.')
  ],'政策通过后实施；退回、复议、延迟和流案规则见本局制度。','Policy takes effect after approval; return, reconsideration, delay and lapse rules follow the current system and bill type.')];
  case 'upper-support':return [group('上院支持与复审','Upper-house Support & Review',[
   row('倾向 50 / 51 / 60','Willingness 50 / 51 / 60','分别对应本团体0% / 10% / 100%支持，再按席位占比汇总。','Gives 0% / 10% / 100% group support respectively, then aggregates by seat share.'),
   row('复审支持率超过 50%','Review support above 50%','复审通过，恰好50%不足。','Review passes; exactly 50% is insufficient.'),
   row('复审未通过','Review rejected','依政体及议案类型退回或流案。','Returns or lapses according to system and bill type.'),
  ])];
  case 'militarization':return [group('军政化程度与季度影响','Militarization & Quarterly Effects',[
   row('低于 40','Below 40','全国支持率 ＋0.5、军方拥护度 −1。','+0.5 national approval and −1 military backing.'),
   row('40 至不足 70','40 to below 70','不产生此项固定季度修正。','Neither fixed quarterly modifier applies.'),
   row('达到 70','At least 70','全国支持率 −0.5、军方拥护度 ＋0.5。','−0.5 national approval and +0.5 military backing.')
  ])];
 }
 if(key==='decrease'&&id==='unemployment')return [group('就业措施','Employment Measures',[
  row('增长与就业政策','Growth & employment policy','提高实际增长，采用就业、劳动保障和民生措施。','Raise real growth and use employment, labour-protection and welfare measures.'),
  row('紧急救济','Emergency relief','支出2% GDP；失业率 −1.5个百分点。','Costs 2% of GDP; unemployment −1.5 percentage points.'),
  row('公共工程','Public works','支出5% GDP；四季度后失业率 −3、基础设施 ＋5。','Costs 5% of GDP; after four quarters, unemployment −3 and infrastructure +5.'),
  row('社会保障承诺','Social-protection pledge','预算至少15%，连续四季度后失业率 −4。','At least 15% spending for four consecutive quarters cuts unemployment by 4 points.'),
  row('教育科研承诺','Education-and-research pledge','预算至少8%，连续四季度后失业率 −2。','At least 8% spending for four consecutive quarters cuts unemployment by 2 points.')
 ],'后四项为全国大罢工的处置措施；预算承诺须先在局势中选择，并通过相应预算。','The last four are general-strike responses. Budget pledges must first be selected in the situation and enacted through the budget.')];
 if(key==='effects'&&id.startsWith('policy-')&&definition.effects){
  const parts=definition.effects.map(t=>t.split('\n'));
  if(parts[0].length>1)return [group('预算规则','Budget Rules',[
   row('范围与上限','Range & limits',parts[0][0],parts[1][0]),
   row('政策影响','Policy effects',parts[0].slice(1).join('\n'),parts[1].slice(1).join('\n'))
  ])];
 }
 return null;
}

function hbClassifiedHTML(groups){
 return groups.map(g=>{
  const title=metricGuideLanguage(g.title),note=metricGuideLanguage(g.note);
  return `<section class="hb-rule-group">${title?`<h4>${esc(title)}</h4>`:''}${g.rows.length?`<dl class="hb-values hb-classified">${g.rows.map(r=>`<div><dt>${esc(metricGuideLanguage(r.label))}</dt><dd${['caution','danger'].includes(r.tone)?` class="hb-${r.tone}"`:''}>${esc(metricGuideLanguage(r.text))}</dd></div>`).join('')}</dl>`:''}${note?`<p class="hb-rule-note">${esc(note)}</p>`:''}</section>`;
 }).join('');
}
function hbMetricBlock(entry,key){
 const groups=hbClassifiedData(entry.id,key,entry.metricGuide);
 return groups?`<div data-hb-classified="${esc(entry.id)}-${esc(key)}">${hbClassifiedHTML(groups)}</div>`:hbParagraphs(metricGuideLanguage(entry.metricGuide[key]));
}
