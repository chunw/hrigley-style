export const artistBioProjects = {
  negotiatedIntelligence: {
    name: "Negotiated Intelligence: Unearthing Power Dynamics in Human-AI Co-Creation",
    url: "https://negotiated-intelligence.org/",
  },
  immemory: {
    name: "IMMEMORY: On COVID-19",
    url: "https://covid-immemory.com/",
  },
} as const;

export const artistBioSegments = {
  en: {
    intro:
      "Chun Wang is a multidisciplinary artist, technologist, and curator based in New York City. Her practice spans photography, painting, art objects, and digital works. With the archive as her method, she moves among ancient remains, everyday remnants, and digital records, tracing how things are preserved, forgotten, and reactivated. She was previously Lead Creative Technologist and Strategy Researcher at Harvard University's FAS CAMLab.<br><br>",
    mid: " and ",
    outro: ", both initiated, curated, and produced by her, have received international recognition: the former is an official pavilion of the seventh edition of the Wrong Biennale and received a Silver Award in the Arts and Culture Websites category at the <a href=\"https://www.w3award.com/\" target=\"_blank\" rel=\"noreferrer\">21st w3 Awards</a>; the latter was an Official Nominee in the Cultural Blog/Website category at the 25th Webby Awards. Her curatorial work consistently centers on individuals in the midst of the upheavals of their time, tracing how they comprehend, absorb, and transform the disruption around them.<br><br>Her photography has also won recognition from the International Photography Awards (IPA), the London International Creative Competition (LICC), the Siena International Photo Awards, the International Color Awards, and the Moscow International Foto Awards, among others. Her work has also been featured in print, including Artsin Square's 5x7 Photobook (Vol. 1, 2025; Vol. 2, 2026) and the Passepartout Photo Prize Catalogue. Her work has been exhibited at the United Nations Headquarters in New York, SFMOMA, Harvard University, and the Anderson Collection at Stanford University, and has also been presented in Shanghai, London, Istanbul, and Kitakyushu, among other places.",
  },
  zh: {
    intro:
      "王淳是一位多学科艺术家、工程师与策展人，现居纽约。她的创作横跨摄影、绘画、艺术物件与数字作品。她以档案为方法，在古代遗存、日常残余与数字记录之间，追踪事物如何被保存、遗忘，又被重新激活。她曾任哈佛大学文理学院 CAMLab 首席创意技术专家与战略研究员。<br><br>她发起、策展并制作的《",
    mid: "》与《",
    outro: "》均获国际奖项：前者为 The Wrong Biennale 第七届官方展馆，并获第 21 届 w3 Awards 艺术与文化类网站银奖；后者获第 25 届 Webby 奖文化类网站官方提名。她的策展工作始终以时代动荡中的个体为核心，记录他们理解、吸纳并转化外部冲击的历程。<br><br>其摄影多次获奖，包括国际摄影奖（IPA）、伦敦国际创意大赛（LICC）、锡耶纳国际摄影奖、国际色彩奖与莫斯科国际摄影奖等。她的作品还收录于 Artsin Square《5x7 Photobook》（2025、2026 两辑）与 Passepartout 摄影奖图录等出版物。作品曾在纽约联合国总部、旧金山现代艺术博物馆（SFMOMA）、哈佛大学与斯坦福大学安德森收藏馆展出，并在上海、伦敦、伊斯坦布尔与北九州等地呈现。",
  },
} as const;

export function artistBioHTML(lang: "en" | "zh"): string {
  const s = artistBioSegments[lang];
  const p1 = artistBioProjects.negotiatedIntelligence.name;
  const p2 = artistBioProjects.immemory.name;
  return `${s.intro}<em>${p1}</em>${s.mid}<em>${p2}</em>${s.outro}`;
}
