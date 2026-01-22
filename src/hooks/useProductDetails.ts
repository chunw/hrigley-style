import { useQuery } from "@tanstack/react-query";

// Mock product data
const mockProducts = [
  {
    id: "1",
    title: "Product 1",
    name: "Product 1",
    price: 29.99,
    currency: "USD",
    description: "High quality product with excellent features",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    is_active: true,
    category: "electronics",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Product 2",
    name: "Product 2",
    price: 39.99,
    currency: "USD",
    description: "Premium quality product for everyday use",
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    is_active: true,
    category: "fashion",
    created_at: new Date().toISOString(),
  },
];

const mockProductImages = [
  { id: "1", product_id: "1", image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", display_order: 0 },
  { id: "2", product_id: "2", image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30", display_order: 0 },
];

export const useProductDetails = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockProducts.find(p => p.id === productId) || mockProducts[0];
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
      return mockProductImages.filter(img => img.product_id === productId) || [];
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
      return mockProducts.filter(p => p.category === category && p.id !== excludeId).slice(0, 4);
    },
    enabled: !!category && !!excludeId,
  });
};