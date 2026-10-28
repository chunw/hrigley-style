export const catalogMeta = {
  en: "Visions in Watercolor",
  zh: "水彩视界",
  medium: "Watercolor",
  mediumZh: "水彩",
  description: "",
  descriptionZh: "",
  descriptionHtml: "",
  descriptionHtmlZh: "",
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
    id: "IV",
    englishName: "Notes from the Road",
    chineseName: "行旅拾记",
  },
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
  {
    id: "III",
    englishName: "Chun Wang Studio Cards",
    chineseName: "王淳工作室卡片",
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
  includeInArtbox?: boolean;
  year: string;
  medium?: string;
  mediumZh?: string;
  dimensions?: string;
  dimensionsZh?: string;
  description?: string;
  descriptionZh?: string;
  printInfo?: string;
  printInfoZh?: string;
  // Full override for the "Available as ..." line on the detail page, used
  // when the piece's availability doesn't fit that template (e.g. original
  // art for sale rather than a print).
  availabilityText?: string;
  availabilityTextZh?: string;
  printPrice?: number;
  price?: number;
  // Shown instead of `price` on the product grid / vendor catalog when a piece
  // has more than one price (e.g. print vs. framed original) — e.g. "$10 / $35".
  priceLabel?: string;
  paylink?: string;
  framed?: boolean;
  soldOut?: boolean;
  // When set, the detail page shows one "Various options available" button
  // linking here instead of a single price — e.g. print vs. framed original.
  multiOptionsPaylink?: string;
}

export const PRINT_9X12_PAYLINK = "https://www.paypal.com/ncp/payment/PHRVNL65LDTX2";
export const PRINT_FRAMED_PAYLINK = "https://www.paypal.com/ncp/payment/WCB5Q7U8XM9TS";

// Replace with the token from your $4 PayPal button (created in PayPal dashboard)
const STUDIO_CARD_PAYPAL_TOKEN = "5G7K5WX5THNN8";

export function studioCardPayLink(title: string): string {
  return `https://www.paypal.com/ncp/payment/${STUDIO_CARD_PAYPAL_TOKEN}?custom_id=${encodeURIComponent(title)}`;
}

