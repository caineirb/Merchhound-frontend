import { CropCanvasProps, DragStateProps, Stock } from '@/types';
import { 
    drawCanvas, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp, 
    handleCropConfirm, 
    handleCropCancel,
    handleImageChange
} from '@/helpers';
import Image from "next/image";
import { useState, useRef, useEffect } from 'react';

interface StockInfoModalProps {
    stockInfo: Stock;
    setStockInfo: (info: Stock) => void;
    onDelete: (stockUUID: string | null) => void;
    onClose: () => void;
    onSave: () => void;
}

const StockInfoModal = ({ stockInfo, setStockInfo, onClose, onSave, onDelete }: StockInfoModalProps) => {
    const [imagePreview, setImagePreview] = useState<string>(stockInfo.image);
    const [showCropper, setShowCropper] = useState<boolean>(false);
    const [originalImage, setOriginalImage] = useState<CropCanvasProps['originalImage']>('');
    const [cropRect, setCropRect] = useState<CropCanvasProps['cropRect']>({
        x: 50,
        y: 50,
        width: 300,
        height: 300
    });
    const [imgDimensions, setImgDimensions] = useState<CropCanvasProps['imgDimensions']>({width: 0, height: 0});
    const [isDragging, setIsDragging] = useState<DragStateProps['isDragging']>(false);
    const [dragType, setDragType] = useState<DragStateProps['dragType']>(null);
    const [dragCorner, setDragCorner] = useState<DragStateProps['dragCorner']>(null);
    const [dragOffset, setDragOffset] = useState<DragStateProps['dragOffset']>({x: 0, y: 0});
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (showCropper && originalImage) {
            drawCanvas({canvasRef, imgDimensions, originalImage, cropRect});
        }
    }, [showCropper, originalImage, cropRect]);

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

    const handleDeleteStock = () => {
        if (confirm('Are you sure you want to delete this stock item?')) {
            onDelete(stockInfo?.stockUuid || null);
            onClose();
        }
    }

    const handleCropConfirmWrapper = () => {
        handleCropConfirm(stockInfo, {
            setImagePreview: (preview: string) => {
                setImagePreview(preview);
                setStockInfo({ ...stockInfo, image: preview });
            },
            setNewStock: setStockInfo,
            setShowCropper,
            originalImage,
            imgDimensions,
            cropRect
        });
    };

    // Cropper UI
    const cropper = (
        <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Drag corners/edges to resize, or drag inside to move</p>
            <div className="border-2 border-gray-300 inline-block">
                <canvas 
                    ref={canvasRef}
                    onMouseDown={(e) => handleMouseDown(e, {canvasRef, imgDimensions, originalImage, cropRect, newStock: stockInfo}, {setIsDragging, setDragType, setDragCorner, setDragOffset})}
                    onMouseMove={(e) => handleMouseMove(e, {canvasRef, imgDimensions, originalImage, cropRect, newStock: stockInfo}, {isDragging, dragType, dragCorner, dragOffset, setCropRect})}
                    onMouseUp={() => handleMouseUp({setIsDragging, setDragType, setDragCorner})}
                    onMouseLeave={(e) => handleMouseUp({setIsDragging, setDragType, setDragCorner})}
                    className="cursor-crosshair"
                />
            </div>
            <div className="flex gap-2 mt-4">
                <button 
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    onClick={() => handleCropCancel(setShowCropper, setOriginalImage)}
                >
                    Cancel
                </button>
                <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={handleCropConfirmWrapper}
                >
                    Confirm Crop
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-[#00000070] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Stock Information</h2>
                    <button 
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        onClick={handleDeleteStock}
                        title="Delete Stock"
                    >
                        Delete
                    </button>
                </div>

                {showCropper ? cropper : (
                    <>
                        <div className="mt-4">
                            <label htmlFor="image-upload" className="block text-sm text-gray-600 mb-2">Product Image*</label>
                            
                            <label htmlFor="image-upload" className="w-full border border-gray-300 border-solid rounded p-2 mb-2 bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center text-gray-600">
                                <span>Choose Image File</span>
                            </label>
                            <input 
                                type="file" 
                                id="image-upload" 
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 
                                    { setOriginalImage,  setImgDimensions }, 
                                    { setCropRect, setShowCropper })}
                                className="hidden"
                            />
                            
                            {imagePreview && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500 mb-1">Current image:</p>
                                    <div className="w-[300px] h-[300px] border border-[#000000] border-solid rounded flex items-center justify-center bg-gray-50">
                                        <Image 
                                            width={300}
                                            height={300}
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Select a new file above to change the image</p>
                                </div>
                            )}
                        </div>

                        <div className="relative mt-4">
                            <input 
                                type="text" 
                                id="stock-name" 
                                value={stockInfo.name} 
                                className="w-full border border-gray-300 border-solid rounded p-2 pt-6" 
                                onChange={(e) => setStockInfo({ ...stockInfo, name: e.target.value })} 
                            />
                            <label htmlFor="stock-name" className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">Name</label>
                        </div>
                        
                        <div className="relative mt-4">
                            <input 
                                type="text" 
                                id="stock-sku" 
                                value={stockInfo.stockUuid} 
                                className="w-full border border-gray-300 border-solid rounded p-2 pt-6" 
                                onChange={(e) => setStockInfo({ ...stockInfo, stockUuid: e.target.value })} 
                            />
                            <label htmlFor="stock-sku" className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">Stock UUID</label>
                        </div>
                        
                        <div className="relative mt-4">
                            <input 
                                type="number" 
                                id="stock-quantity" 
                                value={stockInfo.amount} 
                                className="w-full border border-gray-300 border-solid rounded p-2 pt-6" 
                                onChange={(e) => setStockInfo({ ...stockInfo, amount: parseInt(e.target.value) || 0 })} 
                            />
                            <label htmlFor="stock-quantity" className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">Stock</label>
                        </div>
                        
                        <div className="relative mt-4">
                            <input 
                                type="number" 
                                step="0.01"
                                id="stock-price" 
                                value={stockInfo.price} 
                                className="w-full border border-gray-300 border-solid rounded p-2 pt-6" 
                                onChange={(e) => setStockInfo({ ...stockInfo, price: parseFloat(e.target.value) || 0 })} 
                            />
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
                    </>
                )}
            </div>
        </div>
    );
}

export default StockInfoModal;