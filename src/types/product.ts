// types/product.ts

export interface ProductResponse {
  productId: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryName: string;
  sellerName: string;
  sellerId: number;
  status: string;
  imageUrls: string[];

  rating: number;
  reviewCount: number;
}

// pagination wrapper
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

// api wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}