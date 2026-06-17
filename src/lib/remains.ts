export const catalogMeta = {
  en: "Remains",
  zh: "遗迹",
  medium: "Mixed Media",
  mediumZh: "综合媒材",
  description: "Official Selection for 2024 London International Creative Competition (LICC) in Create/Art category, Remains was a mixed media series born from a subtle sense of the absurd. While studying ancient terracotta figurines, I was captivated by their familiar, awkward, and caught mid-nothing expressions, making them perfect companions for the mundane modern office. ",
  descriptionZh: "《遗迹》系列曾入选伦敦国际创意大赛(LICC)艺术创作组别。系列灵感源自世界各地博物馆的藏品、展陈与物质痕迹，作品以拼贴、水彩、墨线与数字合成并置不同时空的视觉语法，将不同文明中的陶俑形像与当代平面语言重组为同一画面。通过碎片的重组、比例的错置与材质的叠加，在现代艺术的当下性与过往文明的多元美学之间建立一种非线性连续，让观看成为一次跨时间的触碰，使过去不再是玻璃柜中的标本，而是参与当下意义生产的共作者。",
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
    medium: "Mixed Media",
    mediumZh: "综合媒材",
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
    medium: "Mixed Media",
    mediumZh: "综合媒材",
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
    medium: "Mixed Media",
    mediumZh: "综合媒材",
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
    medium: "Mixed Media",
    mediumZh: "综合媒材",
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
    medium: "Mixed Media",
    mediumZh: "综合媒材",
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
    medium: "Mixed Media",
    mediumZh: "综合媒材",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
];

export function getRemainsWork(id: string): RemainsWork | undefined {
  return remainsWorks.find((w) => w.id === id);
}
