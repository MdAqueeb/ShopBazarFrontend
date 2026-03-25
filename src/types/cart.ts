export interface CartItem {
  cartItemId: number;
  productId: number;
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
