export interface CartItem {
  cartItemId: number;
  productId: number;
  productName?: string;
  productPrice?: number;
  imageUrl?: string;
  quantity: number;
}

export interface Cart {
  cartId: number;
  items: CartItem[];
}

export interface AddItemToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemQuantityRequest {
  quantity: number;
}
