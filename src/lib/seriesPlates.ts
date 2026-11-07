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
  titleZh?: string,
): CatalogItem => ({
  title,
  ...(titleZh ? { titleZh } : {}),
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
      "Installation view, in front of Rothko's No.14, May 6, 2018.",
      "展览现场，罗斯科《No.14》前，2018 年 5 月 6 日。",
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
      "Installation view, in front of Rothko's No.14.",
      "展览现场，罗斯科《No.14》前。",
      "/book/artempath/interface-sf.jpg",
    ),
    plate(
      "Field documentation, SFMOMA", "2018 · SFMOMA, San Francisco", "2018",
      "Installation view, May 6, 2018.",
      "展览现场，2018 年 5 月 6 日。",
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
      "Installation view, in front of Joan Mitchell's Begin, Again IV (1985), May 11, 2018.",
      "展览现场，琼·米切尔《Begin, Again IV》（1985）前，2018 年 5 月 11 日。",
      "/book/artempath/anderson-wide.jpg",
    ),
    plate(
      "Interacting at the Anderson Collection", "2018 · Anderson Collection, Stanford University", "2018",
      "Installation view, in front of Mitchell's painting.",
      "展览现场，米切尔的画前。",
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
      "Installation view; a visitor collects the printed response.",
      "展览现场，一位观众取走打印出的回应。",
      "/book/artempath/visualization.jpg",
    ),
    plate(
      "Field documentation, Anderson Collection", "2018 · Anderson Collection, Stanford University", "2018",
      "Installation view, May 11, 2018.",
      "展览现场，2018 年 5 月 11 日。",
      "/book/artempath/anderson-grid.jpg",
    ),
  ],
  immemory: [
    plate(
      "IMMEMORY open call", "2020", "2020",
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
      "The pavilion's opening screen", "2025 · The Wrong Biennale, 7th Edition", "2025",
      "The opening screen of the Negotiated Intelligence website: a robotic arm at work in the 3D archive, beneath the words 'I am human'.",
      "《协商智能》网站的首屏：3D 档案空间里，机械臂正在工作，上方是「I am human」的字样。",
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
    plate(
      "Elsewhere Gallery", "Daria Belkina · The Wrong Biennale, 7th Edition", "2025",
      "Elsewhere Gallery by Daria Belkina: the tiled gallery interior that holds her moving-image work, as the pavilion's 3D archive presents it.",
      "Daria Belkina 的《Elsewhere Gallery》：一间瓷砖画廊的内部，陈列着艺术家的影像作品，是它在展亭 3D 档案中的样子。",
      "/book/negotiated/work-elsewhere.jpg",
    ),
    plate(
      "Ave Maria", "Marie Le Moigne · The Wrong Biennale, 7th Edition", "2025",
      "Ave Maria by Marie Le Moigne: the work's process layers in the archive, from self-portrait and AI prompt to print and embroidery.",
      "Marie Le Moigne 的《Ave Maria》：作品在档案中的流程图层，从自拍、AI 提示词，一路到打印与刺绣。",
      "/book/negotiated/work-ave-maria.jpg",
    ),
    plate(
      "Fractured Star Projections", "Aaron Oldenburg · The Wrong Biennale, 7th Edition", "2025",
      "Fractured Star Projections by Aaron Oldenburg: the artist's handwritten notes and star-projection diagrams, layered in the archive.",
      "Aaron Oldenburg 的《Fractured Star Projections》：艺术家的手写笔记与星图投影，在档案里层层叠放。",
      "/book/negotiated/work-fractured-star.jpg",
    ),
    plate(
      "Silence is not the Absence of Speech", "Margarita Wenzel · The Wrong Biennale, 7th Edition", "2025",
      "Silence is not the Absence of Speech by Margarita Wenzel: a one-channel soundpiece performed by a designed voice, its phrases radiating across the archive layer.",
      "Margarita Wenzel 的《Silence is not the Absence of Speech》：一件由设计出的声音演绎的单声道声音作品，语句在档案图层上放射开来。",
      "/book/negotiated/work-silence.jpg",
    ),
    plate(
      "Chimera Haiku", "Marcie Begleiter · The Wrong Biennale, 7th Edition", "2025",
      "Chimera Haiku by Marcie Begleiter: the work's dated haiku journal pages and images, layered in the archive.",
      "Marcie Begleiter 的《Chimera Haiku》：作品里带日期的俳句日志页与影像，在档案中层层展开。",
      "/book/negotiated/work-chimera-haiku.jpg",
    ),
    plate(
      "Dierenleven", "Vero Szűcs and Max Noichl · The Wrong Biennale, 7th Edition", "2025",
      "Dierenleven by Vero Szűcs and Max Noichl: the vintage animal book Dierenleven in Artis, set beside the work's prompt layers in the archive.",
      "Vero Szűcs 与 Max Noichl 的《Dierenleven》：老动物图鉴《Dierenleven in Artis》的原书，与作品的提示词层并置在档案里。",
      "/book/negotiated/work-dierenleven.jpg",
    ),
    plate(
      "Mythology", "Slitrobo · The Wrong Biennale, 7th Edition", "2025",
      "Mythology by Slitrobo: thirty audiovisual pieces arranged as a wheel of spherical specimens, the robot artist's work as it sits in the archive.",
      "Slitrobo 的《Mythology》：30 件视听作品排成一圈球体标本，这位机器人艺术家的作品在档案中的样子。",
      "/book/negotiated/work-mythology.jpg",
    ),
  ],
  feedscanner: [
    plate(
      "Feed Scanner", "2018", "2018",
      "The Feed Scanner project visual: the scanner at work over the feed, and the reading spread it produces.",
      "Feed Scanner 的项目视觉：扫描器在信息流上工作，以及它生成的阅读版面。",
      "/book/feedscanner/poster.jpg",
      "信息流扫描仪",
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
      "Installation view: the live feed on one screen, the reading interface on the other.",
      "展览现场：一个屏幕是实时信息流，另一个是阅读界面。",
      "/book/feedscanner/installation.jpg",
    ),
  ],
  google: [
    plate(
      "Google Searches", "2019", "2019",
      "Frames from the silent movie whose script is a year of the artist's Google searches.",
      "无声电影的画面：它的剧本是艺术家一年的谷歌搜索记录。",
      "/book/google/poster.jpg",
      "谷歌搜索",
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
  // Placeholder section for the two 2018 works (The Loss of Childhood · The
  // Mundane Details of Life): for now its only plate is a full-page screenshot
  // of the Loss of Childhood series website, standing between the two works'
  // texts, CatalogBook holds the Mundane Details text back and emits it
  // right after this plate (see Chapter.essayAfterPlate).
  earlyline: [
    plate(
      "The Loss of Childhood", "2017 – 2018", "2018",
      "The Loss of Childhood, series website, full-page screenshot, captured 2026. Nine works, 2017–2018.",
      "《消失的童年》系列网站全页截图，2026 年截取。系列共九件，2017–2018。",
      "/book/earlyline/lost-series-page.png",
      "消失的童年",
    ),
  ],
  // Slightly Useful Objects opens the "shop" chapter (Visions in Ceramics is
  // merged into it). Unlike the other keys in this record, this array is not
  // rendered as its own series chapter: CatalogBook prepends it to the shop
  // chapter's catalog plates, in this order, at the artist's request
  // (2026-10-24). Images are from her own Instagram posts and reels.
  // Captions carry each work's name, medium and exhibition facts wherever
  // her posts and shop records give them (her rule, 2026-10-24); where no
  // formal title is on record the plate keeps the series name.
  shop: [
    plate(
      "Slightly Useful Objects", "2026 · Video still · 视频截图", "2026",
      "A melting clock drapes over the counter of a miniature café, hand-built in polymer clay. Video still from the artist's Instagram reel, September 29, 2026.",
      "一只融化的钟搭在聚合物粘土手工捏制的微型咖啡馆柜台上。视频截图，取自艺术家的 Instagram 短片，2026 年 9 月 29 日。",
      "/book/suo/clock-frame.jpg",
    ),
    plate(
      "Slightly Useful Objects", "2026 · Photograph · 照片", "2026",
      "A strawberry shortcake earring from the Slightly Useful Objects series, worn. Hand-sculpted polymer clay. Photograph from the artist's Instagram post, October 10, 2026.",
      "Slightly Useful Objects 系列的草莓短蛋糕耳环佩戴图，手工捏制的聚合物粘土。照片取自艺术家的 Instagram 帖子，2026 年 10 月 10 日。",
      "/book/suo/earring.jpg",
    ),
    plate(
      "Slightly Useful Objects", "2026 · Photograph · 照片", "2026",
      "Two hand-sculpted polymer clay rings, worn: a bacon-and-egg ring and a strawberry shortcake ring. From the post that introduced the Slightly Useful Objects series, September 12, 2026.",
      "两枚手工捏制的聚合物粘土戒指，佩戴中：一枚培根蛋，一枚草莓短蛋糕。出自介绍 Slightly Useful Objects 系列的那条帖子，2026 年 9 月 12 日。",
      "/book/suo/hands.jpg",
    ),
    plate(
      "Slightly Useful Objects", "2026 · Video still · 视频截图", "2026",
      "Strawberry shortcake earrings resting on oyster shells at the artist's stall, Lately Cafe local market near Court Square station, October 10, 2026. Video still from the artist's Instagram reel.",
      "草莓短蛋糕耳环放在牡蛎壳上，在艺术家的摊位上。Lately Cafe 本地市集（Court Square 站附近），2026 年 10 月 10 日。视频截图，取自艺术家的 Instagram 短片。",
      "/book/suo/market-still.jpg",
    ),
    plate(
      "Leaky Boundaries: After Hours Altar 渗漏的边界：下班后的祭坛", "2026 · Stoneware · 炻器", "2026",
      "A tiny worker asleep beside his computer, beneath a leaning pink candle. Hand-built stoneware with glaze, candle, dried grass and miniature figures, approx. 5 × 8 × 18 in. Exhibited in Leaky Boundaries, the ceramics group exhibition of the 13th LIC Open Art Festival, New York. Photograph from the artist's Instagram post, September 24, 2026.",
      "一个小职员在电脑旁睡去，头顶斜倚着一支粉色蜡烛。手建炻器，施釉，配蜡烛、干草与微型人偶，约 5 × 8 × 18 英寸。曾展于纽约第 13 届 LIC Open Art Festival 的陶瓷群展《Leaky Boundaries》。照片取自艺术家的 Instagram 帖子，2026 年 9 月 24 日。",
      "/book/suo/candle.jpg",
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
  titleZh: "死亡谷的倒影",
  metaLine: "2017 · SFMOMA Submission Friday",
  mediumZh: "摄影作品",
  year: "2017",
  description:
    "<p>A figure holds a reflection of the valley up to the valley itself.<br />一个人把死亡谷的倒影，举到死亡谷本身面前。</p>",
  category: "Photography",
  image_url: `/book/sfmoma/death-valley-${n}.jpg`,
  fallback_image_url: `/book/sfmoma/death-valley-${n}.jpg`,
}));

/**
 * Extra plate appended to the Remains chapter: an untitled collage dated
 * February 14, 2018, cut fragments reassembled on a single sheet. It
 * predates the Remains figurines by five years and shows the book's archive
 * method already at work, so it closes the chapter as the series' origin.
 * The artist asked for it in the book on 2026-10-25.
 */
export const REMAINS_ORIGIN_PLATES: CatalogItem[] = [
  plate(
    "谋杀情人节", "2018 · Ink and watercolor on paper", "2018",
    "Cut fragments, faces, a slumped figure, a hand, a knife, reassembled on a single sheet. Five years before the Remains figurines, the archive method of this book was already at work.",
    "剪下的碎片，面孔、瘫倒的人、一只手、一把刀，重新拼在一张纸上。比《遗迹》的陶俑早五年，本书的档案方法已经在这里了。",
    "/book/remains/collage-2018.jpg",
  ),
];

/**
 * Full-bleed spread plate for the objects chapter (her direction,
 * 2026-11-05): Pre-iPhone Era, one of the SFMOMA Submission Friday
 * works, printed across two pages with no margins. The photograph is
 * the used-electronics flat lay from her project site (titled there
 * Pre-iPhone Days); she asked for the spread to be built with this
 * image and will confirm the identification on the PR.
 */
export const PRE_IPHONE_ERA_PLATE: CatalogItem = plate(
  "Pre-iPhone Era", "2018 · SFMOMA Submission Friday", "2018",
  "Used electronics, photographed from above: a cassette Walkman, an iPod shuffle, a red compact camera, an electronic dictionary, a keypad phone, a watch and a USB drive, with a black mask at the center, joined by unspooled cassette tape.",
  "旧电子设备，俯拍：磁带随身听、iPod shuffle、红色卡片相机、电子词典、按键手机、手表和 U 盘，中间一张黑面具，被抽出的磁带连在一起。",
  "/book/sfmoma/pre-iphone-era.jpg",
);
