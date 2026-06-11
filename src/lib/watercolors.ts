export interface WatercolorSeries {
  id: string;
  label: string;        // e.g. "SERIES I"
  englishName: string;  // e.g. "Breakfast"
  chineseName: string;  // e.g. "早餐"
  subtitle: string;     // short description shown in catalog header
  subtitleZh?: string;
}

export const seriesList: WatercolorSeries[] = [
  {
    id: "I",
    label: "SERIES I",
    englishName: "Breakfast Residuals",
    chineseName: "早餐残留",
    subtitle: "Works 1–2 · Breakfast Residuals",
    subtitleZh: "第1–2件 · 早餐残留",
  },
  {
    id: "II",
    label: "SERIES II",
    englishName: "Still Things",
    chineseName: "静物",
    subtitle: "Works 3–11 · Still Things",
    subtitleZh: "第3–11件 · 静物",
  },
];

export interface Watercolor {
  id: string;
  title: string;
  titleZh?: string;
  series: string;
  printInCatalog?: boolean;
  showInStorefront?: boolean;
  displayOrder?: number;
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

export const watercolors: Watercolor[] = [
  // 早餐残留
  {
    id: "1",
    title: "Breakfast Residuals #1",
    titleZh: "早餐残留 其一",
    series: "I",
    printInCatalog: true,
    showInStorefront: true,
    displayOrder: 1,
    year: "2026",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "9 × 12 in (22.9 × 30.5 cm)",
    dimensionsZh: "9 × 12 英寸（22.9 × 30.5 厘米）",
    description:
      "",
    descriptionZh:
      "",
    price: 95,
      paylink: "https://www.paypal.com/ncp/payment/PLACEHOLDER",
  },
  {
    id: "2",
    title: "Breakfast Residuals #2",
    titleZh: "早餐残留 其二",
    series: "I",
    printInCatalog: true,
    showInStorefront: true,
    displayOrder: 2,
    year: "2026",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description:
      "",
    descriptionZh:
      "",
  },

  {
    id: "7",
    title: "Breakfast Residuals #3",
    titleZh: "早餐残留 其三",
    series: "II",
    printInCatalog: true,
    showInStorefront: true,
    displayOrder: 3,
    year: "2026",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "8",
     title: "Breakfast Residuals #4",
    titleZh: "早餐残留 其四",
    series: "II",
    printInCatalog: true,
    showInStorefront: true,
    displayOrder: 4,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },

  // 静物
  {
    id: "3",
    title: "Still Things #1",
    titleZh: "静物 其一",
    series: "II",
    printInCatalog: true,
    showInStorefront: true,
    displayOrder: 5,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "From the home-as-museum series. A salvaged trinket rearranged into a new scene.",
    descriptionZh: "「馆藏目录」系列。一件打捞来的小物，被重新排列成新的景观现场。",
  },
  {
    id: "4",
    title: "Still Things #2",
    titleZh: "静物 其二",
    series: "II",
    printInCatalog: true,
    showInStorefront: true,
    displayOrder: 6,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Exploring the grotesque and tender qualities of domestic objects.",
    descriptionZh: "探索日常物件兼具怪诞与温柔的双重气质。",
  },
  {
    id: "5",
    title: "Still Things #3",
    titleZh: "静物 其三",
    series: "II",
    printInCatalog: true,
    showInStorefront: true,
    displayOrder: 7,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Transparency of watercolor meets the oddity of a found object.",
    descriptionZh: "水彩的透明性与拾得物的奇异感在此相遇。",
  },
  {
    id: "6",
    title: "Still Things #4",
    titleZh: "静物 其四",
    series: "II",
    printInCatalog: true,
    showInStorefront: true,
    displayOrder: 8,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Continues the private museum practice — arranging and recording.",
    descriptionZh: "延续「私人博物馆」的工作方式——排列，记录。",
  },
  
  {
    id: "9",
    title: "Still Things #7",
    titleZh: "静物 其七",
    series: "II",
    printInCatalog: true,
    showInStorefront: true,
    displayOrder: 9,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Highlighted work balancing serenity with slight unease.",
    descriptionZh: "重点作品，宁静与隐约不安之间保持着微妙的平衡。",
  },
];

export function getWatercolor(id: string): Watercolor | undefined {
  return watercolors.find((w) => w.id === id);
}
