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
      "Chun Wang is a multidisciplinary artist and curator whose practice spans photography, visual art, and creative web projects. She has received international honors including the International Photography Awards (IPA), London International Creative Competition (LICC), Siena International Photo Awards, International Color Awards, Moscow International Foto Awards, and Passepartout Photo Prize.<br><br>Her work has been published internationally and exhibited at the United Nations Headquarters in New York, the San Francisco Museum of Modern Art (SFMOMA), Stanford University, and Harvard University, among many other venues. She is the curator of ",
    mid: ", an official pavilion of The Wrong Biennale 2025-2026, and ",
    outro: ", an Official Nominee for Best Cultural Website at the 2021 Webby Awards by the International Academy of Digital Arts and Sciences.",
  },
  zh: {
    intro:
      "王淳是一位跨领域艺术家与策展人，创作涵盖摄影、视觉艺术与创意网络项目。她曾获多项国际荣誉，包括国际摄影奖（IPA）、伦敦国际创意大赛（LICC）、锡耶纳国际摄影奖、国际色彩奖、莫斯科国际摄影奖，以及Passepartout摄影奖。<br><br>她的作品已在国际范围内出版，并在纽约联合国总部、旧金山现代艺术博物馆（SFMOMA）、斯坦福大学、哈佛大学等众多机构展出。她是《",
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
