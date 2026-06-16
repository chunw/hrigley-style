export const catalogMeta = {
  en: "Remains",
  zh: "遗迹",
  medium: "Mixed Media",
  mediumZh: "综合媒材",
  description: "Official Selection for 2024 London International Creative Competition (LICC) in Create/Art category, Remains was a mixed media series born from a subtle sense of the absurd. While studying ancient terracotta figurines, I was captivated by their familiar, awkward, and caught mid-nothing expressions, making them perfect companions for the mundane modern office. ",
  descriptionZh: "《遗迹》系列曾入选伦敦国际创意大赛(LICC) 艺术创作组别。它诞生于一种淡淡的荒诞感：在研究那些古代陶俑时，我被它们那种亲切、笨拙又风趣的样子吸引。它们看起来不像什么伟大的纪念碑，倒像是一个个人在“无所事事”的瞬间被定格，很具有耐人寻味的想象空间，因此正合适放在当代无聊的办公室场景里。",
};

export interface RemainsWork {
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

export const remainsWorks: RemainsWork[] = [
  {
    id: "1",
    title: "Remains No. 1",
    titleZh: "遗迹 其一",
    printInCatalog: true,
    printInCatalogImage: "1",
    year: "2025",
    medium: "",
    mediumZh: "",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "2",
    title: "Remains No. 2",
    titleZh: "遗迹 其二",
    printInCatalog: true,
    printInCatalogImage: "1",
    year: "2025",
    medium: "",
    mediumZh: "",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "3",
    title: "Remains No. 3",
    titleZh: "遗迹 其三",
    printInCatalog: true,
    printInCatalogImage: "1",
    year: "2025",
    medium: "",
    mediumZh: "",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "4",
    title: "Remains No. 4",
    titleZh: "遗迹 其四",
    printInCatalog: true,
    printInCatalogImage: "1",
    year: "2025",
    medium: "",
    mediumZh: "",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "5",
    title: "Remains No. 5",
    titleZh: "遗迹 其五",
    printInCatalog: true,
    printInCatalogImage: "1",
    year: "2025",
    medium: "",
    mediumZh: "",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "6",
    title: "Remains No. 6",
    titleZh: "遗迹 其六",
    printInCatalog: true,
    printInCatalogImage: "1",
    year: "2025",
    medium: "",
    mediumZh: "",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
];

export function getRemainsWork(id: string): RemainsWork | undefined {
  return remainsWorks.find((w) => w.id === id);
}
