import { useQuery } from "@tanstack/react-query";
import { products, productImages, getProductCategories } from "@/lib/products";

export const useProductDetails = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return products.find(p => p.id === productId) || products[0];
    },
    enabled: !!productId,
  });
};

export const useProductImages = (productId: string) => {
  return useQuery({
    queryKey: ["product-images", productId],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return productImages.filter(img => img.product_id === productId) || [];
    },
    enabled: !!productId,
  });
};

export const useRelatedProducts = (category: string, excludeId: string) => {
  return useQuery({
    queryKey: ["related-products", category, excludeId],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return products.filter(p => getProductCategories(p).includes(category) && p.id !== excludeId).slice(0, 4);
    },
    enabled: !!category && !!excludeId,
  });
};