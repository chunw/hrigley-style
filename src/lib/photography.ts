export const catalogMeta = {
  en: "Photography",
  zh: "摄影作品",
  medium: "Photography",
  mediumZh: "摄影",
  description: "Placeholder description for Photography.",
  descriptionZh: "《摄影作品》占位描述文字。",
};

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
    description: "2024 London International Creative Competition (LICC) Shortlist · Photo/Video",
    descriptionZh: "2024年伦敦国际创意大赛（LICC）入围短名单 · 影像类",
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
    description: "16th International Color Awards Official Nominee · Portrait · 2022 International Photography Awards (IPA) Official Selection",
    descriptionZh: "第16届国际色彩大奖官方提名 · 肖像 · 2022年国际摄影奖（IPA）官方入选",
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
    description: "15th International Color Awards Official Nominee · Fine Art",
    descriptionZh: "第15届国际色彩大奖官方提名 · 纯艺术",
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
    description: "18th International Color Awards Honorable Mention · Portrait",
    descriptionZh: "第18届国际色彩大奖荣誉奖 · 肖像",
  },
];

export function getPhotographyWork(id: string): PhotographyWork | undefined {
  return photographyWorks.find((w) => w.id === id);
}
