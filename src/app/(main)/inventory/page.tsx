'use client';

import React, { useState, useEffect } from 'react'
import StockCard from '@/components/StockCard';
import { Stock } from '@/types';
import StocksInfoModal from '@/components/StocksInfoModal';
import AddStockModal from '@/components/AddStockModal';

const InventoryPage = () => {
  const [addStockModal, setAddStockModal] = useState<boolean>(false);
  const [stockInfoModal, setStockInfoModal] = useState<boolean>(false);
  const [stockInfo, setStockInfo] = useState<Stock | null>(null);
  const [tempStockData, setTempStockData] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Generate data on client side to avoid hydration mismatch
  useEffect(() => {
    const data: Stock[] = Array.from({ length: 20 }, (_, index) => ({
      name: `Product ${index + 1}`,
      stockUuid: `UUID-${index + 1}`,
      amount: Math.floor(Math.random() * 100),
      price: parseFloat((Math.random() * 100).toFixed(2)),
      image: `/temp-pics/lanyard.jpg`,
    }));
    setTempStockData(data);
  }, []);
  
  const openModal = (index: number) => {
    setStockInfo(tempStockData[index]);
    setStockInfoModal(true);
  }

  const closeModal = () => {
    setStockInfoModal(false);
    setStockInfo(null);
  }

  const updateStockData = (updatedStock: Stock) => {
    setTempStockData(prevData => 
      prevData.map(stock => 
        stock.stockUuid === updatedStock.stockUuid ? updatedStock : stock
      )
    );
  }

  const handleStockInfoChange = (updatedStock: Stock) => {
    // Only update the modal's local state, not the main data
    setStockInfo(updatedStock);
  }

  const saveStockChanges = () => {
    if (stockInfo) {
      updateStockData(stockInfo);
    }
  }

  const handleDeleteStock = (stockUuid: string | null) => {
    if (stockUuid) {
      setTempStockData(prevData => prevData.filter(stock => stock.stockUuid !== stockUuid));
    }
    closeModal();
  }

  // Filter stocks based on search query
  const filteredStocks = tempStockData.filter(stock =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.stockUuid?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Don't render anything until data is loaded
  if (tempStockData.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          <p className="text-secondary mt-2">Loading...</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
      </div>
      <div className="w-4/5 mx-auto">
        <div className="flex items-center gap-4 m-5">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search stocks..."
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
          <button onClick={() => setAddStockModal(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap">Add New Stock</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 justify-items-center">
          {/* Stock Cards */}
          {filteredStocks.length > 0 ? (
            filteredStocks.map((stock, index) => {
              const originalIndex = tempStockData.findIndex(s => s.stockUuid === stock.stockUuid);
              return (
                <button key={stock.stockUuid || index} 
                  onClick={() => { openModal(originalIndex) }}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <StockCard {...stock} />
                </button>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              {searchQuery ? `No stocks found matching "${searchQuery}"` : 'No stocks available'}
            </div>
          )}
        </div>
      </div>
      {stockInfoModal && stockInfo && (
        <StocksInfoModal 
          stockInfo={stockInfo} 
          setStockInfo={handleStockInfoChange}
          onDelete={() => handleDeleteStock(stockInfo?.stockUuid || null)}
          onClose={closeModal}
          onSave={saveStockChanges}
        />
      )}
      {addStockModal && (
        <AddStockModal 
          setTempStockData={setTempStockData}
          tempStockData={tempStockData}
          onClose={() => setAddStockModal(false)}
        />
      )}
    </section>
  )
}

export default InventoryPage