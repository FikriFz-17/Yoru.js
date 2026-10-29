// Example how you can create api client
import { apiClient } from "../base";
import type { Product, GetProductsResponse, AddProductRequest } from "../types/product";
import type { PaginationParams } from "../query-params";

// GET: get all product
export const getProducts = async (params?: PaginationParams): Promise<GetProductsResponse> => {
  const { data } = await apiClient.get<GetProductsResponse>("/products", { params });
  return data;
};

// POST: add new product
export const addProduct = async (request: AddProductRequest): Promise<Product> => {
  const { data } = await apiClient.post<Product>("/products", request);
  return data;
};

