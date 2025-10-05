import { CropCanvasProps, DragStateProps, Stock } from "@/types";

export function drawCanvas({ canvasRef, imgDimensions, originalImage, cropRect }: Pick<CropCanvasProps, 'canvasRef' | 'imgDimensions' | 'originalImage' | 'cropRect'>) {
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

export function getMousePos(canvasRef: CropCanvasProps["canvasRef"], e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return {x: 0, y: 0};
    
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
};

export function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>, 
    cropCanvas: Pick<CropCanvasProps, 'canvasRef' | 'imgDimensions' | 'originalImage' | 'cropRect' | 'newStock'>, 
    dragState: Pick<DragStateProps, 'setIsDragging' | 'setDragType' | 'setDragCorner' | 'setDragOffset'>) {
    const pos = getMousePos(cropCanvas.canvasRef, e);
    const handleSize = 10;
    
    // Check corners
    const corners = [
        {x: cropCanvas.cropRect.x, y: cropCanvas.cropRect.y, name: 'tl'},
        {x: cropCanvas.cropRect.x + cropCanvas.cropRect.width, y: cropCanvas.cropRect.y, name: 'tr'},
        {x: cropCanvas.cropRect.x + cropCanvas.cropRect.width, y: cropCanvas.cropRect.y + cropCanvas.cropRect.height, name: 'br'},
        {x: cropCanvas.cropRect.x, y: cropCanvas.cropRect.y + cropCanvas.cropRect.height, name: 'bl'}
    ];
    
    for (const corner of corners) {
        if (Math.abs(pos.x - corner.x) < handleSize && Math.abs(pos.y - corner.y) < handleSize) {
            dragState.setIsDragging(true);
            dragState.setDragType('corner');
            dragState.setDragCorner(corner.name);
            dragState.setDragOffset({x: pos.x - corner.x, y: pos.y - corner.y});
            return;
        }
    }
    
    // Check edges
    const edges = [
        {x: cropCanvas.cropRect.x + cropCanvas.cropRect.width/2, y: cropCanvas.cropRect.y, name: 't'},
        {x: cropCanvas.cropRect.x + cropCanvas.cropRect.width, y: cropCanvas.cropRect.y + cropCanvas.cropRect.height/2, name: 'r'},
        {x: cropCanvas.cropRect.x + cropCanvas.cropRect.width/2, y: cropCanvas.cropRect.y + cropCanvas.cropRect.height, name: 'b'},
        {x: cropCanvas.cropRect.x, y: cropCanvas.cropRect.y + cropCanvas.cropRect.height/2, name: 'l'}
    ];
    
    for (const edge of edges) {
        if (Math.abs(pos.x - edge.x) < handleSize && Math.abs(pos.y - edge.y) < handleSize) {
            dragState.setIsDragging(true);
            dragState.setDragType('edge');
            dragState.setDragCorner(edge.name);
            return;
        }
    }
    
    // Check if inside rectangle for moving
    if (pos.x >= cropCanvas.cropRect.x && pos.x <= cropCanvas.cropRect.x + cropCanvas.cropRect.width &&
        pos.y >= cropCanvas.cropRect.y && pos.y <= cropCanvas.cropRect.y + cropCanvas.cropRect.height) {
        dragState.setIsDragging(true);
        dragState.setDragType('move');
        dragState.setDragOffset({x: pos.x - cropCanvas.cropRect.x, y: pos.y - cropCanvas.cropRect.y});
    }
};

