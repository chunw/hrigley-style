import { useQuery } from "@tanstack/react-query";
import { products, FRAMED_ART_CATEGORY, FRAMED_ART_CATEGORY_ZH, ORIGINAL_ART_CATEGORY, ORIGINAL_ART_CATEGORY_ZH } from "@/lib/products";
import { watercolors, studioCardPayLink, PRINT_9X12_PAYLINK } from "@/lib/watercolors";
import { photographyWorks } from "@/lib/photography";
import { remainsWorks } from "@/lib/remains";
import { spiritWorks } from "@/lib/21spirit";

const DEFAULT_PRINT_INFO = '23 × 30 cm fine art matte paper print';
const DEFAULT_PRINT_INFO_ZH = '23 × 30 厘米精细艺术哑光纸印刷品';
const DEFAULT_PRINT_PRICE = 10;

const buildDescription = (desc: string | undefined | null, printInfo: string) => {
  const base = desc?.trim();
  return base ? `${base} · ${printInfo}` : printInfo;
};

const DIMENSION_RE = /\d+\s*[×x]\s*\d+\s*(cm|厘米)/;
// Grid cards for multi-option works (her rule, 2026-11-20): state the
// options plainly — original first, then the print — with no prices and
// no dimensions in the card description.
const MULTI_FRAMED_EN = "Framed original available; also available as a fine art print.";
const MULTI_FRAMED_ZH = "原作（已装裱）可购买；亦提供艺术微喷印刷品";
const MULTI_ORIGINAL_EN = "Original available; also available as a fine art print.";
const MULTI_ORIGINAL_ZH = "原作可购买；亦提供艺术微喷印刷品";
const TWO_PRINTS_EN = "Available as fine art prints in two sizes.";
const TWO_PRINTS_ZH = "提供两种尺寸的艺术微喷印刷品";
const buildMultiDescription = (desc: string | undefined | null, segment: string) => {
  const base = desc?.trim();
  // A base that itself states dimensions is an availability note, not a
  // description; the generated segment replaces it.
  if (base && !DIMENSION_RE.test(base)) return `${base} · ${segment}`;
  return segment;
};

function buildCatalogProducts(showAll: boolean) {
  return [
  ...photographyWorks
    .filter((p) => showAll || p.showInStorefront)
    .map((p) => {
      const paddedId = p.id.padStart(2, "0");
      const printInfo = p.printInfo ?? DEFAULT_PRINT_INFO;
      const printInfoZh = p.printInfoZh ?? DEFAULT_PRINT_INFO_ZH;
      const twoPrints = Boolean(p.printPrice && p.printPrice12x18);
      return {
        id: `photography-${p.id}`,
        name: p.title,
        title: p.title,
        title_zh: p.titleZh ?? null,
        description: twoPrints ? buildDescription(p.description, TWO_PRINTS_EN) : buildDescription(p.description, printInfo),
        description_zh: twoPrints ? buildDescription(p.descriptionZh, TWO_PRINTS_ZH) : buildDescription(p.descriptionZh, printInfoZh),
        price: p.printPrice ?? DEFAULT_PRINT_PRICE,
        priceLabel: p.printPrice && p.printPrice12x18 ? `$${p.printPrice} / $${p.printPrice12x18}` : undefined,
        currency: "USD",
        image_url: `/photography/${paddedId}/main.jpg`,
        secondImageUrl: `/photography/${paddedId}/1.jpg`,
        category: "Fine Art Prints",
        category_zh: "版画 · 限量版号",
        paylink: p.paylink ?? PRINT_9X12_PAYLINK,
        showInStorefront: p.showInStorefront !== false,
        soldOut: p.soldOut,
        detailPath: `/photography/${p.id}`,
        is_active: true,
        created_at: new Date().toISOString(),
      };
    }),
  ...remainsWorks
    .filter((w) => showAll || w.showInStorefront)
    .map((w) => {
    const paddedId = w.id.padStart(2, "0");
    return {
      id: `remains-${w.id}`,
      name: w.title,
      title: w.title,
      title_zh: w.titleZh ?? null,
      description: buildDescription(w.description, '10 × 15 cm print on matte fine art paper'),
      description_zh: buildDescription(w.descriptionZh, "10 × 15 厘米哑光艺术微喷"),
      price: w.price ?? 4,
      currency: "USD",
      image_url: `/remains/${paddedId}/main.jpg`,
      secondImageUrl: `/remains/${paddedId}/1.jpg`,
      category: "Fine Art Prints",
      category_zh: "版画 · 限量版号",
      paylink: w.paylink ?? studioCardPayLink(w.title),
      showInStorefront: w.showInStorefront !== false,
      soldOut: w.soldOut,
      detailPath: `/remains/${w.id}`,
      is_active: true,
      created_at: new Date().toISOString(),
    };
  }),
  ...spiritWorks
    .filter((w) => showAll || w.showInStorefront !== false)
    .map((w) => {
    const paddedId = w.id.padStart(2, "0");
    return {
      id: `spirit-${w.id}`,
      name: w.title,
      title: w.title,
      title_zh: w.titleZh ?? null,
      description: buildDescription(w.description, (w.priceLabel?.match(/\$/g) ?? []).length === 2 ? TWO_PRINTS_EN : '10 × 15 cm print on matte fine art paper'),
      description_zh: buildDescription(w.descriptionZh, (w.priceLabel?.match(/\$/g) ?? []).length === 2 ? TWO_PRINTS_ZH : "10 × 15 厘米哑光艺术微喷"),
      price: w.price ?? 4,
      priceLabel: w.priceLabel,
      currency: "USD",
      image_url: `/21spirit/${paddedId}/main.jpg`,
      secondImageUrl: `/21spirit/${paddedId}/1.jpg`,
      category: "Fine Art Prints",
      category_zh: "版画 · 限量版号",
      paylink: w.paylink ?? studioCardPayLink(w.title),
      showInStorefront: w.showInStorefront !== false,
      soldOut: w.soldOut,
      detailPath: `/21spirit/${w.id}`,
      is_active: true,
      created_at: new Date().toISOString(),
    };
  }),
  ...watercolors
    .filter((w) => showAll || w.showInStorefront)
    .map((w) => {
      const paddedId = w.id.padStart(2, "0");
      const printInfo = w.printInfo ?? DEFAULT_PRINT_INFO;
      const printInfoZh = w.printInfoZh ?? DEFAULT_PRINT_INFO_ZH;
      const isMultiOption = Boolean(w.multiOptionsPaylink) || (w.priceLabel?.match(/\$/g) ?? []).length === 2;
      const multiSegEn = w.framedDimensions ? MULTI_FRAMED_EN : MULTI_ORIGINAL_EN;
      const multiSegZh = w.framedDimensions ? MULTI_FRAMED_ZH : MULTI_ORIGINAL_ZH;
      const baseCategory = w.series === "III" ? "Cards" : "Fine Art Prints";
      const baseCategoryZh = w.series === "III" ? "卡片" : "版画 · 限量版号";
      return {
        id: `watercolor-${w.id}`,
        name: w.title,
        title: w.title,
        title_zh: w.titleZh ?? null,
        description: isMultiOption ? buildMultiDescription(w.description, multiSegEn) : buildDescription(w.description, printInfo),
        description_zh: isMultiOption ? buildMultiDescription(w.descriptionZh, multiSegZh) : buildDescription(w.descriptionZh, printInfoZh),
        price: w.price ?? w.printPrice ?? DEFAULT_PRINT_PRICE,
        priceLabel: w.priceLabel,
        currency: "USD",
        image_url: `/watercolors/${paddedId}/main.jpg`,
        secondImageUrl: `/watercolors/${paddedId}/1.jpg`,
        category: baseCategory,
        category_zh: baseCategoryZh,
        categories: (() => {
          const cats = [baseCategory];
          if (w.framed) cats.push(FRAMED_ART_CATEGORY);
          if (w.originalArt || (w.priceLabel?.match(/\$/g) ?? []).length >= 2) cats.push(ORIGINAL_ART_CATEGORY);
          return cats.length > 1 ? cats : undefined;
        })(),
        categories_zh: (() => {
          const cats = [baseCategoryZh];
          if (w.framed) cats.push(FRAMED_ART_CATEGORY_ZH);
          if (w.originalArt || (w.priceLabel?.match(/\$/g) ?? []).length >= 2) cats.push(ORIGINAL_ART_CATEGORY_ZH);
          return cats.length > 1 ? cats : undefined;
        })(),
        paylink: w.series === "III" ? studioCardPayLink(w.title) : (w.paylink ?? w.multiOptionsPaylink ?? PRINT_9X12_PAYLINK),
        showInStorefront: w.showInStorefront !== false,
        soldOut: w.soldOut,
        detailPath: `/watercolors/${w.id}`,
        is_active: true,
        created_at: new Date().toISOString(),
      };
    }),
  ];
}

