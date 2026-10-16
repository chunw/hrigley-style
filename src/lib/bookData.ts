import { watercolors } from "./watercolors";
import { remainsWorks } from "./remains";
import { spiritWorks } from "./21spirit";
import { products } from "./products";

/**
 * Print-ready book data — "Chun Wang Paintings 2019–2026"
 * The physical edition this page lays out is the book already sold in the
 * shop (see products.ts → id "book-paintings-2019-2026"):
 *   Full colour · 40 pages · 6 × 6 inches · Softcover · Soft-touch matte.
 * Chapters follow the four painting series named in that product record:
 * Residuals, Still Things, Remains, In the Spirit of the 21st Century.
 */

export const BOOK = {
  titleEn: "Chun Wang Paintings",
  titleZh: "王淳绘画集",
  dateRange: "2019–2026",
  editionEn: "First edition · 2026",
  editionZh: "第一版 · 2026年",
  trim: '6 × 6 in (152 × 152 mm)',
  extend: "40 pages · Full colour throughout",
  binding: "Softcover · Soft-touch matte finish",
  isbn: "ISBN to be assigned",
  productId: "book-paintings-2019-2026",
  price: 40,
  totalPages: 40,
} as const;

export function bookProduct() {
  return products.find((p) => p.id === BOOK.productId);
}

/* Image helpers — same public-folder convention as printCatalog.ts.
   Always main.jpg: verified on disk for every plate folder. (Some works
   carry a printInCatalogImage hint whose numbered file does not exist in
   public/, e.g. all Remains/Spirit folders ship main.jpg only.) */
export function wcImg(id: string) {
  return `/watercolors/${id.padStart(2, "0")}/main.jpg`;
}
export function remainsImg(id: string) {
  return `/remains/${id.padStart(2, "0")}/main.jpg`;
}
export function spiritImg(id: string) {
  return `/21spirit/${id.padStart(2, "0")}/main.jpg`;
}

export interface Plate {
  n: string;
  titleEn: string;
  titleZh: string;
  year: string;
  mediumEn: string;
  mediumZh: string;
  detailEn?: string;
  detailZh?: string;
  src: string;
  page: number;
}

function wcPlate(n: string, id: string, page: number): Plate {
  const w = watercolors.find((x) => x.id === id);
  return {
    n,
    titleEn: w?.title ?? id,
    titleZh: w?.titleZh ?? w?.title ?? id,
    year: w?.year ?? "",
    mediumEn: w?.medium ?? "Watercolor on paper",
    mediumZh: w?.mediumZh ?? "纸本水彩",
    detailEn: w?.dimensions || w?.printInfo || undefined,
    detailZh: w?.dimensionsZh || w?.printInfoZh || undefined,
    src: wcImg(id),
    page,
  };
}
function rmPlate(n: string, id: string, page: number): Plate {
  const w = remainsWorks.find((x) => x.id === id);
  return {
    n,
    titleEn: w?.title ?? id,
    titleZh: w?.titleZh ?? w?.title ?? id,
    year: w?.year ?? "",
    mediumEn: w?.medium ?? "Mixed Media",
    mediumZh: w?.mediumZh ?? "综合媒材",
    detailEn: w?.dimensions || undefined,
    detailZh: w?.dimensionsZh || undefined,
    src: remainsImg(id),
    page,
  };
}
function spPlate(n: string, id: string, page: number): Plate {
  const w = spiritWorks.find((x) => x.id === id);
  return {
    n,
    titleEn: w?.title ?? id,
    titleZh: w?.titleZh ?? w?.title ?? id,
    year: w?.year ?? "",
    mediumEn: w?.medium ?? "Mixed Media",
    mediumZh: w?.mediumZh ?? "综合媒材",
    detailEn: w?.dimensions || undefined,
    detailZh: w?.dimensionsZh || undefined,
    src: spiritImg(id),
    page,
  };
}

/** Plates in reading order. Page numbers match the 40-page map in Book.tsx. */
export const residualsPlates: Plate[] = [
  wcPlate("01", "1", 4),
  wcPlate("02", "5", 13),
  wcPlate("03", "2", 14),
  wcPlate("04", "7", 14),
  wcPlate("05", "3", 15),
  wcPlate("06", "13", 15),
  wcPlate("07", "26", 16),
];

