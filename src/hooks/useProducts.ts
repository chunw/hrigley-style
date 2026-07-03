import { useQuery } from "@tanstack/react-query";
import { products } from "@/lib/products";
import { watercolors, studioCardPayLink } from "@/lib/watercolors";
import { photographyWorks } from "@/lib/photography";

const DEFAULT_PRINT_INFO = '9×12" fine art matte paper print';
const DEFAULT_PRINT_INFO_ZH = '9×12英寸精细艺术哑光纸印刷品';
const DEFAULT_PRINT_PRICE = 10;

const buildDescription = (desc: string | undefined | null, printInfo: string) => {
  const base = desc?.trim();
  return base ? `${base} · ${printInfo}` : printInfo;
};

const catalogProducts = [
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
        price: w.printPrice ?? DEFAULT_PRINT_PRICE,
        currency: "USD",
        image_url: `/watercolors/${paddedId}/main.jpg`,
        category: w.series === "III" ? "Cards" : "Watercolor",
        category_zh: w.series === "III" ? "卡片" : "水彩",
        paylink: w.series === "III" ? studioCardPayLink(w.title) : (w.paylink ?? ""),
        showInStorefront: true,
        detailPath: `/watercolors/${w.id}`,
        is_active: true,
        created_at: new Date().toISOString(),
      };
    }),
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
        currency: "USD",
        image_url: `/photography/${paddedId}/main.jpg`,
        category: "Photography",
        category_zh: "摄影",
        paylink: p.paylink ?? "",
        showInStorefront: true,
        detailPath: `/photography/${p.id}`,
        is_active: true,
        created_at: new Date().toISOString(),
      };
    }),
];

// Ordered to match the shop grid: photography first, then watercolors.
// Used by detail pages so prev/next matches what the visitor sees in the grid.
export const shopOrderNavigableItems = [
  ...photographyWorks
    .filter((p) => p.showInStorefront)
    .map((p) => ({ type: "photography" as const, id: p.id, path: `/photography/${p.id}` })),
  ...watercolors
    .filter((w) => w.showInStorefront !== false)
    .map((w) => ({ type: "watercolor" as const, id: w.id, path: `/watercolors/${w.id}` })),
];

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const photographyProducts = catalogProducts.filter(p => p.category === "Photography");
      const watercolorProducts = catalogProducts.filter(p => p.category === "Watercolor");
      const cardProducts = catalogProducts.filter(p => p.category === "Cards");
      return [...products, ...photographyProducts, ...watercolorProducts, ...cardProducts];
    },
  });
};
