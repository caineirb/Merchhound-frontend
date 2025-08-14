import { Stock } from '@/types';
import Image from "next/image";
import { useState } from 'react';

interface AddStockModalProps {
    setTempStockData: (stocks: Stock[]) => void;
    tempStockData: Stock[];
    onClose: () => void;
}

// Function to generate a random UUID
// TODO!: This is only temporary, implement in the backend
const generateUUID = (): string => {
    return 'xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const AddStockModal = ({ setTempStockData, tempStockData, onClose }: AddStockModalProps) => {
    const [newStock, setNewStock] = useState<Stock>({
        name: '',
        stockUuid: generateUUID(), // Generate random UUID on initialization
        amount: 0,
        price: 0,
        image: ''
    });

    const [imagePreview, setImagePreview] = useState<string>('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setImagePreview(result);
                setNewStock({ ...newStock, image: result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        const newStocks = [...tempStockData, newStock];
        setTempStockData(newStocks);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[#00000070] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold ">Add New Stock</h2>
                
                {/* Image Upload Section */}
                <div className="mt-4">
                    <label htmlFor="image-upload" className="block text-sm text-gray-600 mb-2">Product Image</label>
                    
                    {/* Always show file input */}
                    <input 
                        type="file" 
                        id="image-upload" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border border-gray-300 border-solid rounded p-2 mb-2"
                    />
                    
                    {/* Show current image preview if exists */}
                    {imagePreview && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Current image:</p>
                            <Image 
                                width={100}
                                height={100}
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full h-auto max-h-32 object-cover rounded border border-[#000000] border-solid"
                            />
                            <p className="text-xs text-gray-500 mt-1">Select a new file above to change the image</p>
                        </div>
                    )}
                </div>

                <div className="relative mt-4">
                    <input 
                        type="text" 
                        id="stock-name" 
                        value={newStock.name}
                        className="w-full border border-gray-300 border-solid rounded p-2 pt-6" 
                        onChange={(e) => setNewStock({ ...newStock, name: e.target.value })} 
                    />
                    <label htmlFor="stock-name" className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">Name</label>
                </div>
                
                <div className="relative mt-4">
                    <input 
                        type="text" 
                        id="stock-uuid" 
                        value={newStock.stockUuid}
                        className="w-full border border-gray-300 border-solid rounded p-2 pt-6 bg-gray-100" 
                        readOnly
                    />
                    <label htmlFor="stock-uuid" className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">Stock UUID (Auto-generated)</label>
                </div>
                
                <div className="relative mt-4">
                    <input 
                        type="number" 
                        id="stock-quantity" 
                        value={newStock.amount}
                        className="w-full border border-gray-300 border-solid rounded p-2 pt-6" 
                        onChange={(e) => setNewStock({ ...newStock, amount: parseInt(e.target.value) || 0 })}
                    />
                    <label htmlFor="stock-quantity" className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">Stock Amount</label>
                </div>
                
                <div className="relative mt-4">
                    <input 
                        type="number" 
                        step="0.01"
                        id="stock-price" 
                        value={newStock.price}
                        className="w-full border border-gray-300 border-solid rounded p-2 pt-6" 
                        onChange={(e) => setNewStock({ ...newStock, price: parseFloat(e.target.value) || 0 })} 
                    />
                    <label htmlFor="stock-price" className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">Price (&#8369;)</label>
                </div>
                
                <div className="flex justify-between mt-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" onClick={handleSave}>
                        Add Stock
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddStockModal;