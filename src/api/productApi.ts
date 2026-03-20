// api/productApi.ts
import axios from "axios";
import type { ApiResponse, PageResponse, ProductResponse } from "../types/product";

const API = "http://localhost:8080/api";

export const fetchProducts = async (page = 0, size = 10) => {
  const response = await axios.get<ApiResponse<PageResponse<ProductResponse>>>(
    `${API}/products?page=${page}&size=${size}`
  );
  return response.data;
};