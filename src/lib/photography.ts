export interface PhotographyWork {
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

export const photographyWorks: PhotographyWork[] = [
  {
    id: "1",
    title: "Photography No. 1",
    titleZh: "摄影 其一",
    printInCatalog: true,
    year: "2025",
    medium: "Photography",
    mediumZh: "摄影",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "2",
    title: "Photography No. 2",
    titleZh: "摄影 其二",
    printInCatalog: true,
    year: "2025",
    medium: "Photography",
    mediumZh: "摄影",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "3",
    title: "Photography No. 3",
    titleZh: "摄影 其三",
    printInCatalog: true,
    year: "2025",
    medium: "Photography",
    mediumZh: "摄影",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "4",
    title: "Photography No. 4",
    titleZh: "摄影 其四",
    printInCatalog: true,
    year: "2025",
    medium: "Photography",
    mediumZh: "摄影",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
];

export function getPhotographyWork(id: string): PhotographyWork | undefined {
  return photographyWorks.find((w) => w.id === id);
}
