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
    title: "The Distance Between Us",
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
    title: "The Last Bargain",
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
    title: "Profile",
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
    title: "Captive",
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
