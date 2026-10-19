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
      "Chun Wang is a multidisciplinary artist, technologist, and curator based in New York City, working across photography, painting, art objects, and web-based projects. Her practice focuses on the entanglement of technology, power structures, and lived experience, exploring how individuals perceive, record, and negotiate systemic forces. Through Chun Wang Studio SHOP, she also turns her art into slightly useful objects for everyday life. She was previously Lead Creative Technologist and Strategy Researcher at Harvard University's FAS CAMLab.<br><br>She is the curator and developer of ",
    mid: ", an official pavilion of the 2025-2026 Wrong Biennale and a Silver Award winner in the Arts & Culture Websites category at the <a href=\"https://www.w3award.com/\" target=\"_blank\" rel=\"noreferrer\">21st Annual w3 Awards</a>, and ",
    outro: ", an Official Nominee for Best Cultural Website at the 2021 Webby Awards. Her curatorial work consistently centers on individuals in the midst of the upheavals of their time, tracing how they comprehend, absorb, and transform the disruption around them.<br><br>Her work has been exhibited internationally at venues including the United Nations Headquarters in New York, the San Francisco Museum of Modern Art, the CAMLab CAVE immersive lab at Harvard University, and the Anderson Collection at Stanford University, and has received international recognition including the International Photography Awards, London International Creative Competition, Siena International Photo Awards, International Color Awards, and Moscow International Foto Awards. Her work has also been featured in print, including Artsin Square's 5x7 Photobook (Vol. 1, 2025; Vol. 2, 2026) and the Passepartout Photo Prize Catalogue.",
  },
  zh: {
    intro:
      "王淳是一位常驻纽约的跨领域艺术家、技术专家与策展人，创作涵盖摄影、绘画、艺术物件与网络项目。她的创作聚焦技术、权力结构与生活经验之间的纠缠，探索个体如何感知、记录系统性力量，并与之协商。她还通过 Chun Wang Studio SHOP，把艺术做成日常生活中略微有用的物件。她此前曾任哈佛大学 FAS CAMLab 首席创意技术专家与战略研究员。<br><br>她是《",
    mid: "》的策展人与开发者，该项目是 2025–2026 年 The Wrong Biennale 的官方展馆，并获第 21 届 w3 Awards 艺术与文化网站类别银奖；她也是《",
    outro: "》，该项目获 2021 年韦比奖最佳文化网站官方提名。她的策展工作始终关注身处时代剧变之中的个体，追踪他们如何理解、吸收并转化周遭的动荡。<br><br>她的作品曾在多地展出，包括纽约联合国总部、旧金山现代艺术博物馆、哈佛大学 CAMLab CAVE 沉浸式实验室与斯坦福大学安德森收藏馆，并获多项国际荣誉，包括国际摄影奖、伦敦国际创意大赛、锡耶纳国际摄影奖、国际色彩奖与莫斯科国际摄影奖。她的作品也曾刊于纸面出版物，包括 Artsin Square 的《5x7 Photobook》（第 1 卷，2025 年；第 2 卷，2026 年）与 Passepartout 摄影奖目录。",
  },
} as const;

export function artistBioHTML(lang: "en" | "zh"): string {
  const s = artistBioSegments[lang];
  const p1 = artistBioProjects.negotiatedIntelligence.name;
  const p2 = artistBioProjects.immemory.name;
  return `${s.intro}<em>${p1}</em>${s.mid}<em>${p2}</em>${s.outro}`;
}
