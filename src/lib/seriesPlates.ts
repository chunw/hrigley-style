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

/**
 * TEMPORARY PLACEHOLDERS (2026-10-19): every plate entry below currently
 * points to a per-plate labeled SVG under public/book/placeholders/
 * (file name = <series>-<target name>.svg; the SVG face shows the series,
 * the plate title, its place/year line, and the target JPEG path). The
 * real JPEGs (52 files, processed locally) replace them 1:1 as soon as a
 * binary-capable upload channel is available: swap each placeholder path
 * back to the .jpg path it names and delete the placeholders folder.
 */
export const SERIES_PLATES: Record<string, CatalogItem[]> = {
  artempath: [
    plate(
      "Art.empath.io at SFMOMA", "2018 · SFMOMA, San Francisco", "2018",
      "A visitor types her response at the Art.empath.io station on the bench in front of Rothko's No.14, May 6, 2018.",
      "2018 年 5 月 6 日，一位观众在罗斯科《No.14》前的长椅上，通过 Art.empath.io 输入她的回应。",
      "/book/placeholders/artempath-sfmoma-bench.svg",
    ),
    plate(
      "The thermal printer", "2018", "2018",
      "The system's thermal printer, printing Rothko's own words for a visitor to take away.",
      "系统的热敏打印机，正在打印罗斯科的话，打印件可以带走。",
      "/book/placeholders/artempath-printer.svg",
    ),
    plate(
      "Interacting at SFMOMA", "2018 · SFMOMA, San Francisco", "2018",
      "Typing a response at the station in front of No.14.",
      "在《No.14》前的工作站输入回应。",
      "/book/placeholders/artempath-interface-sf.svg",
    ),
    plate(
      "Field documentation, SFMOMA", "2018 · SFMOMA, San Francisco", "2018",
      "Visitors discovering the system on the bench, May 6, 2018.",
      "2018 年 5 月 6 日，观众在长椅上发现并使用系统的现场记录。",
      "/book/placeholders/artempath-sfmoma-grid.svg",
    ),
    plate(
      "Viewer responses, No.14", "2018 · SFMOMA, San Francisco", "2018",
      "Sample viewer responses gathered for Rothko's No.14, shown in the system's virtual printer.",
      "为罗斯科《No.14》收集的观众回应样本，显示在系统的虚拟打印机中。",
      "/book/placeholders/artempath-responses-rothko.svg",
    ),
    plate(
      "Art.empath.io at the Anderson Collection", "2018 · Anderson Collection, Stanford University", "2018",
      "The system installed in front of Joan Mitchell's Begin, Again IV (1985), May 11, 2018.",
      "2018 年 5 月 11 日，系统安装在琼·米切尔《Begin, Again IV》（1985）之前。",
      "/book/placeholders/artempath-anderson-wide.svg",
    ),
    plate(
      "Interacting at the Anderson Collection", "2018 · Anderson Collection, Stanford University", "2018",
      "A visitor types her response in front of Mitchell's painting.",
      "一位观众在米切尔的画前输入她的回应。",
      "/book/placeholders/artempath-interface-and.svg",
    ),
    plate(
      "Artist statement and response database", "2018 · Anderson Collection, Stanford University", "2018",
      "Visualization of the artist statement and viewer response database for Begin, Again IV.",
      "《Begin, Again IV》的艺术家陈述与观众回应数据库可视化。",
      "/book/placeholders/artempath-responses-mitchell.svg",
    ),
    plate(
      "Taking the printout away", "2018 · Anderson Collection, Stanford University", "2018",
      "A visitor takes the printed response from the thermal printer.",
      "一位观众从热敏打印机取走打印出的回应。",
      "/book/placeholders/artempath-visualization.svg",
    ),
    plate(
      "Field documentation, Anderson Collection", "2018 · Anderson Collection, Stanford University", "2018",
      "Visitors engaging with the system at the Anderson Collection, May 11, 2018.",
      "2018 年 5 月 11 日，观众在安德森收藏馆与系统互动的现场记录。",
      "/book/placeholders/artempath-anderson-grid.svg",
    ),
  ],
  immemory: [
    plate(
      "IMMEMORY open call", "2020 · covid-immemory.com", "2020",
      "The open call poster of IMMEMORY: On COVID-19, published on the project's website.",
      "《IMMEMORY：新冠记忆》发布在项目网站上的公开征集海报。",
      "/book/placeholders/immemory-open-call.svg",
    ),
    plate(
      "The 25th Webby Awards nominees", "2021 · The Webby Awards", "2021",
      "IMMEMORY was one of the five official nominees for the 2021 Webby Awards in the Cultural Websites category.",
      "IMMEMORY 是 2021 年威比奖文化网站类的五位官方提名者之一。",
      "/book/placeholders/immemory-webby-nominees.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-01.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-02.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-03.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-04.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-05.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-06.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-07.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-08.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-09.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-10.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-11.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-12.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-13.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-14.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-15.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-16.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-17.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-18.svg",
    ),
    plate(
      "From the pandemic journal page", "2020 · chunwang.me", "2020",
      "An image from the artist's pandemic journal page (February 24, 2020), included here as a placeholder plate.",
      "疫情日志页配图（2020 年 2 月 24 日），此处为占位图版。",
      "/book/placeholders/immemory-journal-19.svg",
    ),
  ],
  negotiated: [
    plate(
      "The pavilion's 3D archive", "2025 · The Wrong Biennale, 7th Edition", "2025",
      "The entrance of the Negotiated Intelligence pavilion: a 3D archive of human-AI co-creation.",
      "《协商智能》展亭的入口：一个人机共创的 3D 档案。",
      "/book/placeholders/negotiated-pavilion-entrance.svg",
    ),
    plate(
      "Curator's diary page", "June 23, 2025", "2025",
      "A page from the curator's diary, June 23, 2025: on creative autonomy and the tyranny of efficiency.",
      "策展人日记的一页，2025 年 6 月 23 日，写创作自主与效率的暴政。",
      "/book/placeholders/negotiated-diary-page.svg",
    ),
    plate(
      "Awwwards nominee page", "2026 · Awwwards", "2026",
      "The pavilion site on its Awwwards nominee page: “When machines learn to make art, who can we still be?”",
      "展亭网站在 Awwwards 提名页上的呈现：“当机器学会做艺术时，我们还能成为谁？”",
      "/book/placeholders/negotiated-awwwards-nominee.svg",
    ),
  ],
  feedscanner: [
    plate(
      "Feed Scanner", "2018", "2018",
      "The Feed Scanner project visual: the scanner at work over the feed, and the reading spread it produces.",
      "Feed Scanner 的项目视觉：扫描器在信息流上工作，以及它生成的阅读版面。",
      "/book/placeholders/feedscanner-poster.svg",
    ),
    plate(
      "Scanner ON", "2018", "2018",
      "Scanner ON: the feed darkened, the scan line moving down the page.",
      "扫描开启：信息流变暗，扫描线沿页面向下移动。",
      "/book/placeholders/feedscanner-interface-1.svg",
    ),
    plate(
      "Scanner OFF", "2018", "2018",
      "Scanner OFF: the Facebook news feed as it is, ads and suggested posts included.",
      "扫描关闭：Facebook 信息流原貌，广告与推荐帖子俱在。",
      "/book/placeholders/feedscanner-interface-2.svg",
    ),
    plate(
      "The reading interface", "2018", "2018",
      "The reading interface that accompanies Feed Scanner: posts laid out like the pages of a book.",
      "与 Feed Scanner 配套的阅读界面：帖子像书页一样排布。",
      "/book/placeholders/feedscanner-interface-3.svg",
    ),
    plate(
      "Feed Scanner installed", "2018 · Stanford", "2018",
      "The work installed: the live feed on one screen, the reading interface on the other.",
      "作品的布展现场：一个屏幕是实时信息流，另一个是阅读界面。",
      "/book/placeholders/feedscanner-installation.svg",
    ),
  ],
  google: [
    plate(
      "Google Searches", "2019", "2019",
      "Frames from the silent movie whose script is a year of the artist's Google searches.",
      "无声电影的画面：它的剧本是艺术家一年的谷歌搜索记录。",
      "/book/placeholders/google-poster.svg",
    ),
    plate(
      "From the film", "2019", "2019",
      "A frame from the Google Searches film: searches as the brain's direct output to the internet.",
      "《谷歌搜索》电影的一帧：搜索是大脑直接向互联网的输出。",
      "/book/placeholders/google-film-still.svg",
    ),
    plate(
      "From the film", "2019", "2019",
      "“Train ticket to Madrid from Barcelona”: the searches of a trip, projected as a silent film.",
      "“从巴塞罗那到马德里的火车票”：一次旅行的搜索，被放映成一部无声电影。",
      "/book/placeholders/google-interface.svg",
    ),
    plate(
      "Making your own", "2019", "2019",
      "Following the artist's instructions, anyone can create their own Google Searches movie.",
      "按照艺术家的说明，任何人都可以制作自己的《谷歌搜索》电影。",
      "/book/placeholders/google-instructions.svg",
    ),
    plate(
      "The Waste Land, Akbank Sanat", "Akbank Sanat, Istanbul", "2019",
      "Google Searches in The Waste Land exhibition at Akbank Sanat, Istanbul.",
      "《谷歌搜索》在伊斯坦布尔 Akbank Sanat 的《The Waste Land》展览中。",
      "/book/placeholders/google-exhibition-1.svg",
    ),
    plate(
      "Exhibition documentation", "Akbank Sanat, Istanbul", "2019",
      "The work's documentation card at The Waste Land: Google Searches, 2019, in various sizes.",
      "《The Waste Land》展览中的作品信息卡：《谷歌搜索》，2019，尺寸可变。",
      "/book/placeholders/google-exhibition-2.svg",
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
  image_url: `/book/placeholders/sfmoma-death-valley-${n}.svg`,
  fallback_image_url: `/book/placeholders/sfmoma-death-valley-${n}.svg`,
}));
