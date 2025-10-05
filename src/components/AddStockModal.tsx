import { CropCanvasProps, DragStateProps, Stock } from '@/types';
import { generateUUID } from '@/helpers';
import Image from "next/image";
import { useState, useRef, useEffect } from 'react';
import {
    drawCanvas, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp, 
    handleCropConfirm, 
    handleCropCancel,
    handleImageChange 
} from '@/helpers';

interface AddStockModalProps {
    setTempStockData: (stocks: Stock[]) => void;
    tempStockData: Stock[];
    onClose: () => void;
}

const AddStockModal = ({ setTempStockData, tempStockData, onClose }: AddStockModalProps) => {
    const [newStock, setNewStock] = useState<Stock>({
        name: '',
        stockUuid: generateUUID(),
        amount: 0,
        price: 0,
        image: ''
    });
    const [imagePreview, setImagePreview] = useState<string>(newStock.image);
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
        return newStock.name.trim() !== '' && newStock.amount >= 0 && newStock.price >= 0 && newStock.image !== '';
    }

    const handleSave = () => {
        if (!checkFields()) {
            alert('Please fill in all fields and select an image.');
            return;
        }

        const newStocks = [...tempStockData, newStock];
        setTempStockData(newStocks);
        onClose();
    };

    // Cropper UI
    const cropper = (
        <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Drag corners/edges to resize, or drag inside to move</p>
            <div className="border-2 border-gray-300 inline-block">
                <canvas 
                    ref={canvasRef}
                    onMouseDown={(e) => handleMouseDown(e, {canvasRef, imgDimensions, originalImage, cropRect, newStock}, {setIsDragging, setDragType, setDragCorner, setDragOffset})}
                    onMouseMove={(e) => handleMouseMove(e, {canvasRef, imgDimensions, originalImage, cropRect, newStock}, {isDragging, dragType, dragCorner, dragOffset, setCropRect})}
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
                    onClick={() => handleCropConfirm(newStock, {setImagePreview, setNewStock, setShowCropper, originalImage, imgDimensions, cropRect})}
                >
                    Confirm Crop
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-[#00000070] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold">Add New Stock</h2>

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
                                value={newStock.name}
                                className="w-full border border-gray-300 border-solid rounded p-2 pt-6" 
                                onChange={(e) => setNewStock({ ...newStock, name: e.target.value })} 
                            />
                            <label htmlFor="stock-name" className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">Name*</label>
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
                    </>
                )}
            </div>
        </div>
    );
}

export default AddStockModal;