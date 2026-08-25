export const catalogMeta = {
  en: "Remains",
  zh: "遗迹",
  medium: "Mixed Media",
  mediumZh: "综合媒材",
  description: `<p>The Remains series borrows its visual grammar from museum-collected figurines such as terracotta soldiers, grave goods, archaeological clay forms from different civilizations and historical periods, and drops them without explanation into the theater of contemporary daily life: the office, the quarterly review, the performance metric.</p><p>Where In the Spirit of the 21st Century makes its critique directly and earnestly, Remains makes the same critique sideways, through deadpan absurdity. The implication runs in both directions: from a sufficient distance, corporate daily life looks very much like every other civilization's daily life; and the past, brought close, looks surreal.</p>`,
  descriptionZh: `<p>《遗迹》系列从博物馆馆藏人俑中借取视觉语法——陶俑兵马、随葬器物、来自不同文明与历史时期的考古陶土形态——将它们不加解释地投入当代日常生活的剧场：办公室、季度述职、绩效指标。</p><p>《21世纪精神》以直接而认真的方式展开批评，而《遗迹》则从侧面以冷面荒诞完成同样的批评。这种隐喻双向延伸：从足够远的距离望去，企业日常生活与其他所有文明的日常生活并无二致；而当过去被拉近，它便显得超现实。</p>`,
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