const catalogProducts = buildCatalogProducts(false);

// Ordered to match the shop grid. Used by detail pages so prev/next matches what the visitor sees.
export const shopOrderNavigableItems = [
  // Shop products (non-print items visible in storefront)
  ...products
    .filter((p) => p.showInStorefront !== false)
    .map((p) => ({ type: "product" as const, id: p.id, path: `/product/${p.id}` })),
  // Fine Art Prints: photography, remains, spirit, then watercolors (I & II)
  ...photographyWorks
    .filter((p) => p.showInStorefront)
    .map((p) => ({ type: "photography" as const, id: p.id, path: `/photography/${p.id}` })),
  ...remainsWorks
    .filter((w) => w.showInStorefront !== false)
    .map((w) => ({ type: "remains" as const, id: w.id, path: `/remains/${w.id}` })),
  ...spiritWorks
    .filter((w) => w.showInStorefront !== false)
    .map((w) => ({ type: "spirit" as const, id: w.id, path: `/21spirit/${w.id}` })),
  // Watercolors: prints (I & II) immediately before cards (III)
  ...watercolors
    .filter((w) => w.showInStorefront !== false && w.series !== "III")
    .map((w) => ({ type: "watercolor" as const, id: w.id, path: `/watercolors/${w.id}` })),
  ...watercolors
    .filter((w) => w.showInStorefront !== false && w.series === "III")
    .map((w) => ({ type: "watercolor" as const, id: w.id, path: `/watercolors/${w.id}` })),
];

// Ordered to match the print catalog (includes works not for sale in the shop).
export const photographyCatalogNavigableItems = photographyWorks
  .filter((p) => p.printInCatalog !== false)
  .map((p) => ({ type: "photography" as const, id: p.id, path: `/photography/${p.id}` }));

export function getArtboxPrintCount(productId: string): number {
  if (productId === "artbox-watercolor") return watercolors.filter(w => w.includeInArtbox).length;
  if (productId === "artbox-photography") return photographyWorks.filter(w => w.includeInArtbox).length;
  if (productId === "artbox-remains") return remainsWorks.filter(w => w.includeInArtbox).length;
  if (productId === "artbox-spirit") return spiritWorks.filter(w => w.includeInArtbox).length;
  return 0;
}

export const useProducts = (showAll: boolean = false) => {
  return useQuery({
    queryKey: ["products", showAll],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const allCatalogProducts = showAll ? buildCatalogProducts(true) : catalogProducts;
      const printProducts = allCatalogProducts.filter(p => p.category === "Fine Art Prints");
      const cardProducts = allCatalogProducts.filter(p => p.category === "Cards");
      return [...products, ...printProducts, ...cardProducts];
    },
  });
};
