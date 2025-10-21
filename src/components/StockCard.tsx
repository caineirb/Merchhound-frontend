'use client';

import Image from "next/image";
import { Product } from '@/types/index';

const cardDimensions = {
    width: '200px',
    height: '300px',
};

interface StockCardProps extends Product {}

const StockCard = ({ product_id, name, type, product_image, price, created_at }: StockCardProps) => {
    return (
        <div 
            className="bg-background p-4 rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow duration-300" 
            style={cardDimensions}
        >
            <div className="flex flex-col h-full space-y-3">
                {/* Product Image */}
                <div className="flex justify-center">
                    {product_image && (product_image.startsWith('data:') || product_image.startsWith('/')) ? (
                        <div className="relative w-20 h-20">
                            <Image
                                src={product_image}
                                alt={`${name} product image`}
                                fill
                                className="object-cover rounded-full border border-[#000000] border-solid"
                                sizes="80px"
                                unoptimized={product_image.startsWith('data:')}
                            />
                        </div>
                    ) : product_image ? (
                        // For external URLs, use regular img tag
                        <div className="w-20 h-20">
                            <img
                                src={product_image}
                                alt={`${name} product image`}
                                className="w-full h-full object-cover rounded-full border border-[#000000] border-solid"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/temp-pics/lanyard.jpg';
                                }}
                            />
                        </div>
                    ) : (
                        // Fallback to default image
                        <div className="relative w-20 h-20">
                            <Image
                                src="/temp-pics/lanyard.jpg"
                                alt="Default product image"
                                fill
                                className="object-cover rounded-full border border-[#000000] border-solid"
                                sizes="80px"
                            />
                        </div>
                    )}
                </div>
                
                {/* Product Info */}
                <div className="text-center space-y-1 flex-grow">
                    <h3 className="text-base font-semibold text-foreground line-clamp-2" title={name}>
                        {name}
                    </h3>
                    <div className="space-y-1">
                        <p className="text-secondary text-xs uppercase font-medium">{type}</p>
                        <p className="text-secondary text-xs font-mono truncate" title={product_id}>
                            ID: {product_id.slice(0, 8)}...
                        </p>
                    </div>
                </div>
                
                {/* Price */}
                <div className="flex justify-center items-center py-2 border-t border-border">
                    <span className="text-lg font-bold text-foreground">
                        ₱{price}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default StockCard;