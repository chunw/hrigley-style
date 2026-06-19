export const catalogMeta = {
  en: "Visions in Watercolor",
  zh: "水彩视界",
  medium: "Watercolor",
  mediumZh: "水彩",
  description: "In my watercolor practice, I have always believed that everyday objects can bring viewers a fresh visual experience and subtle psychological sensations. I pay attention to the traces objects leave after use. ‘Preserving’ that moment about to be erased makes the familiar slightly unfamiliar, stirring a quiet pause and empathy in the viewer.",
  descriptionZh: "在水彩实践中，我始终相信日常小物能够为观者带来新鲜的视觉体验与微妙的心理感受。我关注物被使用后留下的痕迹。“保留”那个即将被抹去的瞬间，使熟悉之物产生轻微的陌生化，从而在观者心中激起一种安静的停顿与共情。",
};

export interface WatercolorSeries {
  id: string;
  englishName: string;
  chineseName: string;
  subtitle?: string;
  subtitleZh?: string;
  description?: string;
  descriptionZh?: string;
}

export const seriesList: WatercolorSeries[] = [
  {
    id: "I",
    englishName: "Residuals",
    chineseName: "残留",
  },
  {
    id: "II",
    englishName: "Still Things",
    chineseName: "静物",
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
    id: "5",
    title: "Residuals #8",
    titleZh: "残留 其八",
    series: "I",
    printInCatalog: true,
    showInStorefront: true,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "The transparency of watercolor meets the strangeness of a found object.",
    descriptionZh: "水彩的透明性与拾得物的奇异感在此相遇。",
  },

  {
    id: "6",
 title: "Residuals #9",
    titleZh: "残留 其九",
    series: "I",
    printInCatalog: true,
    printInCatalogImage: "1",
    showInStorefront: true,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Continuing the 'private museum' working method — arranging, recording.",
    descriptionZh: "延续「私人博物馆」的工作方式——排列，记录。",
  },
{
    id: "24",
     title: "Residuals #10",
    titleZh: "残留 其十",
    series: "I",
    printInCatalog: false,
    printInCatalogImage: "1",
    showInStorefront: true,
    year: "2026",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Featured work maintaining a subtle balance between serenity and faint unease.",
    descriptionZh: "重点作品，宁静与隐约不安之间保持着微妙的平衡。",
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
    printInCatalog: false,
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
  },
  
  {
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
    description: "From the 'Collection Catalog' series. A salvaged object, rearranged into a new scene.",
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
    printInCatalog: false,
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
    description: "Featured work maintaining a subtle balance between serenity and faint unease.",
    descriptionZh: "重点作品，宁静与隐约不安之间保持着微妙的平衡。",
  },
  
  // 静物
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
    description: "Featured work maintaining a subtle balance between serenity and faint unease.",
    descriptionZh: "重点作品，宁静与隐约不安之间保持着微妙的平衡。",
  },

  {
    id: "20",
    title: "Still Things #14",
    titleZh: "静物 其十四",
    series: "II",
    printInCatalog: false,
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
    id: "21",
    title: "Still Things #15",
    titleZh: "静物 其十五",
    series: "II",
    printInCatalog: false,
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
    id: "22",
    title: "Still Things #16",
    titleZh: "静物 其十六",
    series: "II",
    printInCatalog: false,
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
    id: "11",
    title: "Still Things #7",
    titleZh: "静物 其七",
    series: "II",
    printInCatalog: false,
    showInStorefront: false,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Featured work maintaining a subtle balance between serenity and faint unease.",
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
    description: "Featured work maintaining a subtle balance between serenity and faint unease.",
    descriptionZh: "重点作品，宁静与隐约不安之间保持着微妙的平衡。",
  },

  {
    id: "15",
    title: "Still Things #9",
    titleZh: "静物 其九",
    series: "II",
    printInCatalog: false,
    showInStorefront: false,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "Featured work maintaining a subtle balance between serenity and faint unease.",
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
    description: "Featured work maintaining a subtle balance between serenity and faint unease.",
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
    description: "Featured work maintaining a subtle balance between serenity and faint unease.",
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
    description: "Featured work maintaining a subtle balance between serenity and faint unease.",
    descriptionZh: "重点作品，宁静与隐约不安之间保持着微妙的平衡。",
  },
  {
    id: "18",
    title: "Still Things #12",
    titleZh: "静物 其十二",
    series: "II",
    printInCatalog: false,
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
    id: "19",
    title: "Still Things #13",
    titleZh: "静物 其十三",
    series: "II",
    printInCatalog: false,
    showInStorefront: true,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },

  // {
  //   id: "23",
  //   title: "Still Things #17",
  //   titleZh: "静物 其十七",
  //   series: "II",
  //   printInCatalog: false,
  //   showInStorefront: false,
  //   year: "2025",
  //   medium: "Watercolor on paper",
  //   mediumZh: "纸本水彩",
  //   dimensions: "",
  //   dimensionsZh: "",
  //   description: "",
  //   descriptionZh: "",
  // },

  // {
  //   id: "4",
  //   title: "Still Things #2",
  //   titleZh: "静物 其二",
  //   series: "II",
  //   printInCatalog: false,
  //   showInStorefront: false,
  //   year: "2025",
  //   medium: "Watercolor on paper",
  //   mediumZh: "纸本水彩",
  //   dimensions: "",
  //   dimensionsZh: "",
  //   description: "Exploring the dual qualities of everyday objects — simultaneously grotesque and tender.",
  //   descriptionZh: "探索日常物件兼具怪诞与温柔的双重气质。",
  // },
];

export function getWatercolor(id: string): Watercolor | undefined {
  return watercolors.find((w) => w.id === id);
}
