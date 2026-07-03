export const catalogMeta = {
  en: "Visions in Watercolor",
  zh: "水彩视界",
  medium: "Watercolor",
  mediumZh: "水彩",
  description: "",
  descriptionZh: "",
  descriptionHtml: `<p>The book brings together two interconnected watercolor series of mine: <em>Residuals</em> and <em>Still Things,</em> unified by a single animating question: what do everyday objects reveal when we look at them just long enough to feel strange?</p><p>Both series begin with ordinary things: found objects, used surfaces, domestic artifacts — and treat them as subjects worthy of quiet, sustained attention. In <em>Residuals</em>, the focus is on traces: the marks, the leftovers, and remnants that materials leave after they’ve been used. Rather than depicting objects at their moment of pristine function, these paintings catch them just after, the moment that is normally erased in the course of daily life. The act of painting becomes a way of arresting that erasure, preserving what we would otherwise sweep away without a second glance.</p><p><em>Still Things</em> extends this sensibility into something more compositional. Here the working method is closer to what I think of as a “private museum” of domestic objects, collected, arranged, and recorded. The paintings function like accession records for a collection that nobody would curate: the grotesque and the tender placed side by side, the strangeness of an ordinary thing held up to the light. Where <em>Residuals</em> is about time — catching a moment before it disappears — <em>Still Things</em> is about attention: what happens when looking itself becomes a kind of preservation.</p><p>Together, the two series form a coherent visual argument. Each image participates in a shared project of defamiliarization: the familiar made slightly unfamiliar, the overlooked made visible, the about-to-be-discarded made permanent. Watercolor is the right medium for this, as its transparency, the way pigment blooms and dries and cannot fully be controlled, mirrors the fragility of the moments these paintings try to hold. There is always a quiet tension in these works, something that sits between serenity and unease, which I think is honest to the experience of looking carefully at ordinary things.</p><p>The book is not a retrospective, but an argument for slowness, for the kind of looking that contemporary everyday life rarely permits.</p>`,
  descriptionHtmlZh: `<p>这部分汇聚了我两个相互关联的水彩系列：<em>残留</em>与<em>静物</em>，它们由一个共同的核心问题联结：当我们凝视日常之物足够久，久到感到陌生，它究竟向我们揭示了什么？</p><p>两个系列都从平凡之物出发：拾得之物、使用过的表面、家居器物——并将它们视为值得安静而持续凝视的对象。《残留》聚焦于痕迹：材料在使用之后留下的印记、余留与残骸。这些画作并非捕捉物件处于完好功能状态的瞬间，而是描绘其”刚刚之后”的时刻——那个在日常生活中通常会被抹去的瞬间。绘画因此成为一种阻止消除的方式，保留那些我们本会不假思索地扫去的东西。</p><p>《静物》将这种感受力延伸为更具构成性的东西。这里的工作方式更接近我所说的家居之物的”私人博物馆”——收集、排列、记录。这些画作像是一份没有人会策划的藏品登录记录：怪诞与温柔并置，寻常之物的陌异感被举到光线之下。如果说《残留》关乎时间——在某个瞬间消失之前将其捕捉——那么《静物》关乎的是注意力：当凝视本身成为一种保存方式时，会发生什么。</p><p>两个系列共同构成了一个连贯的视觉论点。每一幅画都参与着一个共同的陌生化计划：使熟悉者略感陌生，使被忽视者变得可见，使即将被丢弃者成为永恒。水彩是承载这一切的恰当媒介——它的透明性，色料晕染、干燥、无法被完全掌控的方式，映照着这些画作试图定格的瞬间的脆弱性。这些作品中始终有一种静默的张力，某种介于宁静与不安之间的东西，我认为这对于仔细凝视日常之物的体验来说是诚实的。</p><p>我的水彩作品是对“缓慢”的辩护，对那种当代日常生活中鲜少允许的凝视方式的辩护。</p>`,
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
  year: string;
  medium?: string;
  mediumZh?: string;
  dimensions?: string;
  dimensionsZh?: string;
  description?: string;
  descriptionZh?: string;
  printInfo?: string;
  printInfoZh?: string;
  printPrice?: number;
  price?: number;
  paylink?: string;
}

export const PRINT_9X12_PAYLINK = "https://www.paypal.com/ncp/payment/PHRVNL65LDTX2";
export const PRINT_FRAMED_PAYLINK = "https://www.paypal.com/ncp/payment/WCB5Q7U8XM9TS";

// Replace with the token from your $4 PayPal button (created in PayPal dashboard)
const STUDIO_CARD_PAYPAL_TOKEN = "5G7K5WX5THNN8";

