import type { CatalogItem } from "@/lib/printCatalog";

/**
 * Plates for the series sections that have no catalog of their own (the
 * Screen & Archive and Live chapters). Images live under public/book/<id>/.
 * Sources: the artist's own project site (chunwang.me), the projects' own
 * websites, and her exhibition records. Captions are bilingual, two lines,
 * following the book's caption format.
 */
const plate = (
  title: string,
  metaLine: string,
  year: string,
  en: string,
  zh: string,
  img: string,
): CatalogItem => ({
  title,
  metaLine,
  year,
  description: `<p>${en}<br />${zh}</p>`,
  category: "Series plates",
  image_url: img,
  fallback_image_url: img,
});

export const SERIES_PLATES: Record<string, CatalogItem[]> = {
  artempath: [
    plate(
      "Art.empath.io at SFMOMA", "2018 · SFMOMA, San Francisco", "2018",
      "A visitor types her response at the Art.empath.io station on the bench in front of Rothko's No.14, May 6, 2018.",
      "2018 年 5 月 6 日，一位观众在罗斯科《No.14》前的长椅上，通过 Art.empath.io 输入她的回应。",
      "/book/artempath/sfmoma-bench.jpg",
    ),
    plate(
      "The thermal printer", "2018", "2018",
      "The system's thermal printer, printing Rothko's own words for a visitor to take away.",
      "系统的热敏打印机，正在打印罗斯科的话，打印件可以带走。",
      "/book/artempath/printer.jpg",
    ),
    plate(
      "Interacting at SFMOMA", "2018 · SFMOMA, San Francisco", "2018",
      "Typing a response at the station in front of No.14.",
      "在《No.14》前的工作站输入回应。",
      "/book/artempath/interface-sf.jpg",
    ),
    plate(
      "Field documentation, SFMOMA", "2018 · SFMOMA, San Francisco", "2018",
      "Visitors discovering the system on the bench, May 6, 2018.",
      "2018 年 5 月 6 日，观众在长椅上发现并使用系统的现场记录。",
      "/book/artempath/sfmoma-grid.jpg",
    ),
    plate(
      "Viewer responses, No.14", "2018 · SFMOMA, San Francisco", "2018",
      "Sample viewer responses gathered for Rothko's No.14, shown in the system's virtual printer.",
      "为罗斯科《No.14》收集的观众回应样本，显示在系统的虚拟打印机中。",
      "/book/artempath/responses-rothko.jpg",
    ),
    plate(
      "Art.empath.io at the Anderson Collection", "2018 · Anderson Collection, Stanford University", "2018",
      "The system installed in front of Joan Mitchell's Begin, Again IV (1985), May 11, 2018.",
      "2018 年 5 月 11 日，系统安装在琼·米切尔《Begin, Again IV》（1985）之前。",
      "/book/artempath/anderson-wide.jpg",
    ),
    plate(
      "Interacting at the Anderson Collection", "2018 · Anderson Collection, Stanford University", "2018",
      "A visitor types her response in front of Mitchell's painting.",
      "一位观众在米切尔的画前输入她的回应。",
      "/book/artempath/interface-and.jpg",
    ),
    plate(
      "Artist statement and response database", "2018 · Anderson Collection, Stanford University", "2018",
      "Visualization of the artist statement and viewer response database for Begin, Again IV.",
      "《Begin, Again IV》的艺术家陈述与观众回应数据库可视化。",
      "/book/artempath/responses-mitchell.jpg",
    ),
    plate(
      "Taking the printout away", "2018 · Anderson Collection, Stanford University", "2018",
      "A visitor takes the printed response from the thermal printer.",
      "一位观众从热敏打印机取走打印出的回应。",
      "/book/artempath/visualization.jpg",
    ),
    plate(
      "Field documentation, Anderson Collection", "2018 · Anderson Collection, Stanford University", "2018",
      "Visitors engaging with the system at the Anderson Collection, May 11, 2018.",
      "2018 年 5 月 11 日，观众在安德森收藏馆与系统互动的现场记录。",
      "/book/artempath/anderson-grid.jpg",
    ),
  ],
  immemory: [
    plate(
      "IMMEMORY open call", "2020 · covid-immemory.com", "2020",
      "The open call poster of IMMEMORY: On COVID-19, published on the project's website.",
      "《IMMEMORY：新冠记忆》发布在项目网站上的公开征集海报。",
      "/book/immemory/open-call.jpg",
    ),
    plate(
      "The 25th Webby Awards nominees", "2021 · The Webby Awards", "2021",
      "IMMEMORY was one of the five official nominees for the 2021 Webby Awards in the Cultural Websites category.",
      "IMMEMORY 是 2021 年威比奖文化网站类的五位官方提名者之一。",
      "/book/immemory/webby-nominees.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-01.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-02.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-03.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-04.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-05.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-06.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-07.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-08.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-09.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-10.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-11.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-12.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-13.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-14.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-15.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-16.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-17.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-18.jpg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/immemory/journal-19.jpg",
    ),
  ],
  negotiated: [
    plate(
      "The pavilion's 3D archive", "2025 · The Wrong Biennale, 7th Edition", "2025",
      "The entrance of the Negotiated Intelligence pavilion: a 3D archive of human-AI co-creation.",
      "《协商智能》展亭的入口：一个人机共创的 3D 档案。",
      "/book/negotiated/pavilion-entrance.jpg",
    ),
    plate(
      "Curator's diary page", "June 23, 2025", "2025",
      "A page from the curator's diary, June 23, 2025: on creative autonomy and the tyranny of efficiency.",
      "策展人日记的一页，2025 年 6 月 23 日，写创作自主与效率的暴政。",
      "/book/negotiated/diary-page.jpg",
    ),
    plate(
      "Awwwards nominee page", "2026 · Awwwards", "2026",
      "The pavilion site on its Awwwards nominee page: “When machines learn to make art, who can we still be?”",
      "展亭网站在 Awwwards 提名页上的呈现：“当机器学会做艺术时，我们还能成为谁？”",
      "/book/negotiated/awwwards-nominee.jpg",
    ),
  ],
  feedscanner: [
    plate(
      "Feed Scanner", "2018", "2018",
      "The Feed Scanner project visual: the scanner at work over the feed, and the reading spread it produces.",
      "Feed Scanner 的项目视觉：扫描器在信息流上工作，以及它生成的阅读版面。",
      "/book/feedscanner/poster.jpg",
    ),
    plate(
      "Scanner ON", "2018", "2018",
      "Scanner ON: the feed darkened, the scan line moving down the page.",
      "扫描开启：信息流变暗，扫描线沿页面向下移动。",
      "/book/feedscanner/interface-1.jpg",
    ),
    plate(
      "Scanner OFF", "2018", "2018",
      "Scanner OFF: the Facebook news feed as it is, ads and suggested posts included.",
      "扫描关闭：Facebook 信息流原貌，广告与推荐帖子俱在。",
      "/book/feedscanner/interface-2.jpg",
    ),
    plate(
      "The reading interface", "2018", "2018",
      "The reading interface that accompanies Feed Scanner: posts laid out like the pages of a book.",
      "与 Feed Scanner 配套的阅读界面：帖子像书页一样排布。",
      "/book/feedscanner/interface-3.jpg",
    ),
    plate(
      "Feed Scanner installed", "2018 · Stanford", "2018",
      "The work installed: the live feed on one screen, the reading interface on the other.",
      "作品的布展现场：一个屏幕是实时信息流，另一个是阅读界面。",
      "/book/feedscanner/installation.jpg",
    ),
  ],
  google: [
    plate(
      "Google Searches", "2019", "2019",
      "Frames from the silent movie whose script is a year of the artist's Google searches.",
      "无声电影的画面：它的剧本是艺术家一年的谷歌搜索记录。",
      "/book/google/poster.jpg",
    ),
    plate(
      "From the film", "2019", "2019",
      "A frame from the Google Searches film: searches as the brain's direct output to the internet.",
      "《谷歌搜索》电影的一帧：搜索是大脑直接向互联网的输出。",
      "/book/google/film-still.jpg",
    ),
    plate(
      "From the film", "2019", "2019",
      "“Train ticket to Madrid from Barcelona”: the searches of a trip, projected as a silent film.",
      "“从巴塞罗那到马德里的火车票”：一次旅行的搜索，被放映成一部无声电影。",
      "/book/google/interface.jpg",
    ),
    plate(
      "Making your own", "2019", "2019",
      "Following the artist's instructions, anyone can create their own Google Searches movie.",
      "按照艺术家的说明，任何人都可以制作自己的《谷歌搜索》电影。",
      "/book/google/instructions.jpg",
    ),
    plate(
      "The Waste Land, Akbank Sanat", "Akbank Sanat, Istanbul", "2019",
      "Google Searches in The Waste Land exhibition at Akbank Sanat, Istanbul.",
      "《谷歌搜索》在伊斯坦布尔 Akbank Sanat 的《The Waste Land》展览中。",
      "/book/google/exhibition-1.jpg",
    ),
    plate(
      "Exhibition documentation", "Akbank Sanat, Istanbul", "2019",
      "The work's documentation card at The Waste Land: Google Searches, 2019, in various sizes.",
      "《The Waste Land》展览中的作品信息卡：《谷歌搜索》，2019，尺寸可变。",
      "/book/google/exhibition-2.jpg",
    ),
  ],
};

