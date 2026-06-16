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
    titleZh: "遗存 其一",
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
    title: "Remains No. 2",
    titleZh: "遗存 其二",
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
    title: "Remains No. 3",
    titleZh: "遗存 其三",
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
    title: "Remains No. 4",
    titleZh: "遗存 其四",
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
    id: "5",
    title: "Remains No. 5",
    titleZh: "遗存 其五",
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
    id: "6",
    title: "Remains No. 6",
    titleZh: "遗存 其六",
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

export function getRemainsWork(id: string): RemainsWork | undefined {
  return remainsWorks.find((w) => w.id === id);
}