export function studioCardPayLink(title: string): string {
  return `https://www.paypal.com/ncp/payment/${STUDIO_CARD_PAYPAL_TOKEN}?custom_id=${encodeURIComponent(title)}`;
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
    description: "",
    descriptionZh: "",
    printInfo: `5×7" framed print, white frame, matted to 4×6"`,
    printInfoZh: "13×18厘米装裱印刷品，白色画框，10×15厘米裱装",
    price: 25,
    paylink: PRINT_FRAMED_PAYLINK,
  },

{
    id: "24",
     title: "Residuals #10",
    titleZh: "残留 其十",
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
    id: "25",
     title: "Residuals #8",
    titleZh: "残留 其八",
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
    printInfo: `5×7" framed print, white frame, matted to 4×6"`,
    printInfoZh: "13×18厘米装裱印刷品，白色画框，10×15厘米裱装",
    price: 25,
    paylink: PRINT_FRAMED_PAYLINK,
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
    dimensionsZh: "22.9 × 30.5 厘米",
    description:
      "",
    descriptionZh:
      "",
    price: 95,
    paylink: "https://www.paypal.com/ncp/payment/PLACEHOLDER",
    printInfo: `Also available as framed print 8×10", $35`,
    printInfoZh: `亦提供20×25厘米装裱印刷品，$35`,
    printPrice: 35,
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
  
  // 静物

  {
    id: "42",
    title: "Still Things #14",
    titleZh: "静物 其十四",
    series: "II",
    printInCatalog: false,
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
  },{
    id: "43",
    title: "Still Things #15",
    titleZh: "静物 其十五",
    series: "II",
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
    title: "Still Things #14",
    titleZh: "静物 其十四",
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
    id: "21",
    title: "Still Things #15",
    titleZh: "静物 其十五",
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

  // 明信片 / Postcards

  { id: "29", title: "Chun Wang Studio Card #02", titleZh: "王淳工作室卡片 #02", series: "III", showInStorefront: true, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "10×15厘米哑光艺术纸印刷品", printPrice: 4 },
  { id: "30", title: "Chun Wang Studio Card #03", titleZh: "王淳工作室卡片 #03", series: "III", showInStorefront: true, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "10×15厘米哑光艺术纸印刷品", printPrice: 4 },
  { id: "31", title: "Chun Wang Studio Card #04", titleZh: "王淳工作室卡片 #04", series: "III", showInStorefront: true, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "10×15厘米哑光艺术纸印刷品", printPrice: 4 },
  { id: "32", title: "Chun Wang Studio Card #05", titleZh: "王淳工作室卡片 #05", series: "III", showInStorefront: true, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "10×15厘米哑光艺术纸印刷品", printPrice: 4 },
  { id: "33", title: "Chun Wang Studio Card #06", titleZh: "王淳工作室卡片 #06", series: "III", showInStorefront: true, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "10×15厘米哑光艺术纸印刷品", printPrice: 4 },
  { id: "34", title: "Chun Wang Studio Card #07", titleZh: "王淳工作室卡片 #07", series: "III", showInStorefront: true, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "10×15厘米哑光艺术纸印刷品", printPrice: 4 },
  { id: "35", title: "Chun Wang Studio Card #08", titleZh: "王淳工作室卡片 #08", series: "III", showInStorefront: true, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "10×15厘米哑光艺术纸印刷品", printPrice: 4 },
  { id: "36", title: "Chun Wang Studio Card #09", titleZh: "王淳工作室卡片 #09", series: "III", showInStorefront: true, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "10×15厘米哑光艺术纸印刷品", printPrice: 4 },
  { id: "37", title: "Chun Wang Studio Card #10", titleZh: "王淳工作室卡片 #10", series: "III", showInStorefront: true, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "10×15厘米哑光艺术纸印刷品", printPrice: 4 },
  { id: "38", title: "Chun Wang Studio Card #11", titleZh: "王淳工作室卡片 #11", series: "III", showInStorefront: true, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "10×15厘米哑光艺术纸印刷品", printPrice: 4 },
  { id: "39", title: "Chun Wang Studio Card #12", titleZh: "王淳工作室卡片 #12", series: "III", showInStorefront: true, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "10×15厘米哑光艺术纸印刷品", printPrice: 4 },
  { id: "40", title: "Chun Wang Studio Card #13", titleZh: "王淳工作室卡片 #13", series: "III", showInStorefront: false, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "10×15厘米哑光艺术纸印刷品", printPrice: 4 },
  { id: "41", title: "Chun Wang Studio Card #14", titleZh: "王淳工作室卡片 #14", series: "III", showInStorefront: false, year: "2026", printInfo: `4×6" print on matte fine art paper`, printInfoZh: "10×15厘米哑光艺术纸印刷品", printPrice: 4 },
];

export function getWatercolor(id: string): Watercolor | undefined {
  return watercolors.find((w) => w.id === id);
}
