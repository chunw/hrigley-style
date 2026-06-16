export const catalogMeta = { en: "Photography", zh: "摄影作品", medium: "Photography", mediumZh: "摄影" };

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
    title: "Highland Scottlands: The heroism of the vista",
    titleZh: "苏格兰高地：视域的英雄主义",
    printInCatalog: true,
    year: "2024",
    medium: "Photography",
    mediumZh: "摄影作品",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "2",
    title: "In the lonely hours",
    titleZh: "孤独时刻",
    printInCatalog: true,
    year: "2023",
    medium: "Photography",
    mediumZh: "摄影作品",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "3",
    title: "Rebirth",
    titleZh: "重生",
    printInCatalog: true,
    year: "2023",
    medium: "Photography",
    mediumZh: "摄影作品",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "4",
    title: "Hours, Minutes",
    titleZh: "小时，分钟",
    printInCatalog: true,
    year: "2025",
    medium: "Photography",
    mediumZh: "摄影作品",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
];

export function getPhotographyWork(id: string): PhotographyWork | undefined {
  return photographyWorks.find((w) => w.id === id);
}
