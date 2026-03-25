export interface ProductResponse {
  productId: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryName: string;
  sellerName?: string;
  sellerId: number;
  categoryId?: number;
  status: string;
  blockReason?: string;
  createdAt?: string;
  imageUrls: string[];
  rating: number;
  reviewCount: number;
}

export interface CreateProductRequest {
  sellerId: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  status: string;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
}

export interface ProductImageResponse {
  imageId: number;
  imageUrl: string;
  productId: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  page?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}