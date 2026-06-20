export const catalogMeta = {
  en: "Photography",
  zh: "摄影作品",
  medium: "Photography",
  mediumZh: "摄影",
  description: `My photographic practice begins with a proposition: that the camera can be a philosophical instrument. Philosophy asks its questions in language. Photography asks them in looking. In El Otro, El Mismo, the human figure arrives burdened by what only humans carry: the knowledge that they exist, that they will not always, and that neither fact explains the other. The portraits capture these existential essences: There is the loneliness that comes not from abandonment but from becoming — an act of separation from the familiar anchor is also an act of growth, and the cost of that growth is an existential solitude that is fundamental. There is time, which does not pass abstractly but is inscribed in faces, made legible in light and shadow. There is the passage from the unrestrained freedom of youth into a world that seeks to shape and contain it. And there is death, which is never only death: a body arranged in the posture of an ending can discover it is also the posture of a beginning.

Departures are not a departure from these human portraits but a change of scale. Where the portrait turns the existential inward, the landscape turns it outward, into terrain that predates the human figure and will outlast it. The emphasis falls not on nature as scenery or spectacle but on the space held between the human presence and the land that contains it. Reading towards the end of the book, the same questions surface — about proportion, about time, about what it means to be a self inside something so indifferent and so vast.`,
  descriptionZh: `我的摄影实践始于一个命题：相机可以成为一种哲学工具。哲学在语言中提问，摄影在凝视中提问。在《El Otro, El Mismo》（《另一个，同一个》）系列中，人的形体带着只有人类才能承载的重担降临：他们知道自己存在，知道这种存在终将消逝，却也知道这两个事实彼此无法解释。这些肖像捕捉了存在的本质：有一种孤独，来自成为自我的过程——与熟悉的锚点分离，亦是一种成长，而成长的代价是一种根本性的存在孤独。有时间，它不是抽象地流逝，而是铭刻在面容之上，在光与影中变得可读。有从青春无拘的自由走向一个试图塑造与约束它的世界的过程。还有死亡——它从不只是死亡：一具以终结姿态安置的躯体，或许会发现那也正是开始的姿态。

《离去》系列则并非对人物肖像的离弃，而是一种尺度的转换。若说肖像将存在之问转向内心，风景则将其转向外部——转向那片早于人类而存在、也将在人类之后延续的土地。重心不在于自然作为风景或奇观，而在于人的在场与承载它的土地之间悬置的空间。读至书的末尾，同样的问题再度浮现——关于比例，关于时间，关于在如此冷漠而辽阔的存在之中，何谓自我。`,
};

export interface PhotographySeries {
  id: string;
  englishName: string;
  chineseName: string;
  subtitle?: string;
  subtitleZh?: string;
}

export const seriesList: PhotographySeries[] = [
  {
    id: "I",
    englishName: "El Otro, El Mismo",
    chineseName: "另一个，同一个",
  },
  {
    id: "II",
    englishName: "Departures",
    chineseName: "离去",
  },
];

export interface PhotographyWork {
  id: string;
  title: string;
  titleZh?: string;
  series?: string;
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
  // El Otro, El Mismo
  {
    id: "2",
    title: "In the lonely hours",
    titleZh: "孤独时刻",
    series: "I",
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
    series: "I",
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
    series: "I",
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
    series: "I",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },
  {
    id: "8",
    title: "",
    series: "I",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },
  {
    id: "12",
    title: "",
    series: "I",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },

  // Departures
  {
    id: "1",
    title: "Highland Scottlands: The heroism of the vista",
    titleZh: "苏格兰高地：视域的英雄主义",
    series: "II",
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
    id: "6",
    title: "",
    series: "II",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },
  {
    id: "7",
    title: "",
    series: "II",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },
  {
    id: "9",
    title: "All the world is a stage",
    titleZh: "",
    series: "II",
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
    series: "II",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },
  {
    id: "11",
    title: "",
    series: "II",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },
  {
    id: "13",
    title: "",
    series: "II",
    printInCatalog: false,
    year: "",
    medium: "Photography",
    mediumZh: "摄影作品",
  },
];

export function getPhotographyWork(id: string): PhotographyWork | undefined {
  return photographyWorks.find((w) => w.id === id);
}