/**
 * Extra plates appended to the Death Valley chapter: the SFMOMA-featured
 * Reflections In The Death Valley photographs, from the artist's project
 * site. The other SFMOMA Submission Friday works' images are stored under
 * public/book/sfmoma/ for the day their placement in the book is decided.
 */
export const DEATH_VALLEY_PLATES: CatalogItem[] = [1, 2, 3].map((n) => ({
  title: "Reflections In The Death Valley",
  metaLine: "2017 · SFMOMA Submission Friday",
  year: "2017",
  description:
    "<p>A figure holds a reflection of the valley up to the valley itself.<br />一个人把死亡谷的倒影，举到死亡谷本身面前。</p>",
  category: "Photography",
  image_url: `/book/sfmoma/death-valley-${n}.jpg`,
  fallback_image_url: `/book/sfmoma/death-valley-${n}.jpg`,
}));

/**
 * Exhibition photographs the artist selected on 2026-10-19 (selection board),
 * appended at the end of their sections as plates. Files live under
 * public/book/exhibitions/ (longest side 1500px, from her exhibition records).
 * Captions are bilingual, two lines: exhibition name and year, per the list.
 * Two further selections are NOT here: their sections are undecided
 * (Global Auspicious Zodiac exhibition; One Day at Stanford Arts Experimental
 * Media Lab) — they join once placement is decided.
 */
