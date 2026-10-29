import type { PaginationParams } from "./query-params";

// Query Key Factory & Cache Strategy
export const CACHE = {
  product: {
    all: ["products"] as const,
    list: (params: PaginationParams) => [...CACHE.product.all, "list", params] as const,
    detail: (id: string) => [...CACHE.product.all, "detail", id] as const,
  },
  
  user: {
    all: ["users"] as const,
    profile: () => [...CACHE.user.all, "profile"] as const,
  },

  strategy: {
    // realtime data
    realtime: { 
      staleTime: 0, 
      refetchInterval: 1000 
    },
    // standard data
    standard: { 
      staleTime: 5 * 60 * 1000 
    },
    // static data
    static: { 
      staleTime: Infinity 
    }
  }
};
