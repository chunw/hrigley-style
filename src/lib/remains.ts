export const catalogMeta = {
  en: "Remains",
  zh: "遗迹",
  medium: "Mixed Media",
  mediumZh: "综合媒材",
  description: `<p><a href="https://www.licc.uk/winners/winner.php?id=2-36390-25&OS=true" target="_blank">2024 London International Creative Competition (LICC) Official Selection · Create/Art</a>. The Remains series borrows its visual grammar from museum-collected figurines such as terracotta soldiers, grave goods, archaeological clay forms from different civilizations and historical periods, and drops them without explanation into the theater of contemporary daily life: the office, the quarterly review, the performance metric.</p>`,
  descriptionZh: `<p><a href="https://www.licc.uk/winners/winner.php?id=2-36390-25&OS=true" target="_blank">2024年伦敦国际创意大赛（LICC）官方入选 · 艺术创作类</a>。《遗迹》系列从博物馆馆藏人俑中借取视觉语法——陶俑兵马、随葬器物、来自不同文明与历史时期的考古陶土形态——将它们不加解释地投入当代日常生活的剧场：办公室、季度述职、绩效指标。</p>`,
};

export interface RemainsWork {
  id: string;
  title: string;
  titleZh?: string;
  showInStorefront?: boolean;
  printInCatalog?: boolean;
  printInCatalogImage?: string;
  includeInArtbox?: boolean;
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
    showInStorefront: false,
    printInCatalogImage: "1",
    year: "2024",
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
    showInStorefront: false,
    printInCatalogImage: "1",
    year: "2024",
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
    showInStorefront: false,
    printInCatalogImage: "1",
    year: "2024",
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
    showInStorefront: false,
    printInCatalogImage: "1",
    year: "2024",
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
    showInStorefront: false,
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
    showInStorefront: false,
    printInCatalogImage: "1",
    year: "2024",
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
