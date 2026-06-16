export const catalogMeta = { en: "In the Spirit of the21st Century", zh: "21世纪精神", medium: "Mixed Media", mediumZh: "综合媒材" };

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
    title: "Climate Collapse & The War Against Powered Interest",
    titleZh: "最后的交易",
    printInCatalog: true,
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
    title: "Information Overload & Surveillance Capitalism",
    titleZh: "画像",
    printInCatalog: true,
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
    title: "The Attention Economy",
    titleZh: "被俘",
    printInCatalog: true,
    year: "2025",
    medium: "",
    mediumZh: "",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
];

export function getSpiritWork(id: string): SpiritWork | undefined {
  return spiritWorks.find((w) => w.id === id);
}
