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
    mid: ", an official pavilion of the 2025-2026 Wrong Biennale and a Silver Award winner in the Arts & Culture Websites category at the 21st Annual w3 Awards, and ",
    outro: ", an Official Nominee for Best Cultural Website at the 2021 Webby Awards. Her curatorial work consistently centers on individuals in the midst of the upheavals of their time, tracing how they comprehend, absorb, and transform the disruption around them.<br><br>Her work has been exhibited internationally at venues including the United Nations Headquarters in New York, the San Francisco Museum of Modern Art, the CAMLab CAVE immersive lab at Harvard University, and the Anderson Collection at Stanford University, and has received international recognition including the International Photography Awards, London International Creative Competition, Siena International Photo Awards, International Color Awards, and Moscow International Foto Awards. Her work has also been featured in print, including Artsin Square's 5x7 Photobook (Vol. 1, 2025; Vol. 2, 2026) and the Passepartout Photo Prize Catalogue.",
  },
  zh: {
    intro:
      "王淳是一位跨领域艺术家与策展人，创作涵盖摄影、视觉艺术与创意网络项目。她曾获多项国际荣誉，包括国际摄影奖（IPA）、伦敦国际创意大赛（LICC）、锡耶纳国际摄影奖、国际色彩奖、莫斯科国际摄影奖，以及Passepartout摄影奖。<br><br>她的作品已在国际范围内出版，并在纽约联合国总部、旧金山现代艺术博物馆、斯坦福大学、哈佛大学等众多机构展出。她是《",
    mid: "》的策展人，该项目为The Wrong Biennale 2025–2026届官方展馆；以及《",
    outro: "》，由国际数字艺术与科学学院提名，荣获2021年韦比奖（Webby Awards）最佳文化网站类别官方提名。",
  },
} as const;

export function artistBioHTML(lang: "en" | "zh"): string {
  const s = artistBioSegments[lang];
  const p1 = artistBioProjects.negotiatedIntelligence.name;
  const p2 = artistBioProjects.immemory.name;
  return `${s.intro}<em>${p1}</em>${s.mid}<em>${p2}</em>${s.outro}`;
}
