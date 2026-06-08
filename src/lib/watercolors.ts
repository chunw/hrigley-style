export interface WatercolorSeries {
  id: string;
  label: string;        // e.g. "SERIES I"
  englishName: string;  // e.g. "Breakfast"
  chineseName: string;  // e.g. "早餐"
  subtitle: string;     // short description shown in catalog header
}

export const seriesList: WatercolorSeries[] = [
  {
    id: "I",
    label: "SERIES I",
    englishName: "Breakfast",
    chineseName: "早餐",
    subtitle: "Works 1–2 · Breakfast Residuals & Palette · London 2026",
  },
  {
    id: "II",
    label: "SERIES II",
    englishName: "Still Things",
    chineseName: "静物",
    subtitle: "Works 3–11 · Still Things · Home as private museum",
  },
];

export interface Watercolor {
  id: string;
  title: string;
  titleZh?: string;
  series: string;
  note: string;
  noteZh?: string;
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
  {
    id: "1",
    title: "Breakfast Residuals 01",
    titleZh: "早餐残留 01",
    series: "早餐残留",
    note: "exhibited at Apsara London Gallery 'Before It Dissolves' (May 2026)",
    noteZh: "曾联展于Apsara伦敦画廊《在消散之前》（2026年5月） ",
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
    title: "Breakfast Palette",
    titleZh: "早餐调色板",
    series: "I",
    note: "watercolor · 2026 · framed",
    noteZh: "水彩 · 2026 · 已装裱",
    year: "2026",
    medium: "Watercolor on paper, framed",
    mediumZh: "纸本水彩，已装裱",
    dimensions: "",
    dimensionsZh: "",
    description:
      "Companion piece documenting the ritual of preparing work for travel to London.",
    descriptionZh:
      "姊妹篇，记录将作品打包带往伦敦前的那套仪式。",
  },
  {
    id: "3",
    title: "Still Things #1",
    titleZh: "静物 其一",
    series: "II",
    note: "IMG_0026 · watercolor",
    noteZh: "IMG_0026 · 水彩",
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "From the home-as-museum series. A salvaged trinket rearranged into a new scene.",
    descriptionZh: "「家即私人博物馆」系列。一件打捞来的小物，被重新排列成新的景观现场。",
  },
  {
    id: "4",
    title: "Still Things #2",
    titleZh: "静物 其二",
    series: "II",
    note: "IMG_0039 · watercolor",
    noteZh: "IMG_0039 · 水彩",
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
    note: "IMG_0038 · watercolor (gif)",
    noteZh: "IMG_0038 · 水彩（gif）",
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
    note: "IMG_0036 · watercolor",
    noteZh: "IMG_0036 · 水彩",
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Continues the private museum practice — arranging and recording.",
    descriptionZh: "延续「私人博物馆」的工作方式——排列，记录。",
  },
  {
    id: "7",
    title: "Still Things #5",
    titleZh: "静物 其五",
    series: "II",
    note: "IMG_0014 · watercolor",
    noteZh: "IMG_0014 · 水彩",
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Everyday objects as visual anchors for memory.",
    descriptionZh: "日常之物，成为记忆的视觉锚点。",
  },
  {
    id: "8",
    title: "Still Things #6",
    titleZh: "静物 其六",
    series: "II",
    note: "IMG_2096 · watercolor",
    noteZh: "IMG_2096 · 水彩",
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Direct record of touch and time spent with collected things.",
    descriptionZh: "对触摸与陪伴时光的直接记录。",
  },
  {
    id: "9",
    title: "Still Things #7",
    titleZh: "静物 其七",
    series: "II",
    note: "IMG_8925 · watercolor",
    noteZh: "IMG_8925 · 水彩",
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
