// interface CanvasProps {
//     canvasRef: React.RefObject<HTMLCanvasElement | null>;
//     imgDimensions: { width: number; height: number; };
//     originalImage: string | null;
//     cropRect: { x: number; y: number; width: number; height: number; };
// }

// export function getMousePos(canvasRef: React.RefObject<HTMLCanvasElement | null>, e: React.MouseEvent<HTMLCanvasElement>) {
//     const canvas = canvasRef.current;
//     if (!canvas) return {x: 0, y: 0};
    
//     const rect = canvas.getBoundingClientRect();
//     return {
//         x: e.clientX - rect.left,
//         y: e.clientY - rect.top
//     };
// };

// export function drawCanvas({ canvasRef, imgDimensions, originalImage, cropRect }: CanvasProps){
//     const canvas = canvasRef.current;
//     if (!canvas || !originalImage) return;
    
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;
    
//     const img = document.createElement('img');
//     img.onload = () => {
//         canvas.width = imgDimensions.width;
//         canvas.height = imgDimensions.height;
        
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(img, 0, 0, imgDimensions.width, imgDimensions.height);
        
//         // Darken everything
//         ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
        
//         // Clear the crop rectangle area and redraw the correct portion
//         ctx.clearRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
        
//         // Calculate the source coordinates from the original image
//         const scaleX = img.width / imgDimensions.width;
//         const scaleY = img.height / imgDimensions.height;
        
//         ctx.drawImage(
//             img,
//             cropRect.x * scaleX,
//             cropRect.y * scaleY,
//             cropRect.width * scaleX,
//             cropRect.height * scaleY,
//             cropRect.x,
//             cropRect.y,
//             cropRect.width,
//             cropRect.height
//         );
        
//         // Draw border
//         ctx.strokeStyle = '#3b82f6';
//         ctx.lineWidth = 2;
//         ctx.strokeRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
        
//         // Draw corner handles
//         const handleSize = 10;
//         const corners = [
//             {x: cropRect.x, y: cropRect.y, name: 'tl'},
//             {x: cropRect.x + cropRect.width, y: cropRect.y, name: 'tr'},
//             {x: cropRect.x + cropRect.width, y: cropRect.y + cropRect.height, name: 'br'},
//             {x: cropRect.x, y: cropRect.y + cropRect.height, name: 'bl'}
//         ];
        
//         corners.forEach(corner => {
//             ctx.fillStyle = '#3b82f6';
//             ctx.fillRect(corner.x - handleSize/2, corner.y - handleSize/2, handleSize, handleSize);
//             ctx.strokeStyle = '#ffffff';
//             ctx.lineWidth = 2;
//             ctx.strokeRect(corner.x - handleSize/2, corner.y - handleSize/2, handleSize, handleSize);
//         });
        
//         // Draw edge handles
//         const edgeHandles = [
//             {x: cropRect.x + cropRect.width/2, y: cropRect.y, name: 't'},
//             {x: cropRect.x + cropRect.width, y: cropRect.y + cropRect.height/2, name: 'r'},
//             {x: cropRect.x + cropRect.width/2, y: cropRect.y + cropRect.height, name: 'b'},
//             {x: cropRect.x, y: cropRect.y + cropRect.height/2, name: 'l'}
//         ];
        
//         edgeHandles.forEach(handle => {
//             ctx.fillStyle = '#3b82f6';
//             ctx.fillRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
//             ctx.strokeStyle = '#ffffff';
//             ctx.lineWidth = 2;
//             ctx.strokeRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
//         });
//     };
//     img.src = originalImage;
// };

