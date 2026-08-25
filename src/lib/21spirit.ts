export const catalogMeta = {
  en: "In the Spirit of the 21st Century",
  zh: "21世纪精神",
  medium: "Mixed Media",
  mediumZh: "综合媒材",
  description: `<a href="https://www.licc.uk/winners/winner.php?id=122553" target="_blank">2021 London International Creative Competition (LICC) Finalist · Create/Art</a>. In the Spirit of the 21st Century translates core contemporary social issues and research data into figures and scenes, attempting to salvage — in an era of rapid flux — a portrait of the 21st century spirit that can be seen and felt. In the Spirit of the 21st Century is a series of mixed media paintings, each built on a piece of academic or journalistic research, translating social forces that are enormous and largely invisible into images that can be seen and felt. The subjects span the defining crises of the early 21st century, including themes of Consumerism, The Attention Economy, Digital Life & Being Alone Together, Climate Collapse, Black Mirror, Information Overload & Surveillance Capitalism, Generative AI, etc. The book would expand on each of these research foundations with accompanying essays, giving readers both the visual work and the intellectual depth behind it, so that art and argument speak to each other on the page.`,
  descriptionZh: `<a href="https://www.licc.uk/winners/winner.php?id=122553" target="_blank">2021年伦敦国际创意大赛（LICC）决赛入围 · 艺术创作类</a>。《21世纪精神》将当代核心社会议题与研究数据转译为人物与场景，试图在快速流动的时代里，打捞一种可被观看、被共感的21世纪精神图景。《21世纪精神》是一系列综合媒材绘画，每件作品均建立在一项学术或新闻研究的基础之上，将那些庞大而几乎无形的社会力量转译为可被观看、被感受的图像。主题涵盖21世纪初的核心危机，包括：消费主义、注意力经济、数字生活与孤独在一起、气候崩溃、黑镜、信息过载与监控资本主义、生成式人工智能等。随附的文章将在每个研究基础上进一步延伸，让读者既能获得视觉作品，也能触及其背后的思想深度，使艺术与论点在页面上彼此照映。`,
};

export interface SpiritWork {
  id: string;
  title: string;
  titleZh?: string;
  showInStorefront?: boolean;
  printInCatalog?: boolean;
  printInCatalogImage?: string;
  includeInArtbox?: boolean;
  year: string;
  medium: string;
  mediumZh?: string;
  dimensions?: string;
  dimensionsZh?: string;
  description?: string;
  descriptionZh?: string;
  price?: number;
  priceLabel?: string;
  paylink?: string;
}

export const spiritWorks: SpiritWork[] = [
  {
    id: "1",
    title: "Alone Together",
    titleZh: "我们之间的距离",
    printInCatalog: true,
    year: "2021",
    medium: "Mixed Media",
    mediumZh: "综合媒材",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
    priceLabel: "$4 / $10",
    paylink: "https://www.paypal.com/ncp/payment/KBERHU8XPCPAL",
  },
  {
    id: "2",
    title: "Climate Collapse & The War Against Powered Interest",
    titleZh: "最后的交易",
    showInStorefront: false,
    printInCatalog: true,
    year: "2021",
    medium: "Mixed Media",
    mediumZh: "综合媒材",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "3",
    title: "Information Overload & Surveillance Capitalism",
    titleZh: "数字画像",
    showInStorefront: false,
    printInCatalog: true,
    year: "2021",
    medium: "Mixed Media",
    mediumZh: "综合媒材",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
  {
    id: "4",
    title: "The Attention Economy",
    titleZh: "被俘",
    showInStorefront: false,
    printInCatalog: true,
    year: "2021",
    medium: "Mixed Media",
    mediumZh: "综合媒材",
    dimensions: "",
    dimensionsZh: "",
    description: "",
    descriptionZh: "",
  },
];

export function getSpiritWork(id: string): SpiritWork | undefined {
  return spiritWorks.find((w) => w.id === id);
}
