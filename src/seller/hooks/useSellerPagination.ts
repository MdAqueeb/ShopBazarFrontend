import { useState, useCallback } from 'react';

interface UseSellerPaginationOptions {
  initialPage?: number;
  initialSize?: number;
  initialFilter?: string;
}

export default function useSellerPagination({
  initialPage = 0,
  initialSize = 10,
  initialFilter = '',
}: UseSellerPaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [size] = useState(initialSize);
  const [filter, setFilter] = useState(initialFilter);

  const onPageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const onFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter);
    setPage(0);
  }, []);

  const params = {
    page,
    size,
    ...(filter ? { status: filter } : {}),
  };

  return { page, size, filter, params, onPageChange, onFilterChange };
}
