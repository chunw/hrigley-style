/**
 * Background texts for the eight sub-series of In the Spirit of the 21st Century,
 * taken verbatim from her Adobe Portfolio pages (archived in the book's
 * source-texts folder). They are other writers' texts the paintings answer to,
 * so each group closes with a small credit line naming its source; the longest
 * pieces are excerpted. The English stands as on the Portfolio site; seven
 * groups also carry a Chinese translation (parasZh, translated for this
 * book) so the Chinese pages present them too, each closing with the same
 * credit line. The GenAI text is her own statement for the work named in
 * workTitle; it remains English only.
 */
export interface SpiritBackground {
  id: string;
  titleEn: string;
  titleZh: string;
  credit?: string;
  workTitle?: string;
  paras: (string | { head: string })[];
  parasZh?: (string | { head: string })[];
}

export const SPIRIT_BACKGROUNDS: SpiritBackground[] = [
  {
    id: "climate",
    titleEn: "Climate Collapse & The War Against Powered Interests",
    titleZh: "气候崩塌与强势利益之战",
    credit: "Text by Felicity Lawrence, David Pegg and Rob Evans · The Guardian, Oct 10, 2019",
    paras: [
      "In 1998 a public relations consultant called Joe Walker wrote to the American Petroleum Institute (API), a trade association representing major fossil fuel companies, with a proposed solution to a big problem.",
      "In December the previous year, the UN had adopted the Kyoto protocol, an international treaty that committed signatory countries to reducing their greenhouse gas emissions in order to avert catastrophic climate breakdown.",
      "Reducing emissions represented a direct threat to the profits of fossil fuel companies and the API was working on an industry response. The fossil fuel industry had been making use of its lobbying group, the Global Climate Coalition, since 1989 to stress the uncertainties of climate science. A series of strategic goals was elaborated. Written in API slogan: \"Project goal: a majority of the American public, including industry leadership, recognizes that significant uncertainties exist in climate science.\" \"Victory would be achieved if those promoting the Kyoto treaty on the basis of extant science appear to be out of touch with reality\".",
      "In 2010 the American sociologists Riley Dunlap and Aaron McCright identified conservative think tanks, along with US conservative politicians, media and fossil fuel corporations, as crucial components in a \"denial machine\" that emerged in the 1990s. The activity of this machine would peak when the industry's financial interests came under threat, most notably in the years after 2007 and the election of Barack Obama, who had pledged to regulate and cap emissions.",
    ],
    parasZh: [
      "1998 年，一位名叫乔·沃克（Joe Walker）的公关顾问给美国石油学会（API）写了一封信。API 是代表大型化石燃料公司的行业协会。沃克在信里，为一个大问题提出了解法。",
      "前一年 12 月，联合国通过了《京都议定书》。这是一项国际条约，要求签署国减少温室气体排放，避免气候灾难性地崩溃。",
      "减排直接威胁到化石燃料公司的利润，API 正在组织全行业的应对。自 1989 年起，化石燃料行业一直利用它的游说组织「全球气候联盟」，反复强调气候科学的不确定性。他们制定了一系列战略目标，用 API 自己的口号写出来就是：「项目目标：让包括行业领袖在内的美国公众多数承认，气候科学存在重大不确定性。」「如果那些依据现有科学推动《京都议定书》的人显得脱离现实，胜利就实现了。」",
      "2010 年，美国社会学家赖利·邓拉普（Riley Dunlap）和亚伦·麦克赖特（Aaron McCright）指出：保守派智库，连同美国保守派政客、媒体和化石燃料公司，共同组成了一台 1990 年代出现的「否认机器」。每当这个行业的经济利益受到威胁，这台机器就运转得最猛。最明显的时期是 2007 年之后，以及贝拉克·奥巴马当选之后——奥巴马承诺要监管排放、为排放设上限。",
    ],
  },
  {
    id: "consumerism",
    titleEn: "Consumerism",
    titleZh: "消费主义",
    credit: "Text by Hillary Mayell · National Geographic, January 12, 2004 · Excerpt",
    paras: [
      "Americans and Western Europeans have had a lock on unsustainable over-consumption for decades. But now developing countries are catching up rapidly, to the detriment of the environment, health, and happiness, according to the Worldwatch Institute in its annual report, State of the World 2004.",
      "Perfectly timed after the excesses of the holiday season, the report put out by the Washington, D.C.-based research organization focuses this year on consumerism run amuck.",
      "Approximately 1.7 billion people worldwide now belong to the \"consumer class\", the group of people characterized by diets of highly processed food, desire for bigger houses, more and bigger cars, higher levels of debt, and lifestyles devoted to the accumulation of non-essential goods.",
      "\"Rising consumption has helped meet basic needs and create jobs,\" Christopher Flavin, president of Worldwatch Institute said in a statement to the press. \"But as we enter a new century, this unprecedented consumer appetite is undermining the natural systems we all depend on, and making it even harder for the world's poor to meet their basic needs.\"",
      { head: "Not Much Happier" },
      "The increase in prosperity is not making humans happier or healthier, according to several studies. Findings from a survey of life satisfaction in more than 65 countries indicate that income and happiness tend to track well until about $13,000 of annual income per person (in 1995 dollars). After that, additional income appears to produce only modest increments in self-reported happiness.",
    ],
    parasZh: [
      "几十年来，不可持续的过度消费一直是美国人和西欧人的事。现在，发展中国家正在迅速赶上——世界观察研究所的年度报告《2004 年世界状况》这样说——环境、健康和幸福都因此受损。",
      "这份报告由总部设在华盛顿特区的研究机构发布，时机正好在节日季的过度消费之后。报告今年关注的，是失控的消费主义。",
      "现在，全球大约有 17 亿人属于「消费者阶层」。这群人的特点是：吃高度加工的食品，想要更大的房子、更多更大的车，负债更高，过的日子就是不断积累非必需品。",
      "世界观察研究所所长克里斯托弗·弗莱文（Christopher Flavin）在给媒体的声明中说：「消费增长帮助满足了基本需求，也创造了就业。但进入新世纪，这种前所未有的消费胃口正在破坏我们赖以生存的自然系统，也让世界上的穷人更难满足基本需求。」",
      { head: "并没有更快乐" },
      "几项研究都发现，财富增加并没有让人更快乐、更健康。一项覆盖 65 多个国家的生活满意度调查显示：人均年收入在 13,000 美元（按 1995 年币值计）以下时，收入和幸福感基本同步上升；过了这个数，收入再增加，人们自报的幸福感只多一点点。",
    ],
  },
  {
    id: "attention",
    titleEn: "The Attention Economy",
    titleZh: "注意力经济",
    credit: "Nielsen Norman Group · Excerpt",
    paras: [
      "Attention is one of the most valuable resources of the digital age. For most of human history, access to information was limited. Centuries ago many people could not read and education was a luxury. Today we have access to information on a massive scale. Facts, literature, and art are available (often for free) to anyone with an internet connection.",
      "We are presented with a wealth of information, but we have the same amount of mental processing power as we have always had. The number of minutes has also stayed exactly the same in every day. Today attention, not information, is the limiting factor.",
      { head: "The Market for Our Attention" },
      "Attention is a valuable resource to us as individuals. This resource is also valued by businesses, political campaigns, nonprofits, and countless other organizations that try to entice us to spend money or volunteer our time. In 1997, Michael H. Goldhaber wrote that the global economy is shifting from a material-based economy to one based on the capacity of human attention. Many services online are offered for free. In the attention economy, attention is not only a resource but a currency: users pay for a service with their attention. Today, the dynamics of the attention economy incentivize companies to draw users in to spend more and more time on apps and sites. Designers who create sites and apps understand that their products vie for the limited resource of users' attention in a highly competitive market.",
      { head: "Conclusion" },
      "Certain facts of the digital economy may not change. Advertising will fund some free content for the foreseeable future, apps will compete for new users' attention, and people will still only have so much attention to dedicate. However, designers have a choice in this economy of attention: they can balance business needs, such as the need for new subscribers, advertising revenue, and profit, with respect for the best interests of their users.",
    ],
    parasZh: [
      "注意力是数字时代最宝贵的资源之一。在人类历史的大部分时间里，能接触到的信息是有限的。几百年前，很多人不识字，教育是一种奢侈。今天，我们能接触到的信息规模巨大。只要连上网，任何人都能看到事实、文学和艺术，还经常是免费的。",
      "摆在我们面前的信息很多，但我们的脑力和从前一样多，每天的时间也和从前一样多。今天，缺的不是信息，是注意力。",
      { head: "注意力的市场" },
      "对个人来说，注意力是一种宝贵资源。企业、政治竞选、非营利组织和无数其他机构也看重它，想方设法让我们花钱，或者拿出时间去做志愿工作。1997 年，迈克尔·H·戈德哈伯（Michael H. Goldhaber）写道：全球经济正在从以物质为基础，转向以人的注意力为基础。网上很多服务是免费的。在注意力经济里，注意力不只是资源，也是货币：用户用注意力为服务付款。今天，注意力经济的运转方式促使公司把用户拉进来，让他们在应用和网站上停留得越来越久。做网站和应用的设计师很清楚：他们的产品要在一个竞争激烈的市场里，争夺用户有限的注意力。",
      { head: "结语" },
      "数字经济里有些事实可能不会变。在可预见的未来，广告还会继续为一部分免费内容买单；应用还会争夺新用户的注意力；每个人能拿出的注意力也就那么多。但在注意力经济里，设计师有选择：他们可以在商业需求——比如新订阅者、广告收入和利润——与尊重用户的最大利益之间，找到平衡。",
    ],
  },
  {
    id: "alonetogether",
    titleEn: "Digital Life & Being Alone Together",
    titleZh: "数字生活与相伴独处",
    credit: "From the book description of Alone Together by Sherry Turkle · PsycINFO Database Record (c) 2016 APA",
    paras: [
      "Facebook. Twitter. Second Life. \"Smart\" phones. Robot pets. Robot lovers. Thirty years ago we asked what we would use computers for. Now the question is what don't we use them for. Now, through technology, we create, navigate, and carry out our emotional lives. We shape our buildings, Winston Churchill argued, then they shape us. The same is true of our digital technologies. Technology has become the architect of our intimacies. Online, we face a moment of temptation. Drawn by the illusion of companionship without the demands of intimacy, we conduct \"risk free\" affairs on Second Life and confuse the scattershot postings on a Facebook wall with authentic communication. And now, we are promised \"sociable robots\" that will marry companionship with convenience. Technology promises to let us do anything from anywhere with anyone. But it also drains us as we try to do everything everywhere. We begin to feel overwhelmed and depleted by the lives technology makes possible. We may be free to work from anywhere, but we are also prone to being lonely everywhere. In a surprising twist, relentless connection leads to a new solitude. We turn to new technology to fill the void, but as technology ramps up, our emotional lives ramp down. Alone Together is the result of MIT technology and society specialist Sherry Turkle's nearly fifteen-year exploration of our lives on the digital terrain. Based on interviews with hundreds of children and adults, it describes new, unsettling relationships between friends, lovers, parents, and children, and new instabilities in how we understand privacy and community, intimacy and solitude. It is a story of emotional dislocation, of risks taken unknowingly. But it is also a story of hope, for even in the places where digital saturation is greatest, there are people-especially the young-who are asking the hard questions about costs, about checks and balances, about returning to what is most sustaining about direct human connection. At the threshold of what Turkle calls \"the robotic moment,\" our devices prompt us to recall that we have human purposes and, perhaps, to rediscover what they are. (PsycINFO Database Record (c) 2016 APA)",
    ],
    parasZh: [
      "Facebook。Twitter。第二人生（Second Life）。「智能」手机。机器宠物。机器恋人。三十年前，我们问的是电脑能用来做什么。现在的问题是：有什么事是我们不用电脑做的。如今，我们通过技术来创造、安排和进行我们的情感生活。温斯顿·丘吉尔说，我们塑造建筑，然后建筑塑造我们。我们的数字技术也是如此。技术已经成为我们亲密关系的设计者。在网上，我们会遇上一个诱惑的时刻：被一种幻觉吸引——有陪伴，却不需要亲密所要求的东西——我们在「第二人生」里进行「零风险」的恋情，把 Facebook 墙上七零八落的帖子误认为真正的交流。而现在，又有人向我们许诺「社交机器人」，把陪伴与便利结合在一起。技术许诺让我们在任何地方、和任何人、做任何事。但当我们试图在每个地方做每件事时，它也在消耗我们。我们开始被技术使之成为可能的那种生活压得喘不过气，感到枯竭。我们也许可以在任何地方自由工作，但也同样容易在任何地方感到孤独。出人意料的是，不间断的连接带来了一种新的孤独。我们转向新技术来填补空虚，但技术越升温，我们的情感生活越降温。《相伴独处》（Alone Together）是麻省理工学院技术与社会专家雪莉·特克尔（Sherry Turkle）近十五年探索我们在数字地带上如何生活的成果。它基于对数百名儿童和成人的访谈，描述朋友、恋人、父母与孩子之间新的、令人不安的关系，也描述我们对隐私与社群、亲密与孤独的理解出现了怎样的不稳定。这是一个关于情感错位的故事，关于在不知情中冒的风险。但这也是一个关于希望的故事，因为即使在数字饱和最严重的地方，也有人——尤其是年轻人——在追问那些难题：关于代价，关于制衡，关于回到直接的人际连接中最能滋养人的部分。在特克尔所说的「机器人时刻」的门槛上，我们的设备促使我们想起，人有人的目的，并且也许能重新发现它们是什么。（PsycINFO 数据库记录 (c) 2016 APA）",
    ],
  },
  {
    id: "blackmirror",
    titleEn: "Black Mirror",
    titleZh: "黑镜",
    credit: "Text by Janna Anderson · Pew Research Center, April 17, 2018",
    paras: [
      "The initial hurdle in all such challenges will be to overcome technological determinism. This is the modern-day religion of acquiescence that stifles reason, choice and freedom.",
      "-- MARC ROTENBERG",
      "A plurality of experts say digital life will continue to expand people's boundaries and opportunities in the coming decade and that the world to come will produce more help than harm in people's lives. Still, nearly a third think that digital life will be mostly harmful to people's health, mental fitness and happiness. Most say there are solutions.",
    ],
    parasZh: [
      "这类挑战的第一道障碍，是克服技术决定论。它是现代的顺从之教，窒息理性、选择与自由。",
      "——马克·罗滕伯格（Marc Rotenberg）",
      "相对多数的专家认为，未来十年数字生活将继续扩展人们的边界和机会，未来的世界给人们生活带来的帮助会多于伤害。但仍有近三分之一的专家认为，数字生活对人们的健康、心理状态和幸福大体有害。多数专家说，解决办法是存在的。",
    ],
  },
  {
    id: "surveillance",
    titleEn: "Information Overload & Surveillance Capitalism",
    titleZh: "信息过载与监控资本主义",
    credit: "Book review of The Age of Surveillance Capitalism by Shoshana Zuboff",
    paras: [
      "Many years ago – in 1988, to be precise – as one of the first female professors at Harvard Business School to hold an endowed chair she published a landmark book, The Age of the Smart Machine: The Future of Work and Power, which changed the way we thought about the impact of computerization on organisations and on work. It provided the most insightful account up to that time of how digital technology was changing the work of both managers and workers. And then Zuboff appeared to go quiet, though she was clearly incubating something bigger. The first hint of what was to come was a pair of startling essays – one in an academic journal in 2015, the other in a German newspaper in 2016. What these revealed was that she had come up with a new lens through which to view what Google, Facebook et al were doing – nothing less than spawning a new variant of capitalism. Those essays promised a more comprehensive expansion of this Big Idea.",
      "And now it has arrived – the most ambitious attempt yet to paint the bigger picture and to explain how the effects of digitization that we are now experiencing as individuals and citizens have come about.",
      "The headline story is that it's not so much about the nature of digital technology as about a new mutant form of capitalism that has found a way to use tech for its purposes. The name Zuboff has given to the new variant is \"surveillance capitalism\". It works by providing free services that billions of people cheerfully use, enabling the providers of those services to monitor the behavior of those users in astonishing detail – often without their explicit consent.",
      "\"Surveillance capitalism,\" she writes, \"unilaterally claims human experience as free raw material for translation into behavioral data. Although some of these data are applied to service improvement, the rest are declared as a proprietary behavioral surplus, fed into advanced manufacturing processes known as 'machine intelligence', and fabricated into prediction products that anticipate what you will do now, soon, and later. Finally, these prediction products are traded in a new kind of marketplace that I call behavioral futures markets. Surveillance capitalists have grown immensely wealthy from these trading operations, for many companies are willing to lay bets on our future behavior.\"",
    ],
    parasZh: [
      "很多年前——准确地说，是 1988 年——她出版了一本里程碑式的书：《智能机器时代：工作的未来与权力》（The Age of the Smart Machine: The Future of Work and Power）。当时，她是哈佛商学院最早获得讲席教职的女性教授之一。这本书改变了人们理解计算机化如何影响组织和工作的方式。在当时，它是对数字技术如何改变管理者和员工的工作最深刻的描述。之后，祖博夫似乎沉寂了下来，但她显然在酝酿更大的东西。第一个信号是两篇令人吃惊的文章：一篇 2015 年发表在学术期刊上，一篇 2016 年发表在德国一家报纸上。这两篇文章表明，她找到了一种新的眼光，去看谷歌、Facebook 等公司在做的事——它们正在催生资本主义的一个新变种。这两篇文章也预告了，这个大想法还会有更完整的展开。",
      "现在，它来了。这是迄今最有野心的一次尝试：画出更大的图景，解释我们作为个人和公民正在经历的数字化影响，是怎样形成的。",
      "最核心的故事是：关键不在数字技术本身的性质，而在资本主义的一种新变异形式，它找到了一种利用技术为自身目的服务的方式。祖博夫给这个新变种起的名字是「监控资本主义」。它的运作方式，是提供数十亿人乐意使用的免费服务，让提供服务的公司能以惊人的细致程度监控这些用户的行为——常常没有得到用户明确的同意。",
      "她写道：「监控资本主义单方面把人的经验宣称为免费原材料，将其翻译成行为数据。这些数据中有一部分被用来改进服务，其余的被宣布为专有的『行为盈余』，被送进名为『机器智能』的先进生产流程，做成预测产品，预测你现在、近期和以后会做什么。最后，这些预测产品在一个新型市场上交易，我称之为行为期货市场。监控资本家从这些交易中积累了巨额财富，因为许多公司愿意拿我们未来的行为下注。」",
    ],
  },
  {
    id: "covid",
    titleEn: "From COVID-19 To The End of Neoliberalism",
    titleZh: "从新冠疫情到新自由主义的终结",
    credit: "Text by Alfred Saad-Filho · Critical Sociology, May 29, 2020 · Excerpt",
    paras: [
      "The COVID-19 pandemic triggered the sharpest and deepest economic contraction in the history of capitalism. To paraphrase The Communist Manifesto, all that was solid melted into air: 'globalization' went into reverse; long supply chains, that were previously the only 'rational' way to organize production, collapsed and hard borders returned; trade declined drastically; and international travel was severely constrained. In a matter of days, tens of millions of workers became unemployed and millions of businesses lost their employees, customers, suppliers and credit lines.",
      "The political implications of COVID-19 will continue to unfold for months, perhaps even years. Ideologically, neoliberal proclamations about the imperative of 'fiscal austerity' and the limitations of public policy vanished faster than one could spell 'bankruptcy'. Intransigent Austrians and neoliberals of every hue hastily retreated into a half-baked Keynesianism, as they tend to do when economies tank: no one is enamoured of negative externalities or the downside of the 'free market'; in a crisis the first to grab the capacious teats of the Treasury wins the big prize and at the hour of economic need, state intervention is questioned only for what it has not yet done. The private sector and the media begged for government spending and portentous preachers of the 'free market' rushed to the TV screens to plead for unlimited public spending in order to save private initiative. No doubt they will get back to their more familiar perorations when circumstances change and memories fade. At that point, the state will become 'bad' again and public services will be declared ready for another round of culling.",
      "I am cautiously optimistic that capitalism cannot wash this stain. It is now time to imagine what kind of society can serve the majority and avoid the repetition of the suffering and the disgraceful outcomes that we experienced in 2020. Instead of the crimes, systemic neglect and inefficiencies of neoliberalism, we need progressive taxation, the expansion of public services with built-in spare capacity for emergencies and a society based on solidarity, human values and respect for nature. This is easy to say and it is unquestionably correct, but the left has been on the defensive almost everywhere, sometimes for decades, and the pandemic may easily lead to authoritarian, controlling, racist and reactionary responses.",
      "To sum up, the COVID-19 pandemic happened by chance, but it was not unexpected. Its consequences are much more than scandalous: they are criminal, and the left must say this loudly and clearly. Neoliberal capitalism has been exposed for its inhumanity and criminality, and COVID-19 has shown that there can be no health policy without solidarity, industrial policy and state capacity. This is a desperate fight. We must come out of this crisis with a better society. The left is needed like never before and it must rise up to the challenge.",
    ],
    parasZh: [
      "新冠疫情引发了资本主义历史上最急剧、最深重的经济收缩。套用《共产党宣言》的话：一切坚固的东西都烟消云散了。「全球化」开始倒退；长供应链垮了，而它此前被认为是组织生产的唯一「理性」方式；硬边界回来了；贸易大幅下滑；国际旅行受到严格限制。几天之内，数千万人失业，数百万家企业失去了自己的员工、客户、供应商和信贷额度。",
      "新冠的政治影响还会继续展开几个月，甚至几年。在意识形态上，新自由主义关于「财政紧缩」势在必行、关于公共政策能力有限的那些宣言，消失得比拼出「破产」这个词还要快。顽固的奥地利学派和各色新自由主义者匆忙退回一种半吊子的凯恩斯主义——经济一垮，他们一向如此：没有人喜欢负外部性，也没有人喜欢「自由市场」的坏处；危机里，第一个抓住财政部那丰满乳房的人赢得大奖；在经济需要援手的时刻，国家干预被质疑，只是因为它做得还不够多。私营部门和媒体恳求政府花钱，「自由市场」那些道貌岸然的布道者冲上电视屏幕，恳求无上限的公共支出，来挽救私人企业。毫无疑问，等形势变了、记忆淡了，他们会回到更熟悉的那套长篇宣讲。到那时，国家会重新变成「坏的」，公共服务会被宣布，可以再砍一轮了。",
      "我持谨慎的乐观：资本主义洗不掉这个污点。现在是时候想一想，一个什么样的社会能为多数人服务，能避免我们 2020 年经历的痛苦和可耻结果重演。我们需要的，不是新自由主义的罪行、系统性的漠视和无能，而是累进税制，是扩充公共服务、为紧急情况预先留出余量，是一个建立在团结、人性价值和尊重自然之上的社会。这些话说起来容易，也无疑正确，但左翼几乎在所有地方都处于守势，有些地方已经守了几十年；而疫情也很容易引向威权、管控、种族主义和反动的回应。",
      "总结一下：新冠疫情的发生出于偶然，但它并不意外。它的后果远不只是丑闻——那是罪行，左翼必须大声、清楚地说出来。新自由主义资本主义的不人道与罪行已经暴露。新冠也表明：没有团结、没有产业政策、没有国家能力，就没有卫生政策。这是一场绝望的斗争。我们必须带着一个更好的社会走出这场危机。现在比以往任何时候都更需要左翼，它必须站出来，迎接这个挑战。",
    ],
  },
  {
    id: "genai",
    titleEn: "In the Cold Embrace of GenAI Art",
    titleZh: "在生成式 AI 艺术的冷拥抱中",
    workTitle: "Dying of Human artist in AI Era",
    paras: [
      "Machines, taught by the data we feed them, carry bias, reshaping justice, hiring, and care, while the hands of labor falter, displaced by automation's cold embrace. Amid this shifting landscape, artists feel the tremor, their sense of worth unraveling as AI mimics creation. But we must not forget the alchemy of art, born from nothing, that heals the human spirit. The \"human touch\" remains a refuge, a place machines cannot tread. This is the time to dive deeper, for superficial works will fade in the shadow of algorithmic output. Let art become more than itself, an interdisciplinary fusion of history, curation, and code, where AI becomes a tool, not a threat. And in this dance, hold fast to the unique aesthetic, the unmistakable brand of self, a signature that no machine can replicate. This is our answer to the future.",
    ],
  },
];
/**
 * Her own first-person text for this chapter: a WeChat Moments post on the
 * painting Inundated (mixed media), written while reading Homo Deus
 * (March 28, 2018). Unlike the Portfolio background texts above, this one is
 * hers, so it is kept bilingual: her Chinese original, with a faithful
 * English translation on the English pages.
 */
export const SPIRIT_MOMENT = {
  id: "inundated",
  labelEn: "WeChat Moments · March 28, 2018",
  labelZh: "朋友圈 · 2018 年 3 月 28 日",
  textEn: "Inundated (mixed media). Homo Deus, which I read today, makes this point: in the 21st century, the way to block thought and speech is to drown people in irrelevant information. We have already been inundated by vast amounts of data, ideas, promises and threats, and we do not know what to pay attention to, so we often waste time debating issues that do not matter. Because we cannot process that much data, we are gradually handing the power in our hands over to the free market and to external algorithms. In the end, this will make us as fragile as a fetus in the womb, and the news that has broken in recent days seems to be providing evidence for it.",
  textZh: "Inundated (mixed media). 今日读Homo Deus当中提到：到了21世纪，想阻挡思想言论，靠的是用不相关的信息把人淹没，我们已被海量的数据、想法、承诺和威胁淹没，不知道该注意什么，常常浪费时间辩论无关紧要的议题。因为无法处理大量的数据，我们正逐渐将手中的权力移交给自由市场和外部算法。这终会使得我们像胞衣中的胎儿一样脆弱不堪，近日爆出的新闻似乎也在为此提供论据。",
};
