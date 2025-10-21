import { Bundle, Item, Product, ProductWithInfoSend } from "@/types";

export const fetchTypes = async () => {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/types`;

        const res = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            console.error('Fetch failed:', res.status, res.statusText);
            return [];
        }

        const data = await res.json();
        // If your backend wraps items in { success, data }, unwrap it:
        return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
        console.error('Error fetching product types:', error);
        return [];
    }
};

export const fetchProducts = async () => {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/all`;

        const res = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            console.error('Fetch failed:', res.status, res.statusText);
            return [];
        }

        const data = await res.json();
        // If your backend wraps items in { success, data }, unwrap it:
        console.log('Fetched products data:', data);
        return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

// helpers.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchProductById(productId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function createItemProduct(product: ProductWithInfoSend['product'], items: Omit<Item, 'item_id' | 'product_id'>[]) {
  try {
    console.log('Creating item product with data:', { product, items });
    const response = await fetch(`${API_BASE_URL}/products/create-item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, items })
    });
    if (!response.ok) throw new Error('Failed to create item product');
    return await response.json();
  } catch (error) {
    console.error('Error creating item product:', error);
    throw error;
  }
}

export async function createBundleProduct(product: ProductWithInfoSend['product'], bundle: Omit<Bundle, 'bundle_id' | 'product_id'>) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/create-bundle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, bundle })
    });
    if (!response.ok) throw new Error('Failed to create bundle product');
    return await response.json();
  } catch (error) {
    console.error('Error creating bundle product:', error);
    throw error;
  }
}

export async function updateItemProduct(productId: string, product: Partial<Omit<Product, 'product_id' | 'created_at'>>, items?: Omit<Item, 'item_id' | 'product_id'>[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/item/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, items })
    });
    if (!response.ok) throw new Error('Failed to update item product');
    return await response.json();
  } catch (error) {
    console.error('Error updating item product:', error);
    throw error;
  }
}

export async function updateBundleProduct(productId: string, product: Partial<Omit<Product, 'product_id' | 'created_at'>>, bundleItems?: [Product["product_id"], number][]) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/bundle/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, bundleItems })
    });
    if (!response.ok) throw new Error('Failed to update bundle product');
    return await response.json();
  } catch (error) {
    console.error('Error updating bundle product:', error);
    throw error;
  }
}

export async function deleteProduct(productId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete product');
    
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}