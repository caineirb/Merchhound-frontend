'use client';

import Image from "next/image";
import { Stock } from '@/types/index';
import { Socket } from "dgram";

const cardDimensions = {
    width: '200px',
    height: '300px',
};
const tempPicsLoc = '/temp-pics';

const StockCard = (stock: Stock) => {
    return (
        <div className="bg-background p-4 rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow duration-300" style={cardDimensions}>
            <div className="flex flex-col h-full space-y-3">
                {/* Product Image */}
                <div className="flex justify-center">
                    <Image
                        src={stock?.image || `${tempPicsLoc}/lanyard.jpg`}
                        alt="Product Image"
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-full border border-[#000000] border-solid"
                    />
                </div>
                
                {/* Product Info */}
                <div className="text-center space-y-1 flex-grow">
                    <h3 className="text-base font-semibold text-foreground">{stock.name}</h3>
                    <div className="space-y-1">
                        <p className="text-secondary text-xs">UUID: {stock.stockUuid}</p>
                        <p className="text-accent font-medium text-sm">Stock: {stock.amount} piece(s)</p>
                    </div>
                </div>
                
                {/* Price and Status */}
                <div className="flex justify-between items-center py-1 border-t border-border">
                    <span className="text-sm font-bold text-foreground">&#8369;{stock.price.toFixed(2)}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${stock.amount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {stock.amount > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default StockCard;