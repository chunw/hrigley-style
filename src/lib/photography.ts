export const catalogMeta = {
  en: "Photography",
  zh: "摄影作品",
  medium: "Photography",
  mediumZh: "摄影",
  description: "Chun Wang's photographic practice treats the camera as a philosophical instrument. She places the four existential givens — death, loneliness, freedom, and meaninglessness — within the structural tensions of the digital age and unfolds them there. Her work has been recognized by the International Photography Awards (IPA), Siena International Photo Awards, International Color Awards, and the Passepartout Photo Prize.",
  descriptionZh: "Chun Wang的摄影实践将相机视为哲学仪器。她将死亡、孤独、自由与无意义这四重存在命题，置于数字时代的结构性张力中展开演绎。她的作品曾其创作曾获国际摄影奖（IPA）、锡耶纳国际摄影奖、国际色彩大奖、及Passepartout摄影奖等荣誉。",
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
  {
    id: "5",
    title: "",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },
  {
    id: "6",
    title: "",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },
  {
    id: "7",
    title: "",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },
  {
    id: "8",
    title: "",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },
  {
    id: "9",
    title: "All the world is a stage",
    titleZh: "",
    printInCatalog: false,
    year: "2023",
    medium: "Photography",
    mediumZh: "摄影作品",
    description: "Teatro Colón, Buenos Aires",
    descriptionZh: "",
  },
  {
    id: "10",
    title: "",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },
  {
    id: "11",
    title: "",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },
  {
    id: "12",
    title: "",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },
  {
    id: "13",
    title: "",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },
];

export function getPhotographyWork(id: string): PhotographyWork | undefined {
  return photographyWorks.find((w) => w.id === id);
}