export function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>, 
    cropCanvas: Pick<CropCanvasProps, 'canvasRef' | 'imgDimensions' | 'originalImage' | 'cropRect' | 'newStock'>, 
    dragState: Pick<DragStateProps, 'isDragging' | 'dragType' | 'dragCorner' | 'dragOffset' | 'setCropRect'>){
    if (!dragState.isDragging) return;

    const pos = getMousePos(cropCanvas.canvasRef, e);
    const newRect = {...cropCanvas.cropRect};

    if (dragState.dragType === 'move') {
        newRect.x = Math.max(0, Math.min(cropCanvas.imgDimensions.width - newRect.width, pos.x - dragState.dragOffset.x));
        newRect.y = Math.max(0, Math.min(cropCanvas.imgDimensions.height - newRect.height, pos.y - dragState.dragOffset.y));
    } else if (dragState.dragType === 'corner') {
        switch (dragState.dragCorner) {
            case 'tl':
                const newWidth1 = cropCanvas.cropRect.x + cropCanvas.cropRect.width - pos.x;
                const newHeight1 = cropCanvas.cropRect.y + cropCanvas.cropRect.height - pos.y;
                if (newWidth1 > 20 && newHeight1 > 20) {
                    newRect.x = pos.x;
                    newRect.y = pos.y;
                    newRect.width = newWidth1;
                    newRect.height = newHeight1;
                }
                break;
            case 'tr':
                const newWidth2 = pos.x - cropCanvas.cropRect.x;
                const newHeight2 = cropCanvas.cropRect.y + cropCanvas.cropRect.height - pos.y;
                if (newWidth2 > 20 && newHeight2 > 20) {
                    newRect.y = pos.y;
                    newRect.width = newWidth2;
                    newRect.height = newHeight2;
                }
                break;
            case 'br':
                const newWidth3 = pos.x - cropCanvas.cropRect.x;
                const newHeight3 = pos.y - cropCanvas.cropRect.y;
                if (newWidth3 > 20 && newHeight3 > 20) {
                    newRect.width = newWidth3;
                    newRect.height = newHeight3;
                }
                break;
            case 'bl':
                const newWidth4 = cropCanvas.cropRect.x + cropCanvas.cropRect.width - pos.x;
                const newHeight4 = pos.y - cropCanvas.cropRect.y;
                if (newWidth4 > 20 && newHeight4 > 20) {
                    newRect.x = pos.x;
                    newRect.width = newWidth4;
                    newRect.height = newHeight4;
                }
                break;
        }
    } else if (dragState.dragType === 'edge') {
        switch (dragState.dragCorner) {
            case 't':
                const newHeight5 = cropCanvas.cropRect.y + cropCanvas.cropRect.height - pos.y;
                if (newHeight5 > 20) {
                    newRect.y = pos.y;
                    newRect.height = newHeight5;
                }
                break;
            case 'r':
                const newWidth6 = pos.x - cropCanvas.cropRect.x;
                if (newWidth6 > 20) {
                    newRect.width = newWidth6;
                }
                break;
            case 'b':
                const newHeight7 = pos.y - cropCanvas.cropRect.y;
                if (newHeight7 > 20) {
                    newRect.height = newHeight7;
                }
                break;
            case 'l':
                const newWidth8 = cropCanvas.cropRect.x + cropCanvas.cropRect.width - pos.x;
                if (newWidth8 > 20) {
                    newRect.x = pos.x;
                    newRect.width = newWidth8;
                }
                break;
        }
    }
    
    // Constrain to canvas bounds
    newRect.x = Math.max(0, Math.min(cropCanvas.imgDimensions.width - newRect.width, newRect.x));
    newRect.y = Math.max(0, Math.min(cropCanvas.imgDimensions.height - newRect.height, newRect.y));
    newRect.width = Math.min(cropCanvas.imgDimensions.width - newRect.x, newRect.width);
    newRect.height = Math.min(cropCanvas.imgDimensions.height - newRect.y, newRect.height);

    dragState.setCropRect(newRect);
};

export function handleMouseUp({setIsDragging, setDragType, setDragCorner}: Pick<DragStateProps, 'setIsDragging' | 'setDragType' | 'setDragCorner'>){
    setIsDragging(false);
    setDragType(null);
    setDragCorner(null);
};

export function handleCropConfirm(newStock: Stock, 
    {setImagePreview, setNewStock, setShowCropper, originalImage, imgDimensions, cropRect}: Pick<DragStateProps, 'setImagePreview' | 'setNewStock' | 'setShowCropper'> & {originalImage: string, imgDimensions: {width: number, height: number}, cropRect: {x: number, y: number, width: number, height: number}}) {
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

export function handleCropCancel(setShowCropper: DragStateProps['setShowCropper'], setOriginalImage: CropCanvasProps['setOriginalImage']) {
    setShowCropper(false);
    setOriginalImage('');
};

export function handleImageChange(e: React.ChangeEvent<HTMLInputElement>, 
    { setOriginalImage,  setImgDimensions }: Pick<CropCanvasProps, 'setOriginalImage' | 'setImgDimensions'>, 
    { setCropRect, setShowCropper }: Pick<DragStateProps, 'setCropRect' | 'setShowCropper'>) {
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