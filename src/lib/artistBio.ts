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
      "Born in China and now based in New York as a US immigrant, Chun Wang is a multidisciplinary artist, technologist and curator working across photography, art, and creative web projects. With formal training in fine arts and a career at the heart of the internet industry, she holds a rare dual vantage point — her firsthand experience of how the internet operates from the inside informs an art practice that examines those same systems, structures, and power dynamics with uncommon authority. Her work has been recognized through international awards such as International Photography Awards, London International Creative Competition, Siena International Photo Awards, International Color Awards, Moscow International Foto Award, and Passepartout Photo Prize. She has also published her work in books, and exhibited at art galleries worldwide along with leading institutions including the United Nations, SFMOMA, Stanford University and Harvard University. Her notable curatorial projects include ",
    mid: ", part of The Wrong Biennale 2025–2026 edition, and ",
    outro: ", an Official Nominee for 2021 Webby Awards in the Best Cultural Website category.",
  },
  zh: {
    intro:
      "王淳生于中国，现旅居纽约，是一位跨领域艺术家、技术艺术家与策展人，其创作横跨摄影、视觉艺术与创意网络项目。她受过系统的艺术训练，同时深耕于互联网行业一线。这一罕见的双重身份赋予她一种独特的内部视角——她不是以旁观者的姿态审视技术，而是身处其中，以艺术之眼叩问那些定义当代生活的系统、结构与权力关系。她的作品曾获多项国际奖项认可，包括：国际摄影奖(IPA)、伦敦国际创意大赛(LICC)、锡耶纳国际摄影奖、国际色彩奖、莫斯科国际摄影奖及Passepartout摄影奖等。她的作品已出版成书，并在全球多家画廊及重要艺术文化机构展出，包括联合国纽约总部、旧金山现代艺术博物馆(SFMOMA)、斯坦福大学安德森当代艺术收藏馆及哈佛大学CAMLab Cave展览馆等。她的重要策展项目包括《",
    mid: "》，为The Wrong Biennale（错误双年展，全球最大的数字艺术双年展）2025–2026届官方展馆；以及《",
    outro: "》，该项目获2021年互联网最高荣誉奖项 - 韦比奖(Webby Awards)最佳文化网站类别官方提名。",
  },
} as const;

export function artistBioHTML(lang: "en" | "zh"): string {
  const s = artistBioSegments[lang];
  const p1 = artistBioProjects.negotiatedIntelligence.name;
  const p2 = artistBioProjects.immemory.name;
  return `${s.intro}<em>${p1}</em>${s.mid}<em>${p2}</em>${s.outro}`;
}
