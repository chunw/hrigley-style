import { useQuery } from "@tanstack/react-query";

// Mock product data
const mockProducts = [
  {
    id: "1",
    title: "Product 1",
    name: "Product 1",
    price: 29.99,
    currency: "USD",
    description: "High quality product",
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
    description: "Premium quality product",
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    is_active: true,
    category: "fashion",
    created_at: new Date().toISOString(),
  },
];

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockProducts;
    },
  });
};