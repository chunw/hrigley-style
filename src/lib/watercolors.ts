export const catalogMeta = { en: "Visions in Watercolor", zh: "水彩视界", medium: "Watercolor", mediumZh: "水彩" };

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
    englishName: "Residuals",
    chineseName: "残留",
    subtitle: "Works 1–2 · Residuals",
    subtitleZh: "第1–2件 · 残留",
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
  printInCatalogImage?: string;
  showInStorefront?: boolean;
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
  // 残留
  {
    id: "1",
    title: "Residuals #1",
    titleZh: "残留 其一",
    series: "I",
    printInCatalog: true,
    showInStorefront: true,
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
  },{
    id: "3",
     title: "Residuals #3",
    titleZh: "残留 其三",
    series: "I",
    printInCatalog: true,
    showInStorefront: true,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "From the home-as-museum series. A salvaged trinket rearranged into a new scene.",
    descriptionZh: "「馆藏目录」系列。一件打捞来的小物，被重新排列成新的景观现场。",
  },
  {
    id: "2",
    title: "Residuals #2",
    titleZh: "残留 其二",
    series: "I",
    printInCatalog: true,
    showInStorefront: true,
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
    title: "Residuals #4",
    titleZh: "残留 其四",
    series: "I",
    printInCatalog: true,
    showInStorefront: true,
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
     title: "Residuals #5",
    titleZh: "残留 其五",
   series: "I",
    printInCatalog: true,
    showInStorefront: true,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "10",
    title: "Residuals #6",
    titleZh: "残留 其六",
   series: "I",
    printInCatalog: true,
    printInCatalogImage: "1",
    showInStorefront: true,
    year: "2026",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
{
    id: "13",
     title: "Residuals #7",
    titleZh: "残留 其七",
    series: "I",
    printInCatalog: false,
    printInCatalogImage: "1",
    showInStorefront: true,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Highlighted work balancing serenity with slight unease.",
    descriptionZh: "重点作品，宁静与隐约不安之间保持着微妙的平衡。",
  },

  // 静物
  
  {
    id: "4",
    title: "Still Things #2",
    titleZh: "静物 其二",
    series: "II",
    printInCatalog: false,
    showInStorefront: true,
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
    printInCatalogImage: "2",
    showInStorefront: true,
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
    printInCatalogImage: "1",
    showInStorefront: true,
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
    printInCatalog: false,
    showInStorefront: true,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Highlighted work balancing serenity with slight unease.",
    descriptionZh: "重点作品，宁静与隐约不安之间保持着微妙的平衡。",
  },

  {
    id: "11",
    title: "Still Things #7",
    titleZh: "静物 其七",
    series: "II",
    printInCatalog: false,
    showInStorefront: true,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Highlighted work balancing serenity with slight unease.",
    descriptionZh: "重点作品，宁静与隐约不安之间保持着微妙的平衡。",
  },

  {
    id: "12",
    title: "Still Things #7",
    titleZh: "静物 其七",
    series: "II",
    printInCatalog: false,
    showInStorefront: true,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Highlighted work balancing serenity with slight unease.",
    descriptionZh: "重点作品，宁静与隐约不安之间保持着微妙的平衡。",
  },

  {
    id: "14",
    title: "Still Things #8",
    titleZh: "静物 其八",
    series: "II",
    printInCatalog: false,
    showInStorefront: true,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Highlighted work balancing serenity with slight unease.",
    descriptionZh: "重点作品，宁静与隐约不安之间保持着微妙的平衡。",
  },

  {
    id: "15",
    title: "Still Things #9",
    titleZh: "静物 其九",
    series: "II",
    printInCatalog: false,
    showInStorefront: true,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Highlighted work balancing serenity with slight unease.",
    descriptionZh: "重点作品，宁静与隐约不安之间保持着微妙的平衡。",
  },

  {
    id: "16",
    title: "Still Things #10",
    titleZh: "静物 其十",
    series: "II",
    printInCatalog: false,
    showInStorefront: true,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Highlighted work balancing serenity with slight unease.",
    descriptionZh: "重点作品，宁静与隐约不安之间保持着微妙的平衡。",
  },

  {
    id: "17",
    title: "Still Things #11",
    titleZh: "静物 其十一",
    series: "II",
    printInCatalog: false,
    showInStorefront: true,
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
