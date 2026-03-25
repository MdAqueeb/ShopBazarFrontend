export interface Inventory {
  productId: number;
  stockQuantity: number;
  reservedQuantity: number;
}

export interface CreateInventoryRequest {
  productId: number;
  stock: number;
}

export interface StockOperationRequest {
  quantity: number;
}

export interface UpdateInventoryRequest {
  stock: number;
}