// interface DragState {
//     isDragging: boolean;
//     dragType: 'move' | 'corner' | 'edge' | null;
//     dragCorner: string | null;
//     dragOffset: { x: number; y: number; };
//     setIsDragging: (dragging: boolean) => void;
//     setDragType: (type: 'move' | 'corner' | 'edge' | null) => void;
//     setDragCorner: (corner: string | null) => void;
//     setDragOffset: (offset: { x: number; y: number; }) => void;
//     setCropRect: (rect: { x: number; y: number; width: number; height: number; }) => void;
//     imgDimensions: { width: number; height: number; };
//     originalImage: string | null;
//     cropRect: { x: number; y: number; width: number; height: number; };
//     setImagePreview: (preview: string) => void;
//     setNewStock: (stock: { image: string }) => void;
//     newStock: { image: string };
//     setShowCropper: (show: boolean) => void;
// }

// export function handleMouseDown(canvasRef: React.RefObject<HTMLCanvasElement | null>, e: React.MouseEvent<HTMLCanvasElement>, dragState: DragState) {
//     const pos = getMousePos(canvasRef, e);
//     const handleSize = 10;
    
//     // Check corners
//     const corners = [
//         {x: dragState.cropRect.x, y: dragState.cropRect.y, name: 'tl'},
//         {x: dragState.cropRect.x + dragState.cropRect.width, y: dragState.cropRect.y, name: 'tr'},
//         {x: dragState.cropRect.x + dragState.cropRect.width, y: dragState.cropRect.y + dragState.cropRect.height, name: 'br'},
//         {x: dragState.cropRect.x, y: dragState.cropRect.y + dragState.cropRect.height, name: 'bl'}
//     ];
    
//     for (const corner of corners) {
//         if (Math.abs(pos.x - corner.x) < handleSize && Math.abs(pos.y - corner.y) < handleSize) {
//             dragState.setIsDragging(true);
//             dragState.setDragType('corner');
//             dragState.setDragCorner(corner.name);
//             dragState.setDragOffset({x: pos.x - corner.x, y: pos.y - corner.y});
//             return;
//         }
//     }
    
//     // Check edges
//     const edges = [
//         {x: dragState.cropRect.x + dragState.cropRect.width/2, y: dragState.cropRect.y, name: 't'},
//         {x: dragState.cropRect.x + dragState.cropRect.width, y: dragState.cropRect.y + dragState.cropRect.height/2, name: 'r'},
//         {x: dragState.cropRect.x + dragState.cropRect.width/2, y: dragState.cropRect.y + dragState.cropRect.height, name: 'b'},
//         {x: dragState.cropRect.x, y: dragState.cropRect.y + dragState.cropRect.height/2, name: 'l'}
//     ];
    
//     for (const edge of edges) {
//         if (Math.abs(pos.x - edge.x) < handleSize && Math.abs(pos.y - edge.y) < handleSize) {
//             dragState.setIsDragging(true);
//             dragState.setDragType('edge');
//             dragState.setDragCorner(edge.name);
//             return;
//         }
//     }
    
//     // Check if inside rectangle for moving
//     if (pos.x >= cropRect.x && pos.x <= cropRect.x + cropRect.width &&
//         pos.y >= cropRect.y && pos.y <= cropRect.y + cropRect.height) {
//         setIsDragging(true);
//         setDragType('move');
//         setDragOffset({x: pos.x - cropRect.x, y: pos.y - cropRect.y});
//     }
// };

// export function handleMouseMove(canvasRef: React.RefObject<HTMLCanvasElement | null>, e: React.MouseEvent<HTMLCanvasElement>, cropRect: { x: number; y: number; width: number; height: number; }){
//     if (!isDragging) return;
    
//     const pos = getMousePos(canvasRef, e);
//     const newRect = {...cropRect};
    