export const stillThingsPlates: Plate[] = [
  wcPlate("08", "9", 19),
  wcPlate("09", "21", 19),
  wcPlate("10", "22", 20),
  wcPlate("11", "14", 20),
  wcPlate("12", "16", 21),
  wcPlate("13", "17", 21),
  wcPlate("14", "43", 22),
];

export const remainsPlates: Plate[] = [
  rmPlate("15", "1", 25),
  rmPlate("16", "2", 25),
  rmPlate("17", "3", 26),
  rmPlate("18", "4", 26),
  rmPlate("19", "5", 27),
  rmPlate("20", "6", 27),
];

export const spiritPlates: Plate[] = [
  spPlate("21", "1", 31),
  spPlate("22", "2", 32),
  spPlate("23", "3", 33),
  spPlate("24", "4", 34),
];

export const allPlates: Plate[] = [
  ...residualsPlates,
  ...stillThingsPlates,
  ...remainsPlates,
  ...spiritPlates,
];

/** Cover pair — echoes the /catalogs tiles (left image over title, right behind). */
export const coverImages = {
  frontLeft: wcImg("1"),
  frontRight: remainsImg("1"),
  backLeft: wcImg("2"),
  backRight: spiritImg("1"),
};

export interface TocRow {
  id: string;
  n: string;
  en: string;
  zh: string;
  page: number;
}

export const CONTENTS: TocRow[] = [
  { id: "book-p8", n: "", en: "Foreword — The kind of looking", zh: "序言 — 凝视之道", page: 8 },
  { id: "book-p9", n: "", en: "Introduction — Seven years, four series", zh: "导言 — 七年，四组系列", page: 9 },
  { id: "book-p11", n: "I", en: "Residuals", zh: "残留", page: 11 },
  { id: "book-p17", n: "II", en: "Still Things", zh: "静物", page: 17 },
  { id: "book-p23", n: "III", en: "Remains", zh: "遗迹", page: 23 },
  { id: "book-p29", n: "IV", en: "In the Spirit of the 21st Century", zh: "21世纪精神", page: 29 },
  { id: "book-p35", n: "", en: "Checklist of works", zh: "作品清单", page: 35 },
  { id: "book-p36", n: "", en: "About the artist", zh: "关于艺术家", page: 36 },
  { id: "book-p38", n: "", en: "Colophon & production notes", zh: "版记与制作说明", page: 38 },
];

export const spiritThemes = {
  en: [
    "Consumerism",
    "The Attention Economy",
    "Digital Life & Being Alone Together",
    "Climate Collapse",
    "Black Mirror",
    "Information Overload & Surveillance Capitalism",
    "Generative AI",
  ],
  zh: ["消费主义", "注意力经济", "数字生活与孤独在一起", "气候崩溃", "黑镜", "信息过载与监控资本主义", "生成式人工智能"],
};

export const honours = {
  en: [
    "London International Creative Competition — Remains, Official Selection, Create/Art (2024); In the Spirit of the 21st Century, Finalist, Create/Art (2021).",
    "Exhibited internationally, including the United Nations Headquarters, New York; San Francisco Museum of Modern Art; Harvard University CAMLab; Anderson Collection at Stanford University.",
    "International recognition including the International Photography Awards, Siena International Photo Awards, International Color Awards, and Moscow International Foto Awards.",
    "Curator & developer of Negotiated Intelligence (Wrong Biennale 2025–2026 official pavilion; w3 Awards Silver, Arts & Culture Websites) and IMMEMORY: On COVID-19 (2021 Webby Awards Official Nominee, Best Cultural Website).",
  ],
  zh: [
    "伦敦国际创意大赛（LICC）——《遗迹》官方入选·艺术创作类（2024）；《21世纪精神》决赛入围·艺术创作类（2021）。",
    "作品曾在纽约联合国总部、旧金山现代艺术博物馆、哈佛大学 CAMLab、斯坦福大学安德森收藏馆等机构展出。",
    "曾获国际摄影奖（IPA）、锡耶纳国际摄影奖、国际色彩奖、莫斯科国际摄影奖等多项国际荣誉。",
    "《Negotiated Intelligence》（Wrong Biennale 2025–2026 官方展馆；w3 Awards 银奖）与《IMMEMORY: On COVID-19》（2021年韦比奖最佳文化网站官方提名）的策展人与开发者。",
  ],
};
