/* Annual budget and democratic platform terminology. */
Object.assign(globalThis.NATION_EN ||= {}, {
 '绿色经济':'Green Economics','左翼民粹主义':'Left-wing Populism','右翼民粹主义':'Right-wing Populism','技术官僚':'Technocracy','自由主义建制派':'Liberal Establishment','民主社会派':'Democratic Socialism','软威权主义':'Soft Authoritarianism','自由意志党':'Libertarian Party',
 '以清洁能源、绿色就业和生态投资推动经济转型。':'Promotes economic transition through clean energy, green jobs and ecological investment.',
 '强调再分配、民众动员与对经济精英的约束。':'Emphasizes redistribution, popular mobilization and limits on economic elites.',
 '强调国家认同、社会秩序与本土产业保护。':'Emphasizes national identity, social order and protection for domestic industries.',
 '重视专业行政、科研投入、项目评估与财政效率。':'Prioritizes professional administration, research, project appraisal and fiscal efficiency.',
 '维护代议制度、司法制衡和开放的市场秩序。':'Defends representative institutions, judicial checks and an open market economy.',
 '通过民主程序扩大劳动者参与、公共服务和社会所有。':'Uses democratic institutions to expand worker participation, public services and social ownership.',
 '保留选举制度，同时扩大行政协调与集中决策的权力。':'Retains elections while extending executive coordination and centralized decision-making.',
 '施政方案':'policy programme',
 '年度预算':'Annual Budget','年度财政与公共预算案':'Annual Fiscal and Public Budget Bill',
 '每6个季度可进行一次预算调整，表决失败或主动撤回后可重新花费行动点调整并提交。':'Adjust the budget once every 6 quarters. After a failed vote or withdrawal, revise and resubmit it; another vote costs action points.',
 '本年度预算调整机会尚可使用。':'This year’s budget adjustment is still available.',
 '本年度预算已通过，下一个游戏年恢复调整机会。':'This year’s budget has been approved. Another adjustment becomes available next game year.',
 '本年度预算已通过，请在下一游戏年调整':'This year’s budget has been approved. Make the next adjustment in the next game year.',
 '这项改革不在当前执政路线的草案范围内':'This reform is not available under the current governing platform.',
 '每游戏年6个季度，每年可通过一次预算调整。':'Each game year has 6 quarters and permits one approved budget adjustment.',
 '每游戏年6个季度，按日期栏的年份计算，每年可通过一次预算调整。表决失败、退回或撤回草案后仍可重试；两院审议完成或延缓实施获批时占用当年机会。已批准预算跨年实施时保留原批准年份。':'Each calendar year shown in the date bar has 6 quarters and permits one approved budget adjustment. Defeated, returned or withdrawn drafts may be retried. Approval through the legislative process, including approval for delayed implementation, uses that year’s adjustment. A delayed budget retains its original approval year when it takes effect.',
 '政党倾向组合':'Party Platforms','民主政党倾向':'Democratic Party Ideologies','执政路线':'Governing Platform',
 '民主政党至少具有两种相容的政治倾向。党名与倾向相符，人物来自所属党派的倾向组合。组合影响预算偏好、组阁距离、选举政策契合和可提出的改革。非民主政体保留原有倾向组。':'Democratic parties have at least two compatible political outlooks, reflected in party names and their members. Their combination shapes budget preferences, coalition compatibility, electoral policy alignment and reform eligibility. Non-democratic systems retain their existing outlook groups.',
 '执政路线与改革':'Platforms and Reforms','专属改革':'Exclusive Reforms','改革资格':'Reform Eligibility',
 '改革草案随政体与玩家所属党派倾向筛选，每6季度刷新。社民、民主社会等倾向可提出一次性遗产税特别征收；新自由主义政党具有企业准入与市场开放方案。已开始改革继续执行；未提交草案按当前路线筛选。':'Draft reforms depend on the political system and the player’s party platform, and refresh every 6 quarters. Social-democratic and democratic-socialist platforms can propose a one-off inheritance levy; neoliberal parties have business-entry and market-opening programmes. Reforms already underway continue. Unsubmitted drafts follow the current platform.',
 '每年一次预算':'One budget per year'
});
const PLATFORM_REFORM_EN=[
 ['Green Jobs and Building Efficiency','Use public procurement to support building retrofits and green jobs, with upfront fiscal costs.'],
 ['Large-Wealth and Public Procurement Audits','Audit major wealth transfers and public procurement to address inequality, while unsettling capital holders.'],
 ['Domestic Supply-Chain Procurement','Prioritize domestic suppliers to support employment, at the cost of higher prices.'],
 ['Public Project Appraisal','Rank public projects through independent cost-benefit appraisal, improving research and investment management.'],
 ['Open Procurement and Competitive Neutrality','Publish procurement standards and ensure equal access for firms of different ownership types, increasing competition and judicial oversight.'],
 ['Worker Participation in Corporate Decisions','Give workers a role in major business decisions, improving labor protections while increasing negotiation costs.'],
 ['Integrated Executive Authorization','Concentrate cross-department project approvals in an executive coordination office, reducing decentralized oversight.'],
 ['Streamlined Business Licensing','Reduce entry and operating permits to expand private investment, while raising concerns about public protections.'],
 ['Military Procurement and Logistics Coordination','Unify procurement and logistics standards to improve the military administration’s execution capacity.'],
 ['Unified Noble Tax Rolls and Public Accounts','Create common tax rolls and accounts for noble houses, improving fiscal transparency while challenging local privileges.'],
 ['Religious Welfare Fund Integration','Coordinate religious charities and local relief networks, extending services and clerical administrative involvement.'],
 ['State Enterprise Accountability Audits','Audit state-enterprise managers to improve public-capital management and organizational accountability.'],
 ['Royal Civil Service Appraisal','Introduce professional assessment and promotion procedures for royal civil servants.'],
 ['Local Public Service Supervision','Place local service delivery under central supervision, accelerating implementation while expanding executive discretion.']
];
PLATFORM_REFORMS.forEach((r,i)=>{NATION_EN[r[1]]=PLATFORM_REFORM_EN[i][0];NATION_EN[PLATFORM_REFORM_TEXT[i]]=PLATFORM_REFORM_EN[i][1]});
