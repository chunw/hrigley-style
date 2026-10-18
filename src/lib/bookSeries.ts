export interface BookSeries {
  /** When set, this entry is not a standalone section: its texts lead the named catalog chapter instead. */
  mergedInto?: string;
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
    textEn: "An online space for meditation and self-reflection, peppered with nostalgic imagery I created with mixed media, objects and photography.",
    textZh: "一个用于冥想与自我反思的线上空间，点缀着我用综合材料、物件和摄影创作的怀旧意象。",
  },
  {
    mergedInto: "shop",
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
    textEn: "As an official Pavilion in The Wrong Biennale 2025-2026 Edition, we learn from artists who confront, collaborate with and question AI, and who are willing to show us how the process unfolds.\n\nThis year I am collaborating with The Wrong Biennale to invite creative practitioners who engage in daily AI-assisted work to submit detailed records of their creative process for a single artwork. These records will be presented in a virtual exhibition pavilion titled Negotiated Intelligence, uncovering and interpreting the power dynamics embedded in AI-driven creative work: What rights and freedoms does technology grant us, and to what extent does it diminish them? Where does it expand the boundaries of creativity, and where does it erode human agency?",
    textZh: "作为 The Wrong Biennale 2025-2026 的官方展馆，我们向那些直面人工智能、与之协作并向它发问的艺术家学习，他们愿意向我们展示这个过程如何展开。\n\n今年，我与 The Wrong Biennale 合作，邀请在日常工作中使用 AI 辅助创作的实践者们，提交一件作品的详细创作过程记录。这些记录将在一个名为《协商智能》的虚拟展馆中呈现，揭示并诠释 AI 驱动的创作中所内嵌的权力关系：技术赋予我们什么权利与自由，又在多大程度上削减它们？它在哪里拓展创造力的边界，又在哪里侵蚀人的主体性？",
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
    textEn: "Your internet search history is a recycling bin for traces of intellectual and emotional output from your brain. Turn this E-waste into something meaningful to you.\n\nGoogle search entries, as direct output from my brain speaking to the internet, approximate my train of thoughts and feelings better than anything else. Creating and watching a silent movie in which the script is entirely made up of my own Google search entries of this year is an out-of-world experience. At one moment I feel ashamed of some of my searches, the next moment they make me proud because of where they lead.",
    textZh: "你的互联网搜索历史，是大脑智力与情感输出痕迹的回收箱。把这些电子垃圾变成对你有意义的东西。\n\n谷歌搜索条目是我大脑直接对互联网说的话，它们比任何东西都更接近我的思路与感受。制作并观看一部无声电影——它的剧本完全由我这一年的谷歌搜索条目组成——是一种超乎现实的体验。这一刻我为自己的一些搜索感到羞耻，下一刻又为它们通向的地方感到自豪。",
  },
  {
    id: "feedscanner",
    titleEn: "Feed Scanner",
    titleZh: "信息流扫描仪",
    years: "2018",
    textEn: "FeedScanner is a Chrome extension that automatically scrolls down your Facebook news feed while scanning it. As it scans through the feed, the extension filters out all the irrelevant ads and suggested posts by Facebook that contaminate your feed. The content you would care about - posts from friends, family and your trusted news sources - are transferred to a much cleaner interface which necessitates more focused reading.\n\nFeedScanner eliminates all the distracting aspects of the Internet - multimedia, interactivity, hyperlinking, searchability, recommendations, and infinite scrolling, all of which are put out there by tech companies for the sake of \"user friendliness\" and \"user engagement\". In reality, however, all these irrelevant features are competing for our attention and constantly disrupting us from paying sustained attention to what really matters.\n\nThe reading interface that accompanies FeedScanner liberates users from the outward train of passing stimuli in order to engage their attention more deeply with an inward flow of words, emotions, and ideas, an ability that many Internet users have been gradually losing due to long-time training of our brains to do more \"efficient\" reading on the Internet.",
    textZh: "FeedScanner 是一个 Chrome 扩展，它会自动向下滚动你的 Facebook 信息流并进行扫描。扫描时，它会滤掉 Facebook 塞进信息流的无关广告和推荐帖子。你真正关心的内容——朋友、家人和可信新闻来源的帖子——会被转移到一个干净得多的界面里，让你不得不更专注地阅读。\n\nFeedScanner 消除互联网所有分散注意力的面向：多媒体、互动性、超链接、可搜索性、推荐和无限滚动——这些都是科技公司以“用户友好”和“用户参与”为名放进来的。实际上，这些无关的功能都在争夺我们的注意力，不断打断我们对真正重要之事的持续关注。\n\n与 FeedScanner 配套的阅读界面，把用户从向外涌来的刺激链条中解放出来，让注意力更深入地投入向内的文字、情感与思想的流动——这种能力，许多互联网用户在被长期训练成在网上做更“高效”的阅读之后，正在逐渐丧失。",
  },
  {
    id: "cavedance",
    titleEn: "Cave Dance",
    titleZh: "洞穴之舞",
    years: "2022 - permanent",
    textEn: "Cave Dance (www.cavedance.art) is a website work commissioned by Harvard CAMLab. It was an honor to work with a group of wonderful researchers and creatives who were dedicated to integrating humanistic research with cutting-edge technology and design to explore innovative ways of showcasing art, culture and history.\n\nCave Dance as an immersive installation experience has been featured in the public visits to CAMLab at Harvard. It is an interdisciplinary project that uses digital technologies such as human-machine collaboration, motion capture, AI, and CG to revive the music and dance depicted in the Dunhuang cave paintings. This online space is intended to be both a way of exploring the possibilities of artistic expression based on academic databases, and a place for viewers to read and re-read the works or to understand and examine the process of creation.",
    textZh: "《洞穴之舞》（www.cavedance.art）是一件受哈佛 CAMLab 委托的网站作品。能与一群出色的研究者和创作者合作是我的荣幸，他们致力于把人文研究与前沿技术和设计结合，探索展示艺术、文化与历史的创新方式。\n\n作为一种沉浸式装置体验，《洞穴之舞》曾在哈佛 CAMLab 的公众开放参观中呈现。这是一个跨学科项目，使用人机协作、动作捕捉、人工智能与 CG 等数字技术，让敦煌壁画中的音乐与舞蹈重现。这个线上空间既是探索基于学术数据库的艺术表达可能性的方式，也是观众阅读、重读作品，或理解与审视创作过程的场所。",
  },
  {
    id: "infected",
    titleEn: "Infected Instructions",
    titleZh: "被感染的指令",
    years: "2020",
    textEn: "\"Infected Instructions\" is an online archive where people share their creative responses to the changing crisis through instructional art following the legacy of Fluxus event scores in the 1960s.\n\nIts prompt: \"The old world imploded from within. A new world awaits new instructions to begin. 'Infected' with a sense of urgency and a desire for change, we welcome instructional art that can help us reflect on our past errors, respond to the present crises, and envision a different future.\"",
    textZh: "《被感染的指令》是一个线上档案，人们通过指令艺术分享自己对不断变化的危机的创造性回应，延续 1960 年代激浪派事件乐谱（event scores）的传统。\n\n它的征集题面写道：“旧世界从内部崩塌了。新世界等待新的指令来开启。带着紧迫感与改变的渴望——被‘感染’——我们欢迎这样的指令艺术：帮助我们反思过去的错误，回应当下的危机，并设想一个不同的未来。”",
  },
  {
    id: "soliloquy",
    titleEn: "Soliloquy",
    titleZh: "独白",
    years: "2021",
    textEn: "A multimedia installation for mental health awareness.\n\nThis layered project started as a series of watercolor paintings, and has since evolved into a multimedia installation with many more components: a video sculpture / installation, prints of video stills, and a Project Book containing the backstory, the original paintings and the script used in the video. Viewers are invited to enjoy the conversations between the video, the paintings and the mini-sculptures, or simply experience it as a temple for meditation and reflection. Presented at Atlantic Gallery, Chelsea, New York, April 22 - May 8, 2021.",
    textZh: "一件关注心理健康的多媒体装置。\n\n这个层层展开的项目始于一个水彩绘画系列，后来演变为一件包含许多新组成部分的多媒体装置：影像雕塑/装置、影像静帧的印刷品，以及一本收有背景故事、原作绘画和影像脚本的 Project Book。观众可以欣赏影像、绘画与微型雕塑之间的对话，或者干脆把它当作一座冥想与反思的庙宇来体验。2021 年 4 月 22 日至 5 月 8 日，展于纽约切尔西的 Atlantic Gallery。",
  },
  {
    id: "artempath",
    titleEn: "Art.empath.io",
    titleZh: "艺术共情",
    years: "2018",
    textEn: "Art.empath.io is an interactive system which installs in front of an artwork in exhibition in a modern/contemporary art museum and encourages more visitor engagement with the art on display. At the start of the interaction, the viewer sees on a digital display a printout sliding out of a virtual printer, prompting the viewer to type in his commentary about the artwork he is viewing. When the viewer submits his response, the printout slides back into the virtual printer. After pausing for a few seconds, a thermal receipt printer nearby produces on paper a piece of commentary about the same artwork from a previous viewer or the artwork's creator. The user is invited to take away the physical printout from the printer.\n\nThe problem with modern and contemporary art is that with their extensive use of abstraction and increased emphasis on conceptual art, it has made the task of absorbing and resonating with artworks difficult on the audience. Art.empath.io was my proposed solution for stirring empathy and opening dialogues between the artist and the viewer as well as among viewers themselves.\n\nA critical part of this project was to test the design in the real world to see if the public resonate with the idea and how they actually engage with this work. To this end, I put the system on an unauthorized show at SFMOMA on the bench in front of one of Rothko's famous color field paintings, No.14. With generous support from the staff of Anderson Collection at Stanford University, I was also able to put the system on an official exhibition in front of Joan Mitchell's abstract painting of 1985, Begin, Again IV.",
    textZh: "Art.empath.io 是一个互动系统，安装在现代/当代美术馆展出的一件作品前面，鼓励观众更多地与展出的艺术互动。互动开始时，观众在数字屏幕上看到一张打印纸从一台虚拟打印机中滑出，提示他输入对眼前作品的评论。观众提交回应后，打印纸滑回虚拟打印机。停顿几秒后，旁边一台热敏小票打印机在纸上打印出另一位观众或作品创作者对同一件作品的评论。观众可以把这张纸质打印带走。\n\n现代与当代艺术的问题在于，它们大量使用抽象、越来越强调观念，使观众难以真正吸收作品并与之共鸣。Art.empath.io 是我提出的解决方案：唤起共情，在艺术家与观众之间、观众与观众之间开启对话。\n\n这个项目关键的一步，是把设计放到真实世界中测试，看公众是否对这个想法有共鸣、他们实际上如何与作品互动。为此，我把这套系统未经许可地放在了 SFMOMA，摆在罗斯科著名的色域绘画《No.14》前的长椅上。在斯坦福大学安德森收藏馆工作人员的慷慨支持下，我也得以把系统正式展出在琼·米切尔 1985 年的抽象绘画《Begin, Again IV》前面。",
  },
  {
    id: "stillirise",
    titleEn: "Still I Rise",
    titleZh: "我依然崛起",
    years: "2018",
    textEn: "Video edited from found footage, reflecting on the repetitive, absurd, and futile part of everyday life. Duration: 5'5\".",
    textZh: "由现成影像（found footage）剪辑而成，反思日常生活中重复、荒诞与徒劳的部分。时长 5 分 5 秒。",
  },
  {
    id: "oneday",
    titleEn: "One Day",
    titleZh: "某一天",
    years: "2018 - 2020",
    textEn: "\"One Day\" (total length: 4 min 19 sec) is a video portrait of a person with depression, featuring my own performance and use of projection as part of the set design. A shoutout to all who battle, or have battled depression to find meaning of life.",
    textZh: "《某一天》（全长 4 分 19 秒）是一件以抑郁为题的影像肖像，由我本人表演，并把投影用作舞台设计的一部分。向所有正在与抑郁战斗、或曾经战斗过、为寻找生命意义的人致意。",
  },
  {
    id: "pingpong",
    titleEn: "Augmented Ping-Pong",
    titleZh: "增强乒乓",
    years: "2017",
    textEn: "Augmented Ping Pong: Multi-mode ping-pong table made interactive with sensors, Arduino, Processing and projector. Players must decide from three alternative realities.",
    textZh: "增强乒乓：一张多模式乒乓桌，用传感器、Arduino、Processing 和投影仪变得可以互动。玩家必须在三个替代现实之间作出抉择。",
  },
  {
    id: "interview",
    titleEn: "Artist Interview",
    titleZh: "艺术家访谈",
    years: "Shoutout Atlanta",
    textEn: "<strong>Hi Chun, why did you decide to pursue a creative path?</strong>\n\nArt, for me, is not just a form of expression but a mode of exploration and discovery. It's a vessel that carries observations, emotions, narratives, and debates. In this realm, I find myself assuming various roles - sometimes as an archaeologist, delving into historical realities to unearth the roots of contemporary issues, and at other times as an astronaut, venturing into uncharted territories of imagination and creativity.\n\nThe multidimensional nature of art is what draws me to it. Jean Mignot's late fourteenth-century quote, 'Art without knowledge is nothing,' profoundly resonates with me. It encapsulates my belief that art transcends mere aesthetic appeal and is deeply intertwined with knowledge and understanding. This philosophy guides my artistic endeavors, as I strive to create works that are not only visually captivating but also intellectually stimulating.\n\nMy journey in art is characterized by a refusal to be confined to a single role or medium. I embrace the roles of a curator, researcher, designer, and engineer, akin to being fluent in multiple languages of creativity. This versatility allows me to approach art from various perspectives, enriching my work and enabling me to engage with a diverse audience. By blending knowledge with aesthetics, my aim is to create art that invites viewers not just to see, but to think, reflect, and engage in a deeper dialogue with the world around them.\n\n<strong>Can you open up a bit about your work and career? We're big fans and we'd love for our community to learn more about your work.</strong>\n\nI endeavor to make my art not just a display of skill, but a fusion of thought-provoking concepts and emotional resonance. My unique path from a software engineer to an artist has given me a distinct perspective, allowing me to blend the precision of technology with the fluidity of art.\n\nMy journey began in the structured world of computer science, where I learned to appreciate the elegance of algorithms. However, my heart was always drawn to the unbounded creativity of studio art. This duality often led to an identity crisis as an artist - am I a technologist or an artist? I realized that I don't have to choose; instead, I can be a bridge connecting these two worlds.\n\nFinding my voice in art wasn't straightforward. The constant evolution of media and technology posed challenges, but also opened up new avenues for expression. Integrating traditional artistic techniques with digital innovations was a complex but rewarding endeavor. One of the significant challenges was ensuring my art remained authentic and not just a product of technological novelty.\n\nI've learned that art is not just about the end product but the process and intention behind it. Embracing AI and other technological tools, like GPT, has been enlightening. I experimented by using AI to critique my paintings, which was challenging since the essence of painting transcends mere words. This experiment taught me about the different perspectives AI can offer, enhancing my understanding of my own work.\n\nHowever, I've also pondered the implications of relying on AI for artistic critique - what do I gain, and what do I potentially lose? It's a delicate balance between utilizing technology as a tool and retaining the irreplaceable value of human creativity. This contemplation is an ongoing journey for me, as I explore the intrinsic worth of human artists in an era saturated with AI-generated content.\n\nAs art historian Hal Foster insightfully declared, \"the ideal medium of archival art is the mega-archive of the Internet\". Looking forward, I am excited about redefining archival art. I envision it not just as a retrospective collection but as a dynamic conversation between the past, present, and future. Memory and immemory. I still have the dream about the internet that it fashions distracted viewers into engaged discussants (here there is nothing passive about the word \"archival\"). My aim is to make art that connects seemingly unrelated elements, sparking curiosity and discussion.\n\nIn essence, my brand and story are about this continuous exploration and integration - of technology with tradition, of data with emotion, and of the past with the future. I want to be known as an artist who didn't just adapt to the digital age but used it to redefine what art could be.\n\n<strong>If you had a friend visiting you, what are some of the local spots you'd want to take them around to?</strong>\n\nI will take my friends on a food tour around the city, including diverse eateries such as Lashevet, Awash Ethiopian Restaurant, and Uyghur Cuisine. Food tasting is a great way to explore the sensory dimension of cityscapes, with focus on touch and smell, but also presents an interdisciplinary approach to urban sensescapes coming from anthropology, aesthetics, theory of architecture, art and design research, psychophysiology, ethology, analytic chemistry, etc. Between restaurant reservations we can discuss the book Food and the City by Ina Yalof, in which amazing cooks, chefs, street vendors and artisans tell their unique stories. NYC is a culinary metropolis, and I think the oral history about NYC's dynamic food culture is very telling about the city's spirit.\n\n<strong>Shoutout is all about shouting out others who you feel deserve additional recognition and exposure. Who would you like to shoutout?</strong>\n\nI want to extend my thanks to SFMoMA who featured seven pieces of my original artworks early in my career. They saw in me an artist who would carry forward my ideas and this gave me the courage to explore and push the boundaries of my creativity. The engagement with the SFMoMA curatorial team was a catalyst for a significant shift in my artistic direction, steering me towards a more conceptual approach.\n\nBeyond institutional support, I am deeply appreciative of the supportive individuals in my life who have consistently encouraged my creative pursuits. After moving to New York City, I've been fortunate to connect with like-minded creative friends, with whom I have formed fulfilling and enriching partnerships. Their insights, critiques, and encouragement have been a constant source of inspiration and motivation, stretching my projects in new dimensions.\n\nThese experiences underscore a fundamental truth in the world of art - that while the act of creating may be solitary, the journey of an artist is a tapestry woven from numerous collaborations, influences, and supportive gestures. For this, I am deeply grateful.",
    textZh: "<strong>你为什么决定走上创作这条路？</strong>\n\n对我来说，艺术不只是一种表达方式，更是一种探索与发现的方式。它是一个容器，承载着观察、情感、叙事与辩论。在这个领域里，我扮演着各种角色：有时是考古学家，深入历史现实，挖掘当代问题的根源；有时是宇航员，进入想象与创造的未知疆域。\n\n艺术的多维性正是最吸引我的地方。让·米尼奥（Jean Mignot）十四世纪末的那句话——“没有知识的艺术，什么都不是”——深深打动了我。它概括了我的信念：艺术超越单纯的审美吸引力，与知识和理解深深交织。这一理念指引着我的艺术实践，我努力创作的作品不仅在视觉上引人入胜，也在智识上发人深省。\n\n我的艺术之旅的特点，是拒绝被单一的角色或媒介框住。我欣然接受策展人、研究者、设计师和工程师这些角色，就像流利地使用多种创造的语言。这种多面性让我能从不同角度接近艺术，丰富我的作品，也让我能与多样的观众交流。通过把知识与美学融合，我希望创作出的艺术能邀请观众不只是观看，而是思考、反思，并与周围的世界展开更深的对话。\n\n<strong>能谈谈你的工作和职业吗？我们很喜欢你的作品，也希望我们的社区能更多了解它。</strong>\n\n我努力让我的艺术不只是技艺的展示，而是发人深省的观念与情感共鸣的融合。我从软件工程师到艺术家的独特道路给了我独特的视角，让我能把技术的精确与艺术的流动结合起来。\n\n我的旅程始于结构化的计算机科学世界，在那里我学会了欣赏算法的优雅。然而我的心一直被工作室艺术的无边界创造力吸引。这种双重性常常带来身份危机：我是技术人，还是艺术家？我意识到我不必二选一，我可以做一座连接这两个世界的桥。\n\n在艺术中找到自己的声音并不容易。媒介与技术的不断演变带来了挑战，也打开了新的表达途径。把传统艺术技法与数字创新结合，过程复杂，但收获丰厚。其中一个重大的挑战，是确保我的艺术保持真实，而不只是技术新奇的产物。\n\n我领悟到，艺术不只是最终的成品，更在于背后的过程与意图。拥抱 AI 和其他技术工具（比如 GPT）让我受益良多。我曾尝试用 AI 点评我的绘画，这很有挑战性，因为绘画的本质超越了文字。这个实验让我了解到 AI 能提供的不同视角，增进了我对自己作品的理解。\n\n不过我也在思考，依赖 AI 做艺术批评意味着什么：我得到了什么，又可能失去了什么？在把技术当作工具，与保留人类创造力不可替代的价值之间，需要一种微妙的平衡。这种思考对我来说是一个持续的旅程，我在探索，在这个被 AI 生成内容充斥的时代里，人类艺术家的内在价值。\n\n正如艺术史家哈尔·福斯特（Hal Foster）敏锐地指出的：“档案艺术的理想媒介是互联网这个超级档案（mega-archive）。”展望未来，我很兴奋能重新定义档案艺术。我设想它不只是一个回顾性的收藏，而是过去、现在与未来之间一场动态的对话。记忆与遗忘（Memory and immemory）。我仍然怀有一个关于互联网的梦想：它能把走神的观众变成积极的讨论者——在这里，“档案”这个词里没有一丝被动的意味。我的目标是创作能连接看似不相干元素的艺术，激发好奇与讨论。\n\n总而言之，我的品牌和故事讲的就是这种持续的探索与整合：技术与传统，数据与情感，过去与未来。我希望被记住的，是一位不只是适应了数字时代、而是借它重新定义了艺术可能性的艺术家。\n\n<strong>如果有朋友来找你玩，你会带他去哪些本地好去处转转？</strong>\n\n我会带朋友来一趟全城美食之旅，去各种各样的餐馆，比如 Lashevet、Awash 埃塞俄比亚餐厅、新疆菜（Uyghur Cuisine）。品尝食物是探索城市景观感官维度的好方式，侧重触觉与嗅觉；它也呈现了一种跨学科的城市感官景观（sensscape）研究路径，涉及人类学、美学、建筑理论、艺术与设计研究、心理生理学、动物行为学、分析化学等。在各个预订之间，我们可以聊聊伊娜·雅洛夫（Ina Yalof）的《Food and the City》（美食与城市），书里出色的厨师、街头小贩和手艺人在讲述他们独特的故事。纽约是一座美食大都会，我认为，为纽约充满活力的饮食文化做的口述史，非常能说明这座城市的精神。\n\n<strong>Shoutout 的传统是向你觉得值得更多认可和曝光的人喊话。你想感谢谁？</strong>\n\n我想感谢旧金山现代艺术博物馆（SFMoMA），他们在我职业生涯早期收录了我的七件原创作品。他们在我身上看到了一位能把自己的想法坚持下去的艺术家，这给了我探索和突破创造力边界的勇气。与 SFMoMA 策展团队的交流，是我艺术方向上一场重大转变的催化剂，引导我走向更观念性的创作路径。\n\n除了机构的支持，我也深深感激我生活中那些一直鼓励我创作的人们。搬到纽约之后，我有幸结识了志同道合的创意朋友，与他们建立了充实而富有收获的合作关系。他们的见解、批评和鼓励，一直是灵感和动力的恒常源泉，让我的项目伸展到新的维度。\n\n这些经历印证了艺术世界的一个基本事实：创作的行为或许是孤独的，但艺术家的旅程，是一幅由无数合作、影响和支持的姿态织成的挂毯。为此，我深深感激。",
  },
  {
    id: "residuals",
    titleEn: "Residuals",
    titleZh: "残留",
    years: "",
    textEn: "Residuals is a watercolor series about the traces and objects of everyday life, and the beauty found in them.\n\nExhibited in Forms Before Dissolving, Apsara Studio Gallery, London, 2026.",
    textZh: "《残留》是一个关于日常生活痕迹与物件的水彩系列，记下其中的美。\n\n参展：Forms Before Dissolving，Apsara Studio Gallery，伦敦，2026。",
    mergedInto: "watercolor-split",
  },
  {
    id: "stillthings",
    titleEn: "Still Things",
    titleZh: "静物",
    years: "",
    textEn: "",
    textZh: "",
    mergedInto: "watercolor-split",
  },
  {
    id: "road",
    titleEn: "Notes from the Road",
    titleZh: "旅途笔记",
    years: "",
    textEn: "",
    textZh: "",
    mergedInto: "watercolor-split",
  },
];
