export interface BookSeries {
  id: string;
  titleEn: string;
  titleZh: string;
  years: string;
  textEn: string;
  textZh: string;
}

/**
 * Series sections that complete the book's outline but have no catalog plates yet:
 * Nostalgia and Visions in Ceramics, the whole Screen & Archive chapter
 * (IMMEMORY, Negotiated Intelligence, Unfinished Archive, Google Searches,
 * Feed Scanner, Cave Dance, Infected Instructions) and the whole Live chapter
 * (Soliloquy, Art.empath.io, Still I Rise, One Day, Augmented Ping-Pong). English texts are the artist's own project overviews;
 * Chinese texts are translations of them. Plates are added per series later.
 * Keep the field format exactly (id first, double-quoted strings):
 * the book editor's PR flow (api/book-pr.js) edits textEn/textZh by id.
 */
export const BOOK_SERIES: BookSeries[] = [
  {
    id: "nostalgia",
    titleEn: "Nostalgia",
    titleZh: "怀旧",
    years: "2018",
    textEn: "An online space for meditation and self-reflection, peppered with nostalgic imagery.",
    textZh: "一个用于冥想与自我反思的线上空间，点缀着怀旧的意象。",
  },
  {
    id: "ceramics",
    titleEn: "Visions in Ceramics",
    titleZh: "陶之视界",
    years: "2026",
    textEn: "My ceramics begin as functional forms - a candle holder, a cup, a bowl - then leak into surreal landscapes.",
    textZh: "我的陶艺从功能性的形态开始，一只烛台、一只杯子、一只碗，然后渗漏成超现实的风景。",
  },
  {
    id: "immemory",
    titleEn: "IMMEMORY: ON COVID-19",
    titleZh: "IMMEMORY：新冠记忆",
    years: "2019 - permanent",
    textEn: "Initiated in the midst of the COVID-19 pandemic in early 2020, IMMEMORY is a long-term archival project aiming to facilitate sharing of creative and thoughtful responses to the changing pandemic crisis from around the world.\n\n“Immemory”, in the sense that the pandemic produces many artifacts quickly forgotten, narratives rapidly changed, and perceptions constantly shifting. As Winston Churchill remarked in the aftermath of WWII, “never let a good crisis go to waste”. While the pandemic is profoundly shaking up the world, this exhibition is dedicated to bringing perspectives to issues revealed by the current crisis and documenting what it means to live through this unprecedented moment, through a creative angle.\n\nUltimately, in these troubled times, we want to use this exhibition to foster a better understanding of the experiences of others, to transcend individual differences and cultivate a sense of empathy, and to raise awareness of shared values rooted in our humanity.\n\nIMMEMORY website is one of the 5 official nominees for the 2021 Webby Awards in the Cultural Websites category.",
    textZh: "IMMEMORY 始于 2020 年初新冠疫情之中，是一个长期的档案项目，旨在促进世界各地对不断变化的疫情危机的创造性与思考性回应的分享。\n\n“Immemory”的意思是，疫情产生了许多很快被遗忘的物件、迅速改写的叙事和不断变化的认知。正如温斯顿·丘吉尔在二战后所说，“永远不要让一场好危机白白浪费”。当疫情深刻地撼动世界时，这个展览致力于以创造性的角度，为危机所揭示的问题带来新的视角，并记录活过这一前所未有的时刻意味着什么。\n\n最终，在这段动荡的日子里，我们希望用这个展览增进人们对他人经历的理解，超越个体的差异，培养共情，并唤起对植根于我们人性的共同价值的意识。\n\nIMMEMORY 网站是 2021 年威比奖文化网站类五位官方提名者之一。",
  },
  {
    id: "negotiated",
    titleEn: "Negotiated Intelligence",
    titleZh: "协商智能",
    years: "2025 - 2026",
    textEn: "As an official Pavilion in The Wrong Biennale 2025-2026 Edition, we learn from artists who confront, collaborate with and question AI, and who are willing to show us how the process unfolds.",
    textZh: "作为 The Wrong Biennale 2025-2026 的官方展馆，我们向那些直面人工智能、与之协作并向它发问的艺术家学习，他们愿意向我们展示这个过程如何展开。",
  },
  {
    id: "unfinished",
    titleEn: "Unfinished Archive: The Life of An Automatic Visual Artist",
    titleZh: "未完成的档案：一位自动视觉艺术家的一生",
    years: "2023",
    textEn: "Generative AI as an artist career tool.",
    textZh: "把生成式人工智能当作艺术家职业工具。",
  },
  {
    id: "google",
    titleEn: "Google Searches",
    titleZh: "谷歌搜索",
    years: "2019",
    textEn: "Your internet search history is a recycling bin for traces of intellectual and emotional output from your brain. Turn this E-waste into something meaningful to you.",
    textZh: "你的互联网搜索历史，是大脑智力与情感输出痕迹的回收箱。把这些电子垃圾变成对你有意义的东西。",
  },
  {
    id: "feedscanner",
    titleEn: "Feed Scanner",
    titleZh: "信息流扫描仪",
    years: "2018",
    textEn: "Scroll less & read more on Facebook with this Chrome extension.",
    textZh: "用这个 Chrome 扩展，在 Facebook 上少刷一点，多读一点。",
  },
  {
    id: "cavedance",
    titleEn: "Cave Dance",
    titleZh: "洞穴之舞",
    years: "2022 - permanent",
    textEn: "",
    textZh: "",
  },
  {
    id: "infected",
    titleEn: "Infected Instructions",
    titleZh: "被感染的指令",
    years: "2020",
    textEn: "The old world imploded from within. A new world awaits new instructions to begin. Infected Instructions calls for instructional art that reflects on and responds to the current global crises.",
    textZh: "旧世界从内部崩塌了。新世界等待新的指令来开启。Infected Instructions 征集指令艺术，反思并回应当前的全球危机。",
  },
  {
    id: "soliloquy",
    titleEn: "Soliloquy",
    titleZh: "独白",
    years: "2021",
    textEn: "A multimedia installation for mental health awareness.",
    textZh: "一件关注心理健康的多媒体装置。",
  },
  {
    id: "artempath",
    titleEn: "Art.empath.io",
    titleZh: "艺术共情",
    years: "2018",
    textEn: "An intervention in art museums to foster empathy. Presented at San Francisco Museum of Modern Art and the Anderson Collection at Stanford University.",
    textZh: "一次在美术馆中的介入，为的是唤起共情。曾在旧金山现代艺术博物馆与斯坦福大学安德森收藏馆呈现。",
  },
  {
    id: "stillirise",
    titleEn: "Still I Rise",
    titleZh: "我依然崛起",
    years: "2018",
    textEn: "Reflecting on the repetition, absurdity, and futility of everyday life.",
    textZh: "反思日常生活的重复、荒诞与徒劳。",
  },
  {
    id: "oneday",
    titleEn: "One Day",
    titleZh: "某一天",
    years: "2018 - 2020",
    textEn: "An emotional ride through performance with projection.",
    textZh: "一次借表演与投影完成的情感之旅。",
  },
  {
    id: "pingpong",
    titleEn: "Augmented Ping-Pong",
    titleZh: "增强乒乓",
    years: "2017",
    textEn: "Players must decide from three alternative realities.",
    textZh: "玩家必须在三个替代现实之间作出抉择。",
  },
];
