import type { ProductResponse } from './product';

export interface SearchProductsResponse {
  products: ProductResponse[];
}

export interface SuggestionsResponse {
  suggestions: string[];
}

export interface SearchQueryParams {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  size?: number;
}
