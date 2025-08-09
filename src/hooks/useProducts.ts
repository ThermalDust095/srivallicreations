import { useState, useEffect } from 'react';
import { Product } from '../types/Product';
import { fetchProducts, fetchAllProducts } from '../api/apiClient';
import { useApi } from './useApi';

export function useProductList(fetchAll = false) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const { loading, error, execute } = useApi<{ results: Product[]; totalCount: number }>();

  const loadProducts = async (page = 1) => {
    const apiCall = fetchAll ? fetchAllProducts : () => fetchProducts(page);
    
    const result = await execute(apiCall, {
      showErrorToast: true,
      onSuccess: (data) => {
        setProducts(data.results);
        setTotalCount(data.totalCount);
      }
    });
    
    return result;
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    totalCount,
    loading,
    error,
    refetch: loadProducts,
    setProducts,
  };
}