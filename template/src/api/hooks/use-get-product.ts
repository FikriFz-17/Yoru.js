import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../client/product";
import type { PaginationParams } from "../query-params";
import {CACHE} from "../cache";

/**
 * This example hook performs a GET request to the /product endpoint with pagination parameters.
 * It uses the standard cache strategy (5 minutes).
 * 
 * @param params Object containing optional filter, limit, and page parameters for pagination
 * @returns Object from React Query (data, isLoading, isError, etc)
 */

export const useGetProducts = (params: PaginationParams) => {
    return useQuery({
        queryKey: CACHE.product.list(params),
        queryFn: () => getProducts(params),
        ...CACHE.strategy.standard
    });
};
