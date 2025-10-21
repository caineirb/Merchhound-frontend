import { Product, Item, Bundle } from '@/types';
import { updateItemProduct, updateBundleProduct, deleteProduct, fetchProducts } from '@/helpers';
import Image from "next/image";
import { useState, useEffect } from 'react';

interface ProductWithInfo {
  product: Product;
  info: Item[] | Bundle;
}

interface StocksInfoModalProps {
  productWithInfo: ProductWithInfo;
  onDelete: (productId: string) => void;
  onClose: () => void;
  onSave: (updated: ProductWithInfo) => void;
}

const StocksInfoModal = ({ productWithInfo, onClose, onSave, onDelete }: StocksInfoModalProps) => {
  // Helper function to normalize bundle items on initialization
  const getInitialBundleItems = (): [string, number][] => {
    if (productWithInfo.product.type.toLowerCase() !== 'bundle') {
      return [['', 1]];
    }

    const bundleInfo = productWithInfo.info as Bundle;
    
    // Handle case where bundleInfo might not have items property
    if (!bundleInfo || !bundleInfo.items) {
      return [['', 1]];
    }

    const items = Array.isArray(bundleInfo.items) ? bundleInfo.items : [];
    
    const normalized: [string, number][] = items.map(item => {
      let productId = '';
      let quantity = 1;

      if (Array.isArray(item) && item.length >= 2) {
        // Handle both string product_id and Product object
        if (typeof item[0] === 'string') {
          productId = item[0];
        } else if (typeof item[0] === 'object' && item[0] !== null && 'product_id' in item[0]) {
          productId = (item[0] as any).product_id;
        }
        quantity = Number(item[1]) || 1;
      } else if (typeof item === 'object' && item !== null) {
        // Handle case where item might be a full object with product_id and quantity properties
        if ('product_id' in item) {
          productId = String((item as any).product_id || '');
        }
        if ('quantity' in item) {
          quantity = Number((item as any).quantity) || 1;
        }
      }

      return [productId, quantity];
    });

    return normalized.length > 0 ? normalized : [['', 1]];
  };

  // Helper function to get initial item details
  const getInitialItemDetails = (): Item[] => {
    if (productWithInfo.product.type.toLowerCase() === 'bundle') {
      return [];
    }

    const items = Array.isArray(productWithInfo.info) ? productWithInfo.info : [];
    return items.length > 0 ? items : [{
      item_id: crypto.randomUUID(),
      product_id: productWithInfo.product.product_id,
      size: null,
      color: null,
      variant: null,
      quantity: 0,
    }];
  };

  const [product, setProduct] = useState<Product>(productWithInfo.product);
  const [imagePreview, setImagePreview] = useState<string | null>(productWithInfo.product.product_image ?? null);
  const [loading, setLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  // Initialize with proper data from the start
  const [itemDetails, setItemDetails] = useState<Item[]>(getInitialItemDetails());
  const [bundleItems, setBundleItems] = useState<[string, number][]>(getInitialBundleItems());

  const isBundle = product.type.toLowerCase() === 'bundle';

  // Load available products when component mounts if it's a bundle
  useEffect(() => {
    if (productWithInfo.product.type.toLowerCase() === 'bundle') {
      loadAvailableProducts();
    }
  }, []);

  // Update state when productWithInfo prop changes
  useEffect(() => {
    setProduct(productWithInfo.product);
    setImagePreview(productWithInfo.product.product_image ?? null);

    if (productWithInfo.product.type.toLowerCase() === 'bundle') {
      const bundleInfo = productWithInfo.info as Bundle;
      
      // Handle case where bundleInfo might not have items property
      if (!bundleInfo || !bundleInfo.items) {
        setBundleItems([['', 1]]);
        return;
      }

      const items = Array.isArray(bundleInfo.items) ? bundleInfo.items : [];
      
      const normalized: [string, number][] = items.map(item => {
        let productId = '';
        let quantity = 1;

        if (Array.isArray(item) && item.length >= 2) {
          if (typeof item[0] === 'string') {
            productId = item[0];
          } else if (typeof item[0] === 'object' && item[0] !== null && 'product_id' in item[0]) {
            productId = (item[0] as any).product_id;
          }
          quantity = Number(item[1]) || 1;
        } else if (typeof item === 'object' && item !== null) {
          // Handle case where item might be a full object with product_id and quantity properties
          if ('product_id' in item) {
            productId = String((item as any).product_id || '');
          }
          if ('quantity' in item) {
            quantity = Number((item as any).quantity) || 1;
          }
        }

        return [productId, quantity];
      });

      setBundleItems(normalized.length > 0 ? normalized : [['', 1]]);
    } else {
      const items = Array.isArray(productWithInfo.info) ? productWithInfo.info : [];
      setItemDetails(items.length > 0 ? items : [{
        item_id: crypto.randomUUID(),
        product_id: productWithInfo.product.product_id,
        size: null,
        color: null,
        variant: null,
        quantity: 0,
      }]);
    }
  }, [productWithInfo]);

  const loadAvailableProducts = async () => {
    try {
      const products = await fetchProducts();
      const normalized: Product[] = Array.isArray(products)
        ? (products as any[]).map(p => (p && (p.product || p)) as Product)
        : [];
      const itemProducts = normalized.filter((p: Product) => 
        p && typeof p.type === 'string' && p.type.toLowerCase() !== 'bundle'
      );
      setAvailableProducts(itemProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setAvailableProducts([]);
    }
  };

  const handleItemDetailChange = (
    index: number,
    field: keyof Item,
    value: string | number | null
  ) => {
    const updated = [...itemDetails];
    const current = updated[index];
    if (!current) return;

    let newVal = value;
    if (field === 'quantity') {
      newVal = parseInt(value as string) || 0;
    } else if (field === 'size' || field === 'color' || field === 'variant') {
      newVal = value === '' ? null : value;
    }

    updated[index] = { ...current, [field]: newVal };
    setItemDetails(updated);
  };

  const addItemDetail = () => {
    setItemDetails([
      ...itemDetails,
      {
        item_id: crypto.randomUUID(),
        product_id: product.product_id,
        size: null,
        color: null,
        variant: null,
        quantity: 0,
      },
    ]);
  };

  const removeItemDetail = (index: number) => {
    if (itemDetails.length > 1) {
      setItemDetails(itemDetails.filter((_, i) => i !== index));
    }
  };

  const handleBundleItemChange = (
    index: number,
    field: 'product_id' | 'quantity',
    value: string | number
  ) => {
    const updated = [...bundleItems];
    
    if (!updated[index]) {
      updated[index] = ['', 1];
    }

    if (field === 'product_id') {
      // Always store as string for consistency
      updated[index] = [String(value), updated[index][1]];
    } else {
      updated[index] = [updated[index][0], parseInt(value as string) || 1];
    }
    
    setBundleItems(updated);
  };

  const addBundleItem = () => {
    setBundleItems([...bundleItems, ['', 1]]);
  };

  const removeBundleItem = (index: number) => {
    if (bundleItems.length > 1) {
      setBundleItems(bundleItems.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    // Validation
    if (!product.name?.trim()) {
      alert('Please enter a product name');
      return;
    }
    if (!product.price || product.price <= 0) {
      alert('Please enter a valid price greater than 0');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: product.name.trim(),
        type: product.type,
        product_image: product.product_image,
        price: product.price,
      };

      let result: any;

      if (isBundle) {
        // Validate bundle items
        const validBundleItems = bundleItems.filter(
          ([productId, qty]) => productId && productId.trim() !== '' && qty > 0
        );
        
        if (validBundleItems.length === 0) {
          alert('Please add at least one valid bundle item');
          setLoading(false);
          return;
        }

        result = await updateBundleProduct(product.product_id, productData, validBundleItems);
        console.log("Bundle product updated successfully");
        alert('Bundle product updated successfully!');
      } else {
        // Validate items
        const validItems = itemDetails.filter(item => item.quantity > 0);
        
        if (validItems.length === 0) {
          alert('Please add at least one item with quantity > 0');
          setLoading(false);
          return;
        }

        const itemsData = validItems.map((item) => ({
          item_id: item.item_id,
          size: item.size ?? null,
          color: item.color ?? null,
          variant: item.variant ?? null,
          quantity: Number(item.quantity) || 0,
        }));

        result = await updateItemProduct(product.product_id, productData, itemsData);
        console.log("Item product updated successfully");
        alert('Item product updated successfully!');
      }

      const updatedPW: ProductWithInfo = result ?? { 
        product: { ...product, ...productData }, 
        info: isBundle ? { bundle_id: '', product_id: product.product_id, items: bundleItems } : itemDetails
      };
      
      onSave(updatedPW);
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      alert('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      await deleteProduct(product.product_id);
      onDelete(product.product_id);
      alert('Product deleted successfully!');
      onClose();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#00000070] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Update Stock</h2>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm disabled:bg-gray-400"
            onClick={handleDelete}
            disabled={loading}
            title="Delete Stock"
          >
            Delete
          </button>
        </div>

        <div className="mb-4 p-2 bg-gray-100 rounded">
          <p className="text-xs text-gray-600">Product ID</p>
          <p className="text-sm font-mono break-all">{product.product_id}</p>
        </div>

        {/* Image Upload */}
        <div className="mt-4">
          <label
            htmlFor="image-upload"
            className="block text-sm text-gray-600 mb-2"
          >
            Product Image
          </label>

          <label
            htmlFor="image-upload"
            className="w-full border border-gray-300 rounded p-2 mb-2 bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center text-gray-600"
          >
            <span>Choose Image File</span>
          </label>

          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 5 * 1024 * 1024) {
                  alert('Image size must be less than 5MB');
                  e.target.value = '';
                  return;
                }

                const reader = new FileReader();
                reader.onloadend = () => {
                  const result = reader.result as string;
                  setImagePreview(result);
                  setProduct(prev => ({ ...prev, product_image: result }));
                };
                reader.onerror = () => {
                  alert('Error reading file. Please try again.');
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />

          {imagePreview && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Preview:</p>
              <div className="w-[300px] h-[300px] border border-black rounded flex items-center justify-center bg-gray-50">
                <Image
                  width={300}
                  height={300}
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="relative mt-4">
          <input
            type="text"
            id="stock-name"
            value={product.name}
            className="w-full border border-gray-300 rounded p-2 pt-6"
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            maxLength={200}
          />
          <label
            htmlFor="stock-name"
            className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1"
          >
            Name*
          </label>
        </div>

        <div className="relative mt-4">
          <input
            type="number"
            id="stock-price"
            step="0.01"
            min="0"
            value={product.price}
            className="w-full border border-gray-300 rounded p-2 pt-6"
            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
          />
          <label
            htmlFor="stock-price"
            className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1"
          >
            Price (₱)*
          </label>
        </div>

        <div className="relative mt-4">
          <input
            type="text"
            value={product.type}
            className="w-full border border-gray-300 rounded p-2 pt-6 bg-gray-100"
            disabled
          />
          <label
            htmlFor="stock-type"
            className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1"
          >
            Type (Cannot be changed)
          </label>
        </div>

        {/* Conditional Sections */}
        {isBundle ? (
          <>
            <h3 className="text-sm font-medium mt-6 mb-2">Bundle Items</h3>
            {availableProducts.length === 0 ? (
              <p className="text-sm text-gray-500 mb-2">Loading available products...</p>
            ) : (
              <>
                <div className="max-h-64 overflow-y-auto border p-3 rounded">
                  {bundleItems.map((item, i) => {
                    // Normalize the product_id to string for comparison
                    const selectedProductId = String(item[0] || '');
                    
                    return (
                      <div key={i} className="flex space-x-2 mb-2 items-center">
                        <select
                          value={selectedProductId}
                          onChange={(e) => handleBundleItemChange(i, 'product_id', e.target.value)}
                          className="border border-gray-300 rounded p-2 flex-1"
                        >
                          <option value="">Select Product</option>
                          {availableProducts.map((prod) => (
                            <option key={prod.product_id} value={String(prod.product_id)}>
                              {prod.name} (₱{prod.price})
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={item[1]}
                          onChange={(e) => handleBundleItemChange(i, 'quantity', e.target.value)}
                          className="border border-gray-300 rounded p-2 w-20"
                        />
                        {bundleItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBundleItem(i)}
                            className="px-2 text-red-600 hover:text-red-800"
                            title="Remove item"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className="mt-2 text-blue-600 text-sm hover:underline"
                  onClick={addBundleItem}
                >
                  + Add Bundle Item
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <h3 className="text-sm font-medium mt-6 mb-2">Item Details</h3>
            <div className="max-h-64 overflow-y-auto border p-3 rounded">
              {itemDetails.map((item, i) => (
                <div key={item.item_id ?? i} className="mb-4 pb-3 border-b last:border-0">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Quantity*"
                        min="0"
                        value={item.quantity || ""}
                        onChange={(e) =>
                          handleItemDetailChange(i, "quantity", parseInt(e.target.value) || 0)
                        }
                        className="w-full border border-gray-300 rounded p-2 pt-6"
                      />
                      <label className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">
                        Quantity*
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Size"
                        value={item.size || ""}
                        onChange={(e) =>
                          handleItemDetailChange(i, "size", e.target.value || null)
                        }
                        className="w-full border border-gray-300 rounded p-2 pt-6"
                      />
                      <label className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">
                        Size
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Color"
                        value={item.color || ""}
                        onChange={(e) =>
                          handleItemDetailChange(i, "color", e.target.value || null)
                        }
                        className="w-full border border-gray-300 rounded p-2 pt-6"
                      />
                      <label className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">
                        Color
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Variant"
                        value={item.variant || ""}
                        onChange={(e) =>
                          handleItemDetailChange(i, "variant", e.target.value || null)
                        }
                        className="w-full border border-gray-300 rounded p-2 pt-6"
                      />
                      <label className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1">
                        Variant
                      </label>
                    </div>
                  </div>
                  {itemDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItemDetail(i)}
                      className="mt-2 text-red-600 text-sm hover:text-red-800"
                    >
                      Remove Item
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-2 text-blue-600 text-sm hover:underline"
              onClick={addItemDetail}
            >
              + Add Item Detail
            </button>
          </>
        )}

        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:bg-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StocksInfoModal;