import { useQuery } from "@tanstack/react-query";
import { products } from "@/lib/products";
import { watercolors } from "@/lib/watercolors";
import { photographyWorks } from "@/lib/photography";

const catalogProducts = [
  ...watercolors
    .filter((w) => w.showInStorefront)
    .map((w) => {
      const paddedId = w.id.padStart(2, "0");
      return {
        id: `watercolor-${w.id}`,
        name: w.title,
        title: w.title,
        title_zh: w.titleZh ?? null,
        description: w.description ?? null,
        description_zh: w.descriptionZh ?? null,
        price: w.price ?? 0,
        currency: "USD",
        image_url: `/watercolors/${paddedId}/main.jpg`,
        category: "Watercolor",
        category_zh: "水彩",
        paylink: w.paylink ?? "",
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
      return {
        id: `photography-${p.id}`,
        name: p.title,
        title: p.title,
        title_zh: p.titleZh ?? null,
        description: p.description ?? null,
        description_zh: p.descriptionZh ?? null,
        price: p.price ?? 0,
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

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const photographyProducts = catalogProducts.filter(p => p.category === "Photography");
      const watercolorProducts = catalogProducts.filter(p => p.category === "Watercolor");
      return [...products, ...photographyProducts, ...watercolorProducts];
    },
  });
};
