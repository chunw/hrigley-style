export const catalogMeta = {
  en: "In the Spirit of the 21st Century",
  zh: "21世纪精神",
  medium: "Mixed Media",
  mediumZh: "综合媒材",
  description: "2021 London International Creative Competition (LICC) Finalist · Create/Art. An ongoing series of figurative interpretations of contemporary sociopolitical and cultural issues, drawing inspiration from current news and sociology research.",
  descriptionZh: "2021年伦敦国际创意大赛（LICC）决赛入围 · 艺术创作类。《21世纪精神》将当代核心社会议题与研究数据转译为人物与场景，试图在快速流动的时代里，打捞一种可被观看、被共感的21世纪精神图景。",
};

export interface SpiritWork {
  id: string;
  title: string;
  titleZh?: string;
  printInCatalog?: boolean;
  printInCatalogImage?: string;
  year: string;
  medium: string;
  mediumZh?: string;
  dimensions?: string;
  dimensionsZh?: string;
  description?: string;
  descriptionZh?: string;
  price?: number;
  paylink?: string;
}

export const spiritWorks: SpiritWork[] = [
  {
    id: "1",
    title: "Alone Together",
    titleZh: "我们之间的距离",
    printInCatalog: true,
    year: "2021",
    medium: "Mixed Media",
    mediumZh: "综合媒材",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "2",
    title: "Climate Collapse & The War Against Powered Interest",
    titleZh: "最后的交易",
    printInCatalog: true,
    year: "2021",
    medium: "Mixed Media",
    mediumZh: "综合媒材",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "3",
    title: "Information Overload & Surveillance Capitalism",
    titleZh: "画像",
    printInCatalog: true,
    year: "2021",
    medium: "Mixed Media",
    mediumZh: "综合媒材",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "4",
    title: "The Attention Economy",
    titleZh: "被俘",
    printInCatalog: true,
    year: "2021",
    medium: "Mixed Media",
    mediumZh: "综合媒材",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
];

export function getSpiritWork(id: string): SpiritWork | undefined {
  return spiritWorks.find((w) => w.id === id);
}
