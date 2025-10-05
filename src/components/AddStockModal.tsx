import { Stock } from '@/types';
import { generateUUID } from '@/helpers';
import Image from "next/image";
import { useState, useRef, useEffect } from 'react';

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
    const [imagePreview, setImagePreview] = useState<string>('');
    const [showCropper, setShowCropper] = useState<boolean>(false);
    const [originalImage, setOriginalImage] = useState<string>('');
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [cropRect, setCropRect] = useState<{x: number, y: number, width: number, height: number}>({
        x: 50,
        y: 50,
        width: 300,
        height: 300
    });
    const [dragType, setDragType] = useState<'corner' | 'edge' | 'move' | null>(null);
    const [dragCorner, setDragCorner] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState<{x: number, y: number}>({x: 0, y: 0});
    const [imgDimensions, setImgDimensions] = useState<{width: number, height: number}>({width: 0, height: 0});

    useEffect(() => {
        if (showCropper && originalImage) {
            drawCanvas();
        }
    }, [showCropper, originalImage, cropRect]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setOriginalImage(result);
                
                const img = document.createElement('img');
                img.onload = () => {
                    const maxWidth = 600;
                    const scale = Math.min(1, maxWidth / img.width);
                    const width = img.width * scale;
                    const height = img.height * scale;
                    
                    setImgDimensions({width, height});
                    
                    const margin = 50;
                    const rectSize = Math.min(width, height) - (margin * 2);
                    setCropRect({
                        x: margin,
                        y: margin,
                        width: rectSize,
                        height: rectSize
                    });
                    
                    setShowCropper(true);
                };
                img.src = result;
            };
            reader.readAsDataURL(file);
        }
    };

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !originalImage) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const img = document.createElement('img');
        img.onload = () => {
            canvas.width = imgDimensions.width;
            canvas.height = imgDimensions.height;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, imgDimensions.width, imgDimensions.height);
            
            // Darken everything
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Clear the crop rectangle area and redraw the correct portion
            ctx.clearRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
            
            // Calculate the source coordinates from the original image
            const scaleX = img.width / imgDimensions.width;
            const scaleY = img.height / imgDimensions.height;
            
            ctx.drawImage(
                img,
                cropRect.x * scaleX,
                cropRect.y * scaleY,
                cropRect.width * scaleX,
                cropRect.height * scaleY,
                cropRect.x,
                cropRect.y,
                cropRect.width,
                cropRect.height
            );
            
            // Draw border
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.strokeRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
            
            // Draw corner handles
            const handleSize = 10;
            const corners = [
                {x: cropRect.x, y: cropRect.y, name: 'tl'},
                {x: cropRect.x + cropRect.width, y: cropRect.y, name: 'tr'},
                {x: cropRect.x + cropRect.width, y: cropRect.y + cropRect.height, name: 'br'},
                {x: cropRect.x, y: cropRect.y + cropRect.height, name: 'bl'}
            ];
            
            corners.forEach(corner => {
                ctx.fillStyle = '#3b82f6';
                ctx.fillRect(corner.x - handleSize/2, corner.y - handleSize/2, handleSize, handleSize);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.strokeRect(corner.x - handleSize/2, corner.y - handleSize/2, handleSize, handleSize);
            });
            
            // Draw edge handles
            const edgeHandles = [
                {x: cropRect.x + cropRect.width/2, y: cropRect.y, name: 't'},
                {x: cropRect.x + cropRect.width, y: cropRect.y + cropRect.height/2, name: 'r'},
                {x: cropRect.x + cropRect.width/2, y: cropRect.y + cropRect.height, name: 'b'},
                {x: cropRect.x, y: cropRect.y + cropRect.height/2, name: 'l'}
            ];
            
            edgeHandles.forEach(handle => {
                ctx.fillStyle = '#3b82f6';
                ctx.fillRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.strokeRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
            });
        };
        img.src = originalImage;
    };

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return {x: 0, y: 0};
        
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const pos = getMousePos(e);
        const handleSize = 10;
        
        // Check corners
        const corners = [
            {x: cropRect.x, y: cropRect.y, name: 'tl'},
            {x: cropRect.x + cropRect.width, y: cropRect.y, name: 'tr'},
            {x: cropRect.x + cropRect.width, y: cropRect.y + cropRect.height, name: 'br'},
            {x: cropRect.x, y: cropRect.y + cropRect.height, name: 'bl'}
        ];
        
        for (const corner of corners) {
            if (Math.abs(pos.x - corner.x) < handleSize && Math.abs(pos.y - corner.y) < handleSize) {
                setIsDragging(true);
                setDragType('corner');
                setDragCorner(corner.name);
                setDragOffset({x: pos.x - corner.x, y: pos.y - corner.y});
                return;
            }
        }
        
        // Check edges
        const edges = [
            {x: cropRect.x + cropRect.width/2, y: cropRect.y, name: 't'},
            {x: cropRect.x + cropRect.width, y: cropRect.y + cropRect.height/2, name: 'r'},
            {x: cropRect.x + cropRect.width/2, y: cropRect.y + cropRect.height, name: 'b'},
            {x: cropRect.x, y: cropRect.y + cropRect.height/2, name: 'l'}
        ];
        
        for (const edge of edges) {
            if (Math.abs(pos.x - edge.x) < handleSize && Math.abs(pos.y - edge.y) < handleSize) {
                setIsDragging(true);
                setDragType('edge');
                setDragCorner(edge.name);
                return;
            }
        }
        
        // Check if inside rectangle for moving
        if (pos.x >= cropRect.x && pos.x <= cropRect.x + cropRect.width &&
            pos.y >= cropRect.y && pos.y <= cropRect.y + cropRect.height) {
            setIsDragging(true);
            setDragType('move');
            setDragOffset({x: pos.x - cropRect.x, y: pos.y - cropRect.y});
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;
        
        const pos = getMousePos(e);
        const newRect = {...cropRect};
        
        if (dragType === 'move') {
            newRect.x = Math.max(0, Math.min(imgDimensions.width - cropRect.width, pos.x - dragOffset.x));
            newRect.y = Math.max(0, Math.min(imgDimensions.height - cropRect.height, pos.y - dragOffset.y));
        } else if (dragType === 'corner') {
            switch (dragCorner) {
                case 'tl':
                    const newWidth1 = cropRect.x + cropRect.width - pos.x;
                    const newHeight1 = cropRect.y + cropRect.height - pos.y;
                    if (newWidth1 > 20 && newHeight1 > 20) {
                        newRect.x = pos.x;
                        newRect.y = pos.y;
                        newRect.width = newWidth1;
                        newRect.height = newHeight1;
                    }
                    break;
                case 'tr':
                    const newWidth2 = pos.x - cropRect.x;
                    const newHeight2 = cropRect.y + cropRect.height - pos.y;
                    if (newWidth2 > 20 && newHeight2 > 20) {
                        newRect.y = pos.y;
                        newRect.width = newWidth2;
                        newRect.height = newHeight2;
                    }
                    break;
                case 'br':
                    const newWidth3 = pos.x - cropRect.x;
                    const newHeight3 = pos.y - cropRect.y;
                    if (newWidth3 > 20 && newHeight3 > 20) {
                        newRect.width = newWidth3;
                        newRect.height = newHeight3;
                    }
                    break;
                case 'bl':
                    const newWidth4 = cropRect.x + cropRect.width - pos.x;
                    const newHeight4 = pos.y - cropRect.y;
                    if (newWidth4 > 20 && newHeight4 > 20) {
                        newRect.x = pos.x;
                        newRect.width = newWidth4;
                        newRect.height = newHeight4;
                    }
                    break;
            }
        } else if (dragType === 'edge') {
            switch (dragCorner) {
                case 't':
                    const newHeight5 = cropRect.y + cropRect.height - pos.y;
                    if (newHeight5 > 20) {
                        newRect.y = pos.y;
                        newRect.height = newHeight5;
                    }
                    break;
                case 'r':
                    const newWidth6 = pos.x - cropRect.x;
                    if (newWidth6 > 20) {
                        newRect.width = newWidth6;
                    }
                    break;
                case 'b':
                    const newHeight7 = pos.y - cropRect.y;
                    if (newHeight7 > 20) {
                        newRect.height = newHeight7;
                    }
                    break;
                case 'l':
                    const newWidth8 = cropRect.x + cropRect.width - pos.x;
                    if (newWidth8 > 20) {
                        newRect.x = pos.x;
                        newRect.width = newWidth8;
                    }
                    break;
            }
        }
        
        // Constrain to canvas bounds
        newRect.x = Math.max(0, Math.min(imgDimensions.width - newRect.width, newRect.x));
        newRect.y = Math.max(0, Math.min(imgDimensions.height - newRect.height, newRect.y));
        newRect.width = Math.min(imgDimensions.width - newRect.x, newRect.width);
        newRect.height = Math.min(imgDimensions.height - newRect.y, newRect.height);
        
        setCropRect(newRect);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragType(null);
        setDragCorner(null);
    };

    const handleCropConfirm = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx || !originalImage) return;
        
        const img = document.createElement('img');
        img.onload = () => {
            const scaleX = img.width / imgDimensions.width;
            const scaleY = img.height / imgDimensions.height;
            
            const scaledRect = {
                x: cropRect.x * scaleX,
                y: cropRect.y * scaleY,
                width: cropRect.width * scaleX,
                height: cropRect.height * scaleY
            };
            
            canvas.width = scaledRect.width;
            canvas.height = scaledRect.height;
            
            ctx.drawImage(
                img,
                scaledRect.x,
                scaledRect.y,
                scaledRect.width,
                scaledRect.height,
                0,
                0,
                scaledRect.width,
                scaledRect.height
            );
            
            const croppedImage = canvas.toDataURL('image/png');
            setImagePreview(croppedImage);
            setNewStock({ ...newStock, image: croppedImage });
            setShowCropper(false);
        };
        img.src = originalImage;
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setOriginalImage('');
    };

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
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="cursor-crosshair"
                />
            </div>
            <div className="flex gap-2 mt-4">
                <button 
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    onClick={handleCropCancel}
                >
                    Cancel
                </button>
                <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={handleCropConfirm}
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
                                onChange={handleImageChange}
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