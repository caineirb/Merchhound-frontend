import { Stock } from "@/types/stock";

export interface CropCanvasProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    imgDimensions: { width: number; height: number; };
    originalImage: string;
    cropRect: { x: number; y: number; width: number; height: number; };
    newStock: Stock;
    setOriginalImage: (image: string) => void;
    setImgDimensions: (dimensions: { width: number; height: number; }) => void;
}

export interface DragStateProps {
    isDragging: boolean;
    setIsDragging: (dragging: boolean) => void;
    dragType: 'move' | 'corner' | 'edge' | null;
    setDragType: (type: DragStateProps["dragType"]) => void;
    dragCorner: string | null;
    setDragCorner: (corner: string | null) => void;
    dragOffset: { x: number; y: number; };
    setDragOffset: (offset: { x: number; y: number; }) => void;
    setCropRect: (rect: { x: number; y: number; width: number; height: number; }) => void;
    setShowCropper: (show: boolean) => void;
    setImagePreview: (preview: string) => void;
    setNewStock: (stock: Stock) => void;   
}