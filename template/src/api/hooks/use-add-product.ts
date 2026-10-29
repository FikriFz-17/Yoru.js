import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct } from "../client/product";
import type { AddProductRequest } from "../types/product";
import {CACHE} from "../cache"

/**
 * Example hook for POST request (add product).
 * 
 * This example hook performs a POST request to the /product endpoint.
 * It uses the standard mutation strategy (invalidate cache on success).
 * 
 * @param request Object containing the product data to add
 * @returns Object from React Query (mutate, isPending, error, etc)
 */

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddProductRequest) => addProduct(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE.product.all });
    },
  });
};
