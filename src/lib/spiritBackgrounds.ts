/**
 * Background texts for the eight sub-series of In the Spirit of the 21st Century,
 * taken verbatim from her Adobe Portfolio pages (archived in the book's
 * source-texts folder). They are other writers' texts the paintings answer to,
 * so each group closes with a small credit line naming its source; the longest
 * pieces are excerpted. Kept in English, as on the Portfolio site.
 * The GenAI text is her own statement for the work named in workTitle.
 */
export interface SpiritBackground {
  id: string;
  titleEn: string;
  titleZh: string;
  credit?: string;
  workTitle?: string;
  paras: (string | { head: string })[];
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
  },
  {
    id: "alonetogether",
    titleEn: "Digital Life & Being Alone Together",
    titleZh: "数字生活与相伴独处",
    credit: "From the book description of Alone Together by Sherry Turkle · PsycINFO Database Record (c) 2016 APA",
    paras: [
      "Facebook. Twitter. Second Life. \"Smart\" phones. Robot pets. Robot lovers. Thirty years ago we asked what we would use computers for. Now the question is what don't we use them for. Now, through technology, we create, navigate, and carry out our emotional lives. We shape our buildings, Winston Churchill argued, then they shape us. The same is true of our digital technologies. Technology has become the architect of our intimacies. Online, we face a moment of temptation. Drawn by the illusion of companionship without the demands of intimacy, we conduct \"risk free\" affairs on Second Life and confuse the scattershot postings on a Facebook wall with authentic communication. And now, we are promised \"sociable robots\" that will marry companionship with convenience. Technology promises to let us do anything from anywhere with anyone. But it also drains us as we try to do everything everywhere. We begin to feel overwhelmed and depleted by the lives technology makes possible. We may be free to work from anywhere, but we are also prone to being lonely everywhere. In a surprising twist, relentless connection leads to a new solitude. We turn to new technology to fill the void, but as technology ramps up, our emotional lives ramp down. Alone Together is the result of MIT technology and society specialist Sherry Turkle's nearly fifteen-year exploration of our lives on the digital terrain. Based on interviews with hundreds of children and adults, it describes new, unsettling relationships between friends, lovers, parents, and children, and new instabilities in how we understand privacy and community, intimacy and solitude. It is a story of emotional dislocation, of risks taken unknowingly. But it is also a story of hope, for even in the places where digital saturation is greatest, there are people-especially the young-who are asking the hard questions about costs, about checks and balances, about returning to what is most sustaining about direct human connection. At the threshold of what Turkle calls \"the robotic moment,\" our devices prompt us to recall that we have human purposes and, perhaps, to rediscover what they are. (PsycINFO Database Record (c) 2016 APA)",
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
