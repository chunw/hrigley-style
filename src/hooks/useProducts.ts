import { useQuery } from "@tanstack/react-query";
import { products } from "@/lib/products";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return products;
    },
  });
};