export const watercolors: Watercolor[] = [
  // 行旅拾记 / Notes from the Road

  {
    id: "45",
    title: "Notes from the Road #2",
    titleZh: "行旅拾记 其二",
    series: "IV",
    printInCatalog: true,
    showInStorefront: false,
    year: "2026",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
    printInfo: `4×6" print on matte fine art paper`,
    printInfoZh: "4×6英寸哑光艺术微喷",
    price: 4,
  },
  {
    id: "46",
    title: "Notes from the Road #3",
    titleZh: "行旅拾记 其三",
    series: "IV",
    printInCatalog: true,
    showInStorefront: false,
    year: "2026",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
    printInfo: `4×6" print on matte fine art paper`,
    printInfoZh: "4×6英寸哑光艺术微喷",
    price: 4,
  },
  {
    id: "47",
    title: "Notes from the Road #4",
    titleZh: "行旅拾记 其四",
    series: "IV",
    printInCatalog: true,
    showInStorefront: false,
    year: "2026",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
    printInfo: `4×6" print on matte fine art paper`,
    printInfoZh: "4×6英寸哑光艺术微喷",
    price: 4,
  },

  // 残留

  

{
    id: "24",
     title: "Residuals #24",
    titleZh: "残留 其二十四",
    series: "I",
    printInCatalog: false,
    showInStorefront: false,
    year: "2026",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
    framed: true,
  },
{
    id: "5",
    title: "Residuals #5",
    titleZh: "残留 其五",
    series: "I",
    includeInArtbox: false,
    printInCatalog: true,
    showInStorefront: true,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
    printInfo: `5×7" framed print, white frame, matted to 4×6"`,
    printInfoZh: "5×7英寸装裱印刷品，白色画框，4×6英寸裱装",
    price: 25,
    paylink: PRINT_FRAMED_PAYLINK,
    framed: true,
  },
  {
    id: "25",
     title: "Residuals #25",
    titleZh: "残留 其二十五",
    series: "I",
    includeInArtbox: false,
    printInCatalog: false,
    showInStorefront: false,
    year: "2026",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
    printInfo: `5×7" framed print, white frame, matted to 4×6"`,
    printInfoZh: "5×7英寸装裱印刷品，白色画框，4×6英寸裱装",
    availabilityText: `original art is available, framed, white frame, 5×7"`,
    availabilityTextZh: "原作现售，已装裱，白色画框，5×7英寸",
    price: 25,
    paylink: PRINT_FRAMED_PAYLINK,
    framed: true,
  },
  {
    id: "6",
 title: "Residuals #6",
    titleZh: "残留 其六",
    series: "I",
    includeInArtbox: false,
    printInCatalog: true,
    printInCatalogImage: "1",
    showInStorefront: false,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  }, {
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
    dimensionsZh: "9 × 12 英寸",
    description: `Exhibited in Forms Before Dissolving, Apsara Studio Gallery, London UK, 2026.`,
    descriptionZh: `曾在英国伦敦 Apsara Studio Gallery 的《Forms Before Dissolving》展览中展出（2026）。`,
    price: 10,
    priceLabel: "$10 / $100",
    paylink: PRINT_9X12_PAYLINK,
    printInfo: `Also available as framed print 8×10", $100`,
    printInfoZh: `亦提供8×10英寸装裱印刷品，$100`,
    printPrice: 100,
    framed: true,
  },
  

  {
    id: "8",
     title: "Residuals #5",
    titleZh: "残留 其五",
   series: "I",
    printInCatalog: false,
    showInStorefront: false,
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
    showInStorefront: false,
    year: "2026",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
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
    description: "",
    descriptionZh: "",
    framed: true,
  },
  {
    id: "2",
    title: "Residuals #2",
    titleZh: "残留 其二",
    series: "I",
    includeInArtbox: false,
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
    framed: true,
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
    description: `Available as original art (framed) or as 9×12" fine art matte paper print.`,
    descriptionZh: "可选原作（已装裱）或 9×12 英寸艺术微喷哑光纸印刷版。",
    priceLabel: "$10 / $35",
    multiOptionsPaylink: "https://www.paypal.com/ncp/payment/T259S58429CAL",
  },

{
    id: "13",
     title: "Residuals #7",
    titleZh: "残留 其七",
    series: "I",
    printInCatalog: true,
    printInCatalogImage: "1",
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
    id: "26",
     title: "Residuals #8",
    titleZh: "残留 其八",
    series: "I",
    includeInArtbox: false,
    printInCatalog: true,
    printInCatalogImage: "1",
    showInStorefront: false,
    year: "2026",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
    price: 25,
  },

{
    id: "27",
     title: "Residuals #9",
    titleZh: "残留 其九",
    series: "I",
    includeInArtbox: false,
    printInCatalog: false,
    printInCatalogImage: "1",
    showInStorefront: false,
    year: "2026",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  
  // 静物

  {
    id: "42",
    title: "Still Things #14",
    titleZh: "静物 其十四",
    series: "II",
    printInCatalog: false,
    showInStorefront: false,
    year: "2026",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
    printInfo: "4×6 print",
    printInfoZh: "4×6 英寸印刷品",
    price: 4,
  },{
    id: "43",
    title: "Still Things #14",
    titleZh: "静物 其十四",
    series: "II",
    includeInArtbox: false,
    printInCatalog: true,
    showInStorefront: true,
    year: "2026",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
    printInfo: "4×6 print",
    printInfoZh: "4×6 英寸印刷品",
    price: 4,
  },

{
    id: "9",
    title: "Still Things #7",
    titleZh: "静物 其七",
    series: "II",
    printInCatalog: true,
    showInStorefront: false,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },

  {
    id: "20",
    title: "Still Things",
    titleZh: "静物 其十四",
    series: "II",
    printInCatalog: false,
    showInStorefront: false,
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
    includeInArtbox: false,
    printInCatalog: true,
    showInStorefront: false,
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
    printInCatalog: true,
    showInStorefront: false,
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
    description: "",
    descriptionZh: "",
  },


  {
    id: "14",
    title: "Still Things #8",
    titleZh: "静物 其八",
    series: "II",
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
    description: "",
    descriptionZh: "",
  },

  {
    id: "16",
    title: "Still Things #10",
    titleZh: "静物 其十",
    series: "II",
    printInCatalog: true,
    showInStorefront: false,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },

  {
    id: "17",
    title: "Still Things #11",
    titleZh: "静物 其十一",
    series: "II",
    printInCatalog: true,
    showInStorefront: false,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
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
    description: "",
    descriptionZh: "",
    soldOut: true,
  },
  {
    id: "18",
    title: "Still Things #12",
    titleZh: "静物 其十二",
    series: "II",
    printInCatalog: false,
    showInStorefront: false,
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
    showInStorefront: false,
    year: "2025",
    medium: "Watercolor on paper",
    mediumZh: "纸本水彩",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },

  {
    id: "48",
    title: "Still Things",
    titleZh: "静物",
    series: "II",
    printInCatalog: true,
    showInStorefront: false,
    year: "2026",
    medium: "Watercolor",
    mediumZh: "水彩",
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



  // Cards

  { id: "29", title: "Chun Wang Studio Card #02", titleZh: "王淳工作室卡片 #02", series: "III", showInStorefront: false, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "4×6英寸哑光艺术微喷", printPrice: 4 },
  { id: "30", title: "Chun Wang Studio Card #03", titleZh: "王淳工作室卡片 #03", series: "III", showInStorefront: false, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "4×6英寸哑光艺术微喷", printPrice: 4 },
  { id: "31", title: "Chun Wang Studio Card #04", titleZh: "王淳工作室卡片 #04", series: "III", showInStorefront: false, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "4×6英寸哑光艺术微喷", printPrice: 4 },
  { id: "32", title: "Chun Wang Studio Card #05", titleZh: "王淳工作室卡片 #05", series: "III", showInStorefront: false, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "4×6英寸哑光艺术微喷", printPrice: 4 },
  { id: "33", title: "Chun Wang Studio Card #06", titleZh: "王淳工作室卡片 #06", series: "III", showInStorefront: false, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "4×6英寸哑光艺术微喷", printPrice: 4 },
  { id: "34", title: "Chun Wang Studio Card #07", titleZh: "王淳工作室卡片 #07", series: "III", showInStorefront: false, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "4×6英寸哑光艺术微喷", printPrice: 4 },
  { id: "35", title: "Chun Wang Studio Card #08", titleZh: "王淳工作室卡片 #08", series: "III", showInStorefront: false, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "4×6英寸哑光艺术微喷", printPrice: 4 },
  { id: "36", title: "Chun Wang Studio Card #09", titleZh: "王淳工作室卡片 #09", series: "III", showInStorefront: false, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "4×6英寸哑光艺术微喷", printPrice: 4 },
  { id: "37", title: "Chun Wang Studio Card #10", titleZh: "王淳工作室卡片 #10", series: "III", showInStorefront: false, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "4×6英寸哑光艺术微喷", printPrice: 4 },
  { id: "38", title: "Chun Wang Studio Card #11", titleZh: "王淳工作室卡片 #11", series: "III", showInStorefront: false, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "4×6英寸哑光艺术微喷", printPrice: 4 },
  { id: "39", title: "Chun Wang Studio Card #12", titleZh: "王淳工作室卡片 #12", series: "III", showInStorefront: false, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "4×6英寸哑光艺术微喷", printPrice: 4 },
  ];

export function getWatercolor(id: string): Watercolor | undefined {
  return watercolors.find((w) => w.id === id);
}
