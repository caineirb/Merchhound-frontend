import { Stock } from '@/types';
import Image from "next/image";

interface StockInfoModalProps {
    stockInfo: Stock;
    setStockInfo: (info: Stock) => void;
    onClose: () => void;
    onSave: () => void;
}

const StockInfoModal = ({ stockInfo, setStockInfo, onClose, onSave }: StockInfoModalProps) => {
    const checkFields = () => {
        return stockInfo.name.trim() !== '' && stockInfo.amount >= 0 && stockInfo.price >= 0 && stockInfo.image !== '';
    }

    const handleSave = () => {
        if (!checkFields()) {
            alert('Please fill in all fields and select an image.');
            return;
        }
        onSave();
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-[#00000070] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold ">Stock Information</h2>
                <div className="flex justify-center mt-4">
                    <Image 
                        width={150}
                        height={150}
                        src={stockInfo.image} 
                        alt={stockInfo.name} 
                        className="w-[200px] h-[200px] object-cover rounded border border-[#000000] border-solid"
                    />
                </div>
                <div className="relative mt-4">
                    <input type="text" id="stock-name" value={stockInfo.name} className="w-full border border-gray-300 border-solid rounded p-2 pt-6" onChange={(e) => setStockInfo({ ...stockInfo, name: e.target.value })} />
                    <label htmlFor="stock-name" className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">Name</label>
                </div>
                
                <div className="relative mt-4">
                    <input type="text" id="stock-sku" value={stockInfo.stockUuid} className="w-full border border-gray-300 border-solid rounded p-2 pt-6" onChange={(e) => setStockInfo({ ...stockInfo, stockUuid: e.target.value })} />
                    <label htmlFor="stock-sku" className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">Stock UUID</label>
                </div>
                
                <div className="relative mt-4">
                    <input type="number" id="stock-quantity" value={stockInfo.amount} className="w-full border border-gray-300 border-solid rounded p-2 pt-6" onChange={(e) => setStockInfo({ ...stockInfo, amount: parseInt(e.target.value) })} />
                    <label htmlFor="stock-quantity" className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">Stock</label>
                </div>
                
                <div className="relative mt-4">
                    <input type="text" id="stock-price" value={`${stockInfo.price.toFixed(2)}`} className="w-full border border-gray-300 border-solid rounded p-2 pt-6" onChange={(e) => setStockInfo({ ...stockInfo, price: parseFloat(e.target.value) })} />
                    <label htmlFor="stock-price" className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">Price (&#8369;)</label>
                </div>
                
                <div className="flex justify-between mt-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={onClose}>
                        Close
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StockInfoModal;