export const EXHIBITION_PLATES: Record<string, CatalogItem[]> = {
  spirit: [
    plate(
      "LIC-A@Atlantic 2020", "2020", "2020",
      "In the Spirit of the 21st Century at LIC-A@Atlantic 2020, Atlantic Gallery, New York.",
      "《21 世纪精神》参展 LIC-A@Atlantic 2020，Atlantic Gallery，纽约。",
      "/book/exhibitions/1c622639-08.jpg",
    ),
    plate(
      "LIC-A@Atlantic 2020", "2020", "2020",
      "In the Spirit of the 21st Century at LIC-A@Atlantic 2020, Atlantic Gallery, New York.",
      "《21 世纪精神》参展 LIC-A@Atlantic 2020，Atlantic Gallery，纽约。",
      "/book/exhibitions/1c622639-11.jpg",
    ),
  ],
  photography: [
    plate(
      "Personality: Contemporary Portraiture", "2024", "2024",
      "El Otro, El Mismo (Hours, Minutes) at Personality: Contemporary Portraiture, PH21 Gallery, Budapest.",
      "《另一个，同一个》（《时，分》）参展《个性：当代肖像》，PH21 Gallery，布达佩斯。",
      "/book/exhibitions/1dd89a10-01.jpg",
    ),
    plate(
      "Personality: Contemporary Portraiture", "2022", "2022",
      "El Otro, El Mismo at Personality: Contemporary Portraiture, PH21 Gallery, Budapest.",
      "《另一个，同一个》参展《个性：当代肖像》，PH21 Gallery，布达佩斯。",
      "/book/exhibitions/26b45f99-01.jpg",
    ),
    plate(
      "Significant Colour", "2025", "2025",
      "El Otro, El Mismo at Significant Colour, PH21 Gallery, Budapest.",
      "《另一个，同一个》参展《重要的色彩》，PH21 Gallery，布达佩斯。",
      "/book/exhibitions/808bb2d0-03.jpg",
    ),
  ],
  "series:soliloquy": [
    plate(
      "LIC-A@Atlantic Spring 2021", "2021", "2021",
      "Soliloquy at LIC-A@Atlantic Spring 2021, Atlantic Gallery, New York.",
      "《独白》参展 LIC-A@Atlantic 2021 春季展，Atlantic Gallery，纽约。",
      "/book/exhibitions/25360e06-03.jpg",
    ),
  ],
  "series:negotiated": [
    plate(
      "Negotiated Intelligence Pavilion", "2025", "2025",
      "The Negotiated Intelligence pavilion, The Wrong Biennale 2025-2026 Edition.",
      "《协商智能》展亭，The Wrong Biennale 2025–2026。",
      "/book/exhibitions/2b289a10-01.jpg",
    ),
  ],
  "series:artempath": [
    plate(
      "Art.empath.io", "2018", "2018",
      "Art.empath.io at the San Francisco Museum of Modern Art, May 2018.",
      "Art.empath.io 在旧金山现代艺术博物馆，2018 年 5 月。",
      "/book/exhibitions/2fae4986-01.jpg",
    ),
    plate(
      "Art.empath.io", "2018", "2018",
      "Art.empath.io at the San Francisco Museum of Modern Art, May 2018.",
      "Art.empath.io 在旧金山现代艺术博物馆，2018 年 5 月。",
      "/book/exhibitions/2fae4986-02.jpg",
    ),
    plate(
      "Art.empath.io", "2018", "2018",
      "Art.empath.io at the San Francisco Museum of Modern Art, May 2018.",
      "Art.empath.io 在旧金山现代艺术博物馆，2018 年 5 月。",
      "/book/exhibitions/2fae4986-03.jpg",
    ),
    plate(
      "Art.empath.io", "2018", "2018",
      "Art.empath.io at the San Francisco Museum of Modern Art, May 2018.",
      "Art.empath.io 在旧金山现代艺术博物馆，2018 年 5 月。",
      "/book/exhibitions/2fae4986-04.jpg",
    ),
  ],
  shop: [
    plate(
      "Leaky Boundaries @ LIC Arts Open Festival 2026", "2026", "2026",
      "Visions in Ceramics at Leaky Boundaries, LIC Arts Open Festival, Long Island City, New York.",
      "《陶之视界》参展《泄漏的边界》，LIC Arts Open Festival，长岛市，纽约。",
      "/book/exhibitions/35389a10-11.jpg",
    ),
    plate(
      "Leaky Boundaries @ LIC Arts Open Festival 2026", "2026", "2026",
      "Visions in Ceramics at Leaky Boundaries, LIC Arts Open Festival, Long Island City, New York.",
      "《陶之视界》参展《泄漏的边界》，LIC Arts Open Festival，长岛市，纽约。",
      "/book/exhibitions/35389a10-12.jpg",
    ),
  ],
  residuals: [
    plate(
      "Forms Before Dissolving", "2026", "2026",
      "Breakfast Residuals at Forms Before Dissolving, Apsara Studio Gallery, London.",
      "《早餐残留》参展 Forms Before Dissolving，Apsara Studio Gallery，伦敦。",
      "/book/exhibitions/35389a10-01.jpg",
    ),
  ],
  "series:cavedance": [
    plate(
      "Harvard CAMLab Cave Dance", "2022", "2022",
      "Cave Dance at the Harvard CAMLab Cave, Harvard University.",
      "《窟舞》在哈佛大学 CAMLab Cave。",
      "/book/exhibitions/6e13792f-01.jpg",
    ),
    plate(
      "Harvard CAMLab Cave Dance", "2022", "2022",
      "Cave Dance at the Harvard CAMLab Cave, Harvard University.",
      "《窟舞》在哈佛大学 CAMLab Cave。",
      "/book/exhibitions/6e13792f-02.jpg",
    ),
    plate(
      "Harvard CAMLab Cave Dance", "2022", "2022",
      "Cave Dance at the Harvard CAMLab Cave, Harvard University.",
      "《窟舞》在哈佛大学 CAMLab Cave。",
      "/book/exhibitions/6e13792f-05.jpg",
    ),
  ],
  sfmoma: [
    plate(
      "San Francisco Museum of Modern Art", "2016 – 2019", "2016",
      "Featured Artist, SFMOMA Submission Friday: one of the seven works featured between 2016 and 2019.",
      "SFMOMA Submission Friday 特选艺术家：2016 至 2019 年间七次特选作品之一。",
      "/book/exhibitions/952df356-02.jpg",
    ),
    plate(
      "San Francisco Museum of Modern Art", "2016 – 2019", "2016",
      "Featured Artist, SFMOMA Submission Friday: one of the seven works featured between 2016 and 2019.",
      "SFMOMA Submission Friday 特选艺术家：2016 至 2019 年间七次特选作品之一。",
      "/book/exhibitions/952df356-03.jpg",
    ),
    plate(
      "San Francisco Museum of Modern Art", "2016 – 2019", "2016",
      "Featured Artist, SFMOMA Submission Friday: one of the seven works featured between 2016 and 2019.",
      "SFMOMA Submission Friday 特选艺术家：2016 至 2019 年间七次特选作品之一。",
      "/book/exhibitions/952df356-04.jpg",
    ),
    plate(
      "San Francisco Museum of Modern Art", "2016 – 2019", "2016",
      "Featured Artist, SFMOMA Submission Friday: one of the seven works featured between 2016 and 2019.",
      "SFMOMA Submission Friday 特选艺术家：2016 至 2019 年间七次特选作品之一。",
      "/book/exhibitions/952df356-05.jpg",
    ),
  ],
  "series:feedscanner": [
    plate(
      "Stanford Arts Departmental Show", "2018", "2018",
      "Feed Scanner at the Stanford Arts Departmental Show, Stanford Art Gallery.",
      "Feed Scanner 参展斯坦福艺术系展，Stanford Art Gallery。",
      "/book/exhibitions/cf14d2e1-01.jpg",
    ),
  ],
};
