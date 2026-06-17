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
      "Born in China and now residing in New York, Chun Wang is a multidisciplinary artist, technology artist and curator, whose practice spans photography, visual arts, and creative web projects. She received systematic arts training and works at the frontline of the internet industry. This rare dual identity gives her a unique insider perspective — she does not examine technology as an outside observer, but from within it, using an artist's eye to interrogate the systems, structures, and power relations that define contemporary life. Her work has been recognized by numerous international awards, including: International Photography Awards (IPA), London International Creative Competition (LICC), Siena International Photo Awards, International Color Awards, Moscow International Photo Award, and Passepartout Photo Prize. Her work has been published in books and exhibited at galleries and major cultural institutions worldwide, including the United Nations Headquarters in New York, San Francisco Museum of Modern Art (SFMOMA), Stanford University's Anderson Collection, and Harvard University's CAMLab Cave. Her notable curatorial projects include ",
    mid: ", an official venue of The Wrong Biennale (the world's largest digital art biennale), 2025–2026 edition, and ",
    outro: ", an Official Nominee for the Best Cultural Website category at the 2021 Webby Awards — one of the internet's highest honors.",
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
