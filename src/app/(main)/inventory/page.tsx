'use client';

import React, { useState, useEffect } from 'react'
import StockCard from '@/components/StockCard';
import { Bundle, Item, Product, ProductWithInfo } from '@/types';
import StocksInfoModal from '@/components/StocksInfoModal';
import AddStockModal from '@/components/AddStockModal';
import { fetchProducts, generateFormsTemplate } from '@/helpers';

const InventoryPage = () => {
  const [addStockModal, setAddStockModal] = useState<boolean>(false);
  const [stockInfoModal, setStockInfoModal] = useState<boolean>(false);
  const [stockInfo, setStockInfo] = useState<ProductWithInfo | null>(null);
  const [productsData, setProductsData] = useState<ProductWithInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const products = await fetchProducts();
      setProductsData(products);
      console.log('Fetched products:', products);
    } catch (error) {
      console.error('Failed to load products:', error);
      alert('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const openModal = (productId: string) => {
    const product = productsData.find(p => p.product.product_id === productId);
    if (product) {
      setStockInfo(product);
      setStockInfoModal(true);
    }
  }

  const closeModal = () => {
    setStockInfoModal(false);
    setStockInfo(null);
  }

  const handleAddStock = () => {
    loadProducts();
    setAddStockModal(false);
  }

  const handleUpdateStock = () => {
    loadProducts();
    closeModal();
  }

  const handleDeleteStock = (productId: string) => {
    setProductsData(prevData => prevData.filter(p => p.product.product_id !== productId));
    closeModal();
  }

  const handleGenerateTemplate = async () => {
    try {
      const template = await generateFormsTemplate();
      await navigator.clipboard.writeText(template);
      setIsCopied(true);
      // Reset the copied indicator after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to generate or copy template:', error);
      alert('Failed to generate or copy template. Please try again.');
    }
  }

  // Filter products based on search query and sort by name
  const filteredProducts = productsData
    .filter(({ product }) => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.product_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.product.name.localeCompare(b.product.name));

  if (loading) {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          <p className="text-secondary mt-2">Loading products...</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
        <p className="text-secondary mt-2">
          {productsData.length} product{productsData.length !== 1 ? 's' : ''} available
        </p>
      </div>
      <div className="w-4/5 mx-auto">
        <div className="flex items-center gap-4 m-5">
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search by name, ID, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            onClick={() => setAddStockModal(true)} 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap"
          >
            Add New Stock
          </button>
          <div className="flex-1"></div>
          <button 
            onClick={handleGenerateTemplate}
            className={`px-4 py-2 text-white rounded-lg whitespace-nowrap transition-colors ${
              isCopied 
                ? 'bg-gray-600 hover:bg-gray-700' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isCopied ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied to Clipboard!
              </span>
            ) : (
              'Generate Forms Template'
            )}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 justify-items-center">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(({ product }) => (
              <button 
                key={product.product_id} 
                onClick={() => openModal(product.product_id)}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <StockCard {...product} />
              </button>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              {searchQuery 
                ? `No products found matching "${searchQuery}"` 
                : 'No products available. Click "Add New Stock" to get started.'}
            </div>
          )}
        </div>
      </div>
      {stockInfoModal && stockInfo && (
        <StocksInfoModal 
          productWithInfo={stockInfo}
          onDelete={handleDeleteStock}
          onClose={closeModal}
          onSave={handleUpdateStock}
        />
      )}
      {addStockModal && (
        <AddStockModal 
          onClose={() => setAddStockModal(false)}
          onSave={handleAddStock}
        />
      )}
    </section>
  )
}

export default InventoryPage