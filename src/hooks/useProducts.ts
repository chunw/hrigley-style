import { useQuery } from "@tanstack/react-query";
import { products } from "@/lib/products";
import { watercolors, studioCardPayLink, PRINT_9X12_PAYLINK } from "@/lib/watercolors";
import { photographyWorks } from "@/lib/photography";
import { remainsWorks } from "@/lib/remains";
import { spiritWorks } from "@/lib/21spirit";

const DEFAULT_PRINT_INFO = '9×12" fine art matte paper print';
const DEFAULT_PRINT_INFO_ZH = '23×30厘米精细艺术哑光纸印刷品';
const DEFAULT_PRINT_PRICE = 10;

const buildDescription = (desc: string | undefined | null, printInfo: string) => {
  const base = desc?.trim();
  return base ? `${base} · ${printInfo}` : printInfo;
};

const catalogProducts = [
  ...photographyWorks
    .filter((p) => p.showInStorefront)
    .map((p) => {
      const paddedId = p.id.padStart(2, "0");
      const printInfo = p.printInfo ?? DEFAULT_PRINT_INFO;
      const printInfoZh = p.printInfoZh ?? DEFAULT_PRINT_INFO_ZH;
      return {
        id: `photography-${p.id}`,
        name: p.title,
        title: p.title,
        title_zh: p.titleZh ?? null,
        description: buildDescription(p.description, printInfo),
        description_zh: buildDescription(p.descriptionZh, printInfoZh),
        price: p.printPrice ?? DEFAULT_PRINT_PRICE,
        priceLabel: p.printPrice && p.printPrice12x18 ? `$${p.printPrice} / $${p.printPrice12x18}` : undefined,
        currency: "USD",
        image_url: `/photography/${paddedId}/main.jpg`,
        category: "Fine Art Print",
        category_zh: "版画",
        paylink: p.paylink ?? PRINT_9X12_PAYLINK,
        showInStorefront: true,
        detailPath: `/photography/${p.id}`,
        is_active: true,
        created_at: new Date().toISOString(),
      };
    }),
  ...remainsWorks.map((w) => {
    const paddedId = w.id.padStart(2, "0");
    return {
      id: `remains-${w.id}`,
      name: w.title,
      title: w.title,
      title_zh: w.titleZh ?? null,
      description: buildDescription(w.description, '4×6" print on matte fine art paper'),
      description_zh: buildDescription(w.descriptionZh, "4×6英寸哑光艺术纸印刷品"),
      price: w.price ?? 4,
      currency: "USD",
      image_url: `/remains/${paddedId}/main.jpg`,
      category: "Fine Art Print",
      category_zh: "版画",
      paylink: w.paylink ?? studioCardPayLink(w.title),
      showInStorefront: true,
      detailPath: `/remains/${w.id}`,
      is_active: true,
      created_at: new Date().toISOString(),
    };
  }),
  ...spiritWorks.map((w) => {
    const paddedId = w.id.padStart(2, "0");
    return {
      id: `spirit-${w.id}`,
      name: w.title,
      title: w.title,
      title_zh: w.titleZh ?? null,
      description: buildDescription(w.description, '4×6" print on matte fine art paper'),
      description_zh: buildDescription(w.descriptionZh, "4×6英寸哑光艺术纸印刷品"),
      price: w.price ?? 4,
      priceLabel: w.priceLabel,
      currency: "USD",
      image_url: `/21spirit/${paddedId}/main.jpg`,
      category: "Fine Art Print",
      category_zh: "版画",
      paylink: w.paylink ?? studioCardPayLink(w.title),
      showInStorefront: true,
      detailPath: `/21spirit/${w.id}`,
      is_active: true,
      created_at: new Date().toISOString(),
    };
  }),
  ...watercolors
    .filter((w) => w.showInStorefront)
    .map((w) => {
      const paddedId = w.id.padStart(2, "0");
      const printInfo = w.printInfo ?? DEFAULT_PRINT_INFO;
      const printInfoZh = w.printInfoZh ?? DEFAULT_PRINT_INFO_ZH;
      return {
        id: `watercolor-${w.id}`,
        name: w.title,
        title: w.title,
        title_zh: w.titleZh ?? null,
        description: buildDescription(w.description, printInfo),
        description_zh: buildDescription(w.descriptionZh, printInfoZh),
        price: w.price ?? w.printPrice ?? DEFAULT_PRINT_PRICE,
        currency: "USD",
        image_url: `/watercolors/${paddedId}/main.jpg`,
        category: w.series === "III" ? "Cards" : "Fine Art Print",
        category_zh: w.series === "III" ? "卡片" : "版画",
        paylink: w.series === "III" ? studioCardPayLink(w.title) : (w.paylink ?? PRINT_9X12_PAYLINK),
        showInStorefront: true,
        detailPath: `/watercolors/${w.id}`,
        is_active: true,
        created_at: new Date().toISOString(),
      };
    }),
];

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
    .map((w) => ({ type: "remains" as const, id: w.id, path: `/remains/${w.id}` })),
  ...spiritWorks
    .map((w) => ({ type: "spirit" as const, id: w.id, path: `/21spirit/${w.id}` })),
  // Watercolors: prints (I & II) immediately before cards (III)
  ...watercolors
    .filter((w) => w.showInStorefront !== false && w.series !== "III")
    .map((w) => ({ type: "watercolor" as const, id: w.id, path: `/watercolors/${w.id}` })),
  ...watercolors
    .filter((w) => w.showInStorefront !== false && w.series === "III")
    .map((w) => ({ type: "watercolor" as const, id: w.id, path: `/watercolors/${w.id}` })),
];

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const printProducts = catalogProducts.filter(p => p.category === "Fine Art Print");
      const cardProducts = catalogProducts.filter(p => p.category === "Cards");
      return [...products, ...printProducts, ...cardProducts];
    },
  });
};
