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
    title: "21 Spirit No. 1",
    titleZh: "廿一灵 其一",
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
    title: "21 Spirit No. 2",
    titleZh: "廿一灵 其二",
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
    title: "21 Spirit No. 3",
    titleZh: "廿一灵 其三",
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
    title: "21 Spirit No. 4",
    titleZh: "廿一灵 其四",
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
