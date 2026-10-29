// this is how you can type your api types
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface GetProductsResponse {
  data: Product[];
  total: number;
}

export interface AddProductRequest {
    name: string;
    price: number;
    description: string;
}




