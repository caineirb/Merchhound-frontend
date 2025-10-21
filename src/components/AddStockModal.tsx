"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Product, Item, Bundle, ProductWithInfoSend, ITEM_TYPES } from "@/types";
import { createItemProduct, createBundleProduct, fetchProducts } from '@/helpers';

interface AddStockModalProps {
  onClose: () => void;
  onSave: () => void;
}

const AddStockModal = ({ onClose, onSave }: AddStockModalProps) => {
  const productTypes: string[] = ITEM_TYPES;
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [newProduct, setNewProduct] = useState<ProductWithInfoSend>({
    product: {
      name: "",
      type: productTypes[0],
      price: 0,
      product_image: null,
    },
    info: [],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // For individual item details
  const [itemDetails, setItemDetails] = useState<Omit<Item, 'item_id' | 'product_id'>[]>([
    {
      size: "",
      color: "",
      variant: "",
      quantity: 0,
    },
  ]);

  // For bundle-type products
  const [bundleItems, setBundleItems] = useState<[string, number][]>([["", 1]]);

  useEffect(() => {
    loadAvailableProducts();
  }, []);

  const loadAvailableProducts = async () => {
    try {
      const products = await fetchProducts();
      // Only show non-bundle products for bundle selection
      const itemProducts = products
        .map((p: any) => p.product)
        .filter((p: Product) => p.type.toLowerCase() !== 'bundle');
      setAvailableProducts(itemProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleItemDetailChange = (
    index: number,
    field: keyof Omit<Item, 'item_id' | 'product_id'>,
    value: string | number | null
  ) => {
    const updated = [...itemDetails];
    updated[index] = { ...updated[index], [field]: value };
    setItemDetails(updated);
  };

  const addItemDetail = () => {
    setItemDetails([
      ...itemDetails,
      { size: "", color: "", variant: "", quantity: 0 },
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
    if (field === 'product_id') {
      updated[index] = [value as string, updated[index][1]];
    } else {
      updated[index] = [updated[index][0], parseInt(value as string) || 1];
    }
    setBundleItems(updated);
  };

  const addBundleItem = () => {
    setBundleItems([...bundleItems, ["", 1]]);
  };

  const removeBundleItem = (index: number) => {
    if (bundleItems.length > 1) {
      setBundleItems(bundleItems.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    // Validation
    if (!newProduct.product.name?.trim()) {
      alert('Please enter a product name');
      return;
    }
    if (!newProduct.product.price || newProduct.product.price < 0) {
      alert('Please enter a valid price');
      return;
    }

    setLoading(true);

    try {
      if (newProduct.product.type.toLowerCase() === "bundle") {
        // Validate bundle items
        const validBundleItems = bundleItems.filter(
          ([productId, qty]) => productId && productId.trim() !== '' && qty > 0
        );
        
        if (validBundleItems.length === 0) {
          alert('Please add at least one valid bundle item');
          setLoading(false);
          return;
        }

        // Prepare productData - remove created_at as backend doesn't expect it
        const productData = {
          name: newProduct.product.name,
          type: newProduct.product.type,
          product_image: newProduct.product.product_image,
          price: newProduct.product.price,
        };

        const bundleData: Omit<Bundle, 'bundle_id' | 'product_id'> = {
          items: validBundleItems as [string, number][],
        };

        console.log('Sending to backend:', { productData, bundleData });
        
        await createBundleProduct(productData, bundleData);
        console.log("Bundle product created successfully");
        alert('Bundle product created successfully!');
        onSave();
      } else {
        // Validate items
        const validItems = itemDetails.filter(item => item.quantity > 0);
        
        if (validItems.length === 0) {
          alert('Please add at least one item with quantity > 0');
          setLoading(false);
          return;
        }

        // Prepare productData
        const productData = {
          name: newProduct.product.name,
          type: newProduct.product.type,
          product_image: newProduct.product.product_image,
          price: newProduct.product.price,
        };

        const items: Omit<Item, 'item_id' | 'product_id'>[] = validItems.map((detail) => ({
          size: detail.size || null,
          color: detail.color || null,
          variant: detail.variant || null,
          quantity: Number(detail.quantity) || 0,
        }));

        console.log('Sending to backend:', { productData, itemsData: items });

        await createItemProduct(productData, items);
        console.log("Item product created successfully");
        alert('Item product created successfully!');
        onSave();
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#00000070] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto w-full max-w-lg">
        <h2 className="text-lg font-bold">Add New Stock</h2>

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
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImagePreview(reader.result as string);
                  setNewProduct({
                    ...newProduct,
                    product: {
                      ...newProduct.product,
                      product_image: reader.result as string,
                    },
                  });
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
            value={newProduct.product.name}
            className="w-full border border-gray-300 rounded p-2 pt-6"
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                product: { ...newProduct.product, name: e.target.value },
              })
            }
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
            value={newProduct.product.price}
            className="w-full border border-gray-300 rounded p-2 pt-6"
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                product: {
                  ...newProduct.product,
                  price: Number(e.target.value),
                },
              })
            }
          />
          <label
            htmlFor="stock-price"
            className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1"
          >
            Price (₱)*
          </label>
        </div>

        <div className="relative mt-4">
          <select
            id="stock-type"
            value={newProduct.product.type}
            className="w-full border border-gray-300 rounded p-2 pt-6"
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                product: {
                  ...newProduct.product,
                  type: e.target.value as Product["type"],
                },
              })
            }
          >
            {productTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <label
            htmlFor="stock-type"
            className="absolute top-1 left-2 text-xs text-gray-600 bg-white px-1"
          >
            Type*
          </label>
        </div>

        {/* Conditional Sections */}
        {newProduct.product.type.toLowerCase() === "bundle" ? (
          <>
            <h3 className="text-sm font-medium mt-6 mb-2">Bundle Items</h3>
            <div className="max-h-64 overflow-y-auto border p-3 rounded">
              {bundleItems.map((item, i) => (
                <div key={i} className="flex space-x-2 mb-2 items-center">
                  <select
                    value={item[0]}
                    onChange={(e) => handleBundleItemChange(i, 'product_id', e.target.value)}
                    className="border border-gray-300 rounded p-2 flex-1"
                  >
                    <option value="">Select Product</option>
                    {availableProducts.map((prod) => (
                      <option key={prod.product_id} value={prod.product_id}>
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
              ))}
            </div>
            <button
              type="button"
              className="mt-2 text-blue-600 text-sm hover:underline"
              onClick={addBundleItem}
            >
              + Add Bundle Item
            </button>
          </>
        ) : (
          <>
            <h3 className="text-sm font-medium mt-6 mb-2">Item Details</h3>
            <div className="max-h-64 overflow-y-auto border p-3 rounded">
              {itemDetails.map((item, i) => (
                <div key={i} className="mb-4 pb-3 border-b last:border-0">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Quantity*"
                        min="0"
                        value={item.quantity || ""}
                        onChange={(e) =>
                          handleItemDetailChange(i, "quantity", Number.parseInt(e.target.value) || 0)
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
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStockModal;