export interface Category {
  categoryId: number;
  name: string;
  parentId?: number;
}

export interface CategoryTree {
  categoryId: number;
  name: string;
  subCategories: CategoryTree[];
}

export interface CreateCategoryRequest {
  name: string;
  parentId?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
}
