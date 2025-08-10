import React from 'react'
import StockCard from '@/components/StockCard';
import { StockCardProps } from '@/components/StockCard';

// Temporary data for demonstration
const tempStockData: StockCardProps[] = Array.from({ length: 20 }, (_, index) => ({
    name: `Product ${index + 1}`,
    sku: `SKU-${index + 1}`,
    stock: Math.floor(Math.random() * 100),
    price: parseFloat((Math.random() * 100).toFixed(2)),
    image: `/temp-pics/lanyard.jpg`,
}));

const InventoryPage = () => {
  const tempStockCards = Array.from({ length: tempStockData.length }, (_, index) => (
    <StockCard key={index} {...tempStockData[index]} />
  ));
  
  return (
    <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          <p className="text-secondary mt-2">Manage your product stock and details</p>
        </div>
        
        <div className="w-4/5 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 justify-items-center">
            {/* Example Stock Cards */}
            {tempStockCards}
          </div>
        </div>
    </section>
  )
}

export default InventoryPage