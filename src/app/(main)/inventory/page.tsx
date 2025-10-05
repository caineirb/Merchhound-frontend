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
        <button onClick={() => setAddStockModal(true)} className="px-4 py-2 m-5 bg-green-600 text-white rounded-lg hover:bg-green-700">Add New Stock</button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 justify-items-center">
          {/* Example Stock Cards */}
          {Array.from({ length: tempStockData.length }, (_, index) => (
              <button key={index} 
                onClick={() => { openModal(index) }}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <StockCard {...tempStockData[index]} />
              </button>
            ))
          }
        </div>
      </div>
      {stockInfoModal && stockInfo && (
        <StocksInfoModal 
          stockInfo={stockInfo} 
          setStockInfo={handleStockInfoChange}
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