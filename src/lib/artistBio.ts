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
      "Chun Wang is a multidisciplinary artist, technologist and curator working across photography, art, and creative web projects. Her work has been recognized through international awards such as International Photography Awards (1×), London International Creative Competition (4×), Siena International Photo Awards (1×), International Color Awards (5×), Moscow International Foto Award (1×), and Passepartout Photo Prize (1×). She has also published her work in books, and exhibited at art galleries worldwide along with leading institutions including the United Nations, SFMOMA, Stanford University and Harvard University. Her notable curatorial projects include ",
    mid: ", part of The Wrong Biennale 2025–2026 edition, and ",
    outro: ", an Official Nominee for 2021 Webby Awards in the Best Cultural Website category.",
  },
  zh: {
    intro:
      "王淳是一位跨领域艺术家、技术创作者与策展人，其创作横跨摄影、视觉艺术与创意网络项目。她的作品曾获多项国际奖项认可，包括：国际摄影奖（1次）、伦敦国际创意大赛（4次）、锡耶纳国际摄影奖（1次）、国际色彩奖（5次）、莫斯科国际摄影奖（1次）及Passepartout Photo Prize（1次）。她的作品已出版成书，并在全球多个画廊及艺术机构展出，包括联合国、旧金山现代艺术博物馆(SFMOMA)、斯坦福大学及哈佛大学。她的重要策展项目包括《",
    mid: "》，为The Wrong Biennale 2025–2026届参展项目；以及《",
    outro: "》，该项目获2021年韦比奖最佳文化网站类别官方提名。",
  },
} as const;

export function artistBioHTML(lang: "en" | "zh"): string {
  const s = artistBioSegments[lang];
  const p1 = artistBioProjects.negotiatedIntelligence.name;
  const p2 = artistBioProjects.immemory.name;
  return `${s.intro}<em>${p1}</em>${s.mid}<em>${p2}</em>${s.outro}`;
}
