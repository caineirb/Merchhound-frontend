import { fetchTypes } from "@/helpers";

export interface Product {
    product_id: string;
    name: string;
    type: ItemType
    product_image: string | null;
    price: number;
    created_at: Date;
}

export const ITEM_TYPES = await fetchTypes();
export type ItemType = typeof ITEM_TYPES[number];

export interface Item {
    item_id: string;
    product_id: string;
    size: string | null;
    color: string | null;
    variant: string | null;
    quantity: number;
}

export interface Bundle {
    bundle_id: string;
    product_id: string;
    items: [Product['product_id'], number][];
}

export interface BundleWithItems extends Omit<Bundle, 'items'> {
    items: [Product, number][];
}

export interface ProductWithInfoSend { 
    product: Omit<Product, 'product_id' | 'created_at'>; 
    info: Omit<Item, 'item_id' | 'product_id'>[] | Omit<Bundle, 'bundle_id' | 'product_id'> 
};

export interface ProductWithInfo { 
    product: Product; 
    info: Item[] | Bundle; 
}