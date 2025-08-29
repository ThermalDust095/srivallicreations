import React, { useState, useMemo, useEffect } from 'react';
import {SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../store/ProductContext';
import ProductGrid from '../components/product/ProductGrid';
import { ProductGridLoading } from '../components/layout/Loading';
import { fetchProducts } from '../services/api';
import showToast from '../components/ui/Toast';
import { Pagination, Stack } from '@mui/material';


const ITEMS_PER_PAGE = 10;

const ProductsPage: React.FC = () => {
  const { products, setProducts } = useProducts();
  
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1)
  
useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        // Pass all filter and pagination state to your fetch function
        const data = await fetchProducts(currentPage);
        
        setProducts(data.results);
        setTotalCount(data.totalCount)

      } catch (err) {
        showToast.error('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [currentPage]); // Dependency array is the key

  // --- Event Handlers ---
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const pageCount = useMemo(
    () => Math.ceil(totalCount / ITEMS_PER_PAGE),
    [totalCount]
);


  console.log(`page: ${pageCount}, total: ${totalCount}`)


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Collection</h1>
          <p className="text-lg text-gray-600">Discover amazing pieces that define your style</p>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {products.length} of {totalCount} products
          </p>
        </div>


        {/* Products Grid */}
        {isLoading ? <ProductGridLoading/> : <ProductGrid products={products} />}


          {/* 6. Add the Pagination Component */}
        <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
          {pageCount > 1 && (
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={handlePageChange}
              color="secondary"
              size="large"
            />
          )}
        </Stack>

      </div>
    </div>
  );
};

export default ProductsPage;