//     if (dragType === 'move') {
//         newRect.x = Math.max(0, Math.min(imgDimensions.width - cropRect.width, pos.x - dragOffset.x));
//         newRect.y = Math.max(0, Math.min(imgDimensions.height - cropRect.height, pos.y - dragOffset.y));
//     } else if (dragType === 'corner') {
//         switch (dragCorner) {
//             case 'tl':
//                 const newWidth1 = cropRect.x + cropRect.width - pos.x;
//                 const newHeight1 = cropRect.y + cropRect.height - pos.y;
//                 if (newWidth1 > 20 && newHeight1 > 20) {
//                     newRect.x = pos.x;
//                     newRect.y = pos.y;
//                     newRect.width = newWidth1;
//                     newRect.height = newHeight1;
//                 }
//                 break;
//             case 'tr':
//                 const newWidth2 = pos.x - cropRect.x;
//                 const newHeight2 = cropRect.y + cropRect.height - pos.y;
//                 if (newWidth2 > 20 && newHeight2 > 20) {
//                     newRect.y = pos.y;
//                     newRect.width = newWidth2;
//                     newRect.height = newHeight2;
//                 }
//                 break;
//             case 'br':
//                 const newWidth3 = pos.x - cropRect.x;
//                 const newHeight3 = pos.y - cropRect.y;
//                 if (newWidth3 > 20 && newHeight3 > 20) {
//                     newRect.width = newWidth3;
//                     newRect.height = newHeight3;
//                 }
//                 break;
//             case 'bl':
//                 const newWidth4 = cropRect.x + cropRect.width - pos.x;
//                 const newHeight4 = pos.y - cropRect.y;
//                 if (newWidth4 > 20 && newHeight4 > 20) {
//                     newRect.x = pos.x;
//                     newRect.width = newWidth4;
//                     newRect.height = newHeight4;
//                 }
//                 break;
//         }
//     } else if (dragType === 'edge') {
//         switch (dragCorner) {
//             case 't':
//                 const newHeight5 = cropRect.y + cropRect.height - pos.y;
//                 if (newHeight5 > 20) {
//                     newRect.y = pos.y;
//                     newRect.height = newHeight5;
//                 }
//                 break;
//             case 'r':
//                 const newWidth6 = pos.x - cropRect.x;
//                 if (newWidth6 > 20) {
//                     newRect.width = newWidth6;
//                 }
//                 break;
//             case 'b':
//                 const newHeight7 = pos.y - cropRect.y;
//                 if (newHeight7 > 20) {
//                     newRect.height = newHeight7;
//                 }
//                 break;
//             case 'l':
//                 const newWidth8 = cropRect.x + cropRect.width - pos.x;
//                 if (newWidth8 > 20) {
//                     newRect.x = pos.x;
//                     newRect.width = newWidth8;
//                 }
//                 break;
//         }
//     }
    
//     // Constrain to canvas bounds
//     newRect.x = Math.max(0, Math.min(imgDimensions.width - newRect.width, newRect.x));
//     newRect.y = Math.max(0, Math.min(imgDimensions.height - newRect.height, newRect.y));
//     newRect.width = Math.min(imgDimensions.width - newRect.x, newRect.width);
//     newRect.height = Math.min(imgDimensions.height - newRect.y, newRect.height);
    
//     setCropRect(newRect);
// };

// const handleMouseUp = () => {
//     setIsDragging(false);
//     setDragType(null);
//     setDragCorner(null);
// };

// const handleCropConfirm = () => {
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     if (!ctx || !originalImage) return;
    
//     const img = document.createElement('img');
//     img.onload = () => {
//         const scaleX = img.width / imgDimensions.width;
//         const scaleY = img.height / imgDimensions.height;
        
//         const scaledRect = {
//             x: cropRect.x * scaleX,
//             y: cropRect.y * scaleY,
//             width: cropRect.width * scaleX,
//             height: cropRect.height * scaleY
//         };
        
//         canvas.width = scaledRect.width;
//         canvas.height = scaledRect.height;
        
//         ctx.drawImage(
//             img,
//             scaledRect.x,
//             scaledRect.y,
//             scaledRect.width,
//             scaledRect.height,
//             0,
//             0,
//             scaledRect.width,
//             scaledRect.height
//         );
        
//         const croppedImage = canvas.toDataURL('image/png');
//         setImagePreview(croppedImage);
//         setNewStock({ ...newStock, image: croppedImage });
//         setShowCropper(false);
//     };
//     img.src = originalImage;
// };

// const handleCropCancel = () => {
//     setShowCropper(false);
//     setOriginalImage('');
// };