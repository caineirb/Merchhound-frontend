'use client';

import React, { useState, useEffect } from 'react'
import { fetchProducts } from '@/helpers';
import { ProductWithInfo } from '@/types';

interface OrderItem {
  product: string;
  product_id?: string;
  color?: string;
  size?: string;
  quantity: number;
  variant?: string;
}

interface Order {
  orderId: string;
  timestamp: string;
  email: string;
  name: string;
  contactNumber: string;
  items: OrderItem[];
  paymentSchedule: string;
  proofOfPayment?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [products, setProducts] = useState<ProductWithInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadProductsAndSetOrders();
  }, []);

  const loadProductsAndSetOrders = async () => {
    try {
      setLoading(true);
      // Only fetch products from backend, use mock orders
      const productsData = await fetchProducts();
      setProducts(productsData);
      console.log('Fetched products:', productsData);
      
      // Set mock orders
      const mockOrders: Order[] = [
        {
          orderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        timestamp: '11/2/2023 22:31:14',
        email: 'geraldkarl.avila@g.msuiit.edu.ph',
        name: 'Gerald Karl Avila',
        contactNumber: '09165521966',
        items: [
          {
            product: 'CCS T-Shirt',
            color: 'Black',
            size: 'Medium',
            quantity: 2
          }
        ],
        paymentSchedule: 'Friday 10-12 PM',
        status: 'pending',
        totalAmount: 400
      },
      {
        orderId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        timestamp: '11/2/2023 22:33:12',
        email: 'geraldkarl.avila@g.msuiit.edu.ph',
        name: 'Gerald Karl Avila',
        contactNumber: '09165521966',
        items: [
          {
            product: 'CCS Lanyard',
            quantity: 3
          }
        ],
        paymentSchedule: 'Friday 10-12 PM',
        status: 'pending',
        totalAmount: 150
      },
      {
        orderId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        timestamp: '11/2/2023 22:34:02',
        email: 'geraldkarl.avila@g.msuiit.edu.ph',
        name: 'Gerald Karl Avila',
        contactNumber: '09165521966',
        items: [
          {
            product: 'Bundle A',
            quantity: 1,
            variant: 'CCS T-Shirt (1x) + CCS Lanyard (2x)'
          }
        ],
        paymentSchedule: 'Friday 10-12 PM',
        status: 'pending',
        totalAmount: 200
      },
      {
        orderId: 'd4e5f6a7-b8c9-0123-def1-234567890123',
        timestamp: '11/5/2023 19:07:10',
        email: 'benkennethii.tabora@g.msuiit.edu.ph',
        name: 'Ben Kenneth',
        contactNumber: '09518349649',
        items: [
          {
            product: 'CCS Lanyard',
            quantity: 5
          }
        ],
        paymentSchedule: 'Friday 10-12 PM',
        status: 'pending',
        totalAmount: 250
      },
      {
        orderId: 'e5f6a7b8-c9d0-1234-ef12-345678901234',
        timestamp: '11/11/2023 19:27:14',
        email: 'princessapril.castillo@g.msuiit.edu.ph',
        name: 'Princess April Castillo',
        contactNumber: '09664565251',
        items: [
          {
            product: 'CCS T-Shirt',
            color: 'Black',
            size: 'Medium',
            quantity: 1
          }
        ],
        paymentSchedule: 'Friday 10-12 PM',
        proofOfPayment: 'https://drive.google.com/open?id=1fon12mp9j5mfeFLU0mRqznbPthd0hzBY',
        status: 'pending',
        totalAmount: 200
      },
      {
        orderId: 'f6a7b8c9-d0e1-2345-f123-456789012345',
        timestamp: '11/5/2023 19:10:14',
        email: 'yasmen.gumama@g.msuiit.edu.ph',
        name: 'Yasmen Gumama',
        contactNumber: '09856110847',
        items: [
          {
            product: 'Bundle A',
            quantity: 2,
            variant: 'CCS T-Shirt (1x) + CCS Lanyard (2x)'
          }
        ],
        paymentSchedule: 'Friday 10-12 PM',
        status: 'pending',
        totalAmount: 400
      },
      {
        orderId: 'a7b8c9d0-e1f2-3456-1234-567890123456',
        timestamp: '11/5/2023 19:12:23',
        email: 'aaronandrew.cid@g.msuiit.edu.ph',
        name: 'Andrew Cid',
        contactNumber: '09667322656',
        items: [
          {
            product: 'CCS Lanyard',
            quantity: 2
          }
        ],
        paymentSchedule: 'Friday 10-12 PM',
        status: 'pending',
        totalAmount: 100
      },
      {
        orderId: 'b8c9d0e1-f2a3-4567-2345-678901234567',
        timestamp: '11/5/2023 19:13:20',
        email: 'mariavianell.tadoy@g.msuiit.edu.ph',
        name: 'MARIA VIANELL TADOY',
        contactNumber: '09534180368',
        items: [
          {
            product: 'CCS T-Shirt',
            color: 'Black',
            size: 'Medium',
            quantity: 3
          }
        ],
        paymentSchedule: 'Monday 11-12:30 PM',
        status: 'pending',
        totalAmount: 600
      },
      // Additional pseudo orders for variety
      {
        orderId: 'c9d0e1f2-a3b4-5678-3456-789012345678',
        timestamp: '11/12/2023 14:22:35',
        email: 'john.doe@g.msuiit.edu.ph',
        name: 'John Doe',
        contactNumber: '09123456789',
        items: [
          {
            product: 'CCS T-Shirt',
            color: 'Black',
            size: 'Medium',
            quantity: 1
          },
          {
            product: 'CCS Lanyard',
            quantity: 4
          }
        ],
        paymentSchedule: 'Tuesday 2-4 PM',
        status: 'pending',
        totalAmount: 400
      },
      {
        orderId: 'd0e1f2a3-b4c5-6789-4567-890123456789',
        timestamp: '11/13/2023 09:15:42',
        email: 'jane.smith@g.msuiit.edu.ph',
        name: 'Jane Smith',
        contactNumber: '09987654321',
        items: [
          {
            product: 'Bundle A',
            quantity: 1,
            variant: 'CCS T-Shirt (1x) + CCS Lanyard (2x)'
          },
          {
            product: 'CCS Lanyard',
            quantity: 1
          }
        ],
        paymentSchedule: 'Wednesday 10-12 PM',
        proofOfPayment: 'https://drive.google.com/proof123',
        status: 'pending',
        totalAmount: 250
      }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to load products:', error);
      alert('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-secondary mt-2">Loading products...</p>
        </div>
      </section>
    );
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    // Update local state only since orders are mock data
    setOrders(orders.map(order => 
      order.orderId === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Calculate total quantities needed per product with variants
  const calculateInventoryNeeds = () => {
    interface VariantDetails {
      size?: string;
      color?: string;
      variant?: string;
    }
    
    interface ProductCount {
      needed: number;
      available: number;
      productId?: string;
      variants: {
        [key: string]: {
          needed: number;
          available: number;
          details: VariantDetails;
        }
      };
    }
    
    const productCounts: { [key: string]: ProductCount } = {};
    
    // Helper to create variant key
    const getVariantKey = (details: VariantDetails) => {
      const parts = [
        details.size || '',
        details.color || '',
        details.variant || ''
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(' - ') : 'default';
    };
    
    // Count all items from all orders, including bundle components
    orders.forEach(order => {
      order.items.forEach(item => {
        // Find if this is a bundle product
        const productData = products.find(p => p.product.name === item.product);
        
        if (productData && !Array.isArray(productData.info)) {
          // This is a bundle - break it down into component products
          const bundle = productData.info;
          bundle.items.forEach((bundleItem: any) => {
            let componentName: string | undefined;
            let componentId: string | undefined;
            let componentProductData: ProductWithInfo | undefined;
            let quantity: number;
            
            if (typeof bundleItem[0] === 'string') {
              const componentProduct = products.find(p => p.product.product_id === bundleItem[0]);
              if (componentProduct) {
                componentName = componentProduct.product.name;
                componentId = componentProduct.product.product_id;
                componentProductData = componentProduct;
                quantity = bundleItem[1];
              } else {
                return;
              }
            } else {
              componentName = bundleItem[0].name;
              componentId = bundleItem[0].product_id;
              componentProductData = products.find(p => p.product.product_id === bundleItem[0].product_id);
              quantity = bundleItem[1];
            }
            
            if (componentName && componentId) {
              if (!productCounts[componentName]) {
                productCounts[componentName] = { 
                  needed: 0, 
                  available: 0, 
                  productId: componentId,
                  variants: {}
                };
              }
              productCounts[componentName].needed += quantity * item.quantity;
              
              // For bundle components, check if the component product has specific variants
              if (componentProductData && Array.isArray(componentProductData.info)) {
                // Component is an item-type product with variants
                // We need to track the demand but can't specify which variant from the bundle alone
                // So we'll distribute the need across available variants proportionally
                const componentItems = componentProductData.info;
                
                if (componentItems.length > 0) {
                  // For each available variant of the component, track the needed quantity
                  componentItems.forEach(componentItem => {
                    const variantKey = getVariantKey({
                      size: componentItem.size || undefined,
                      color: componentItem.color || undefined,
                      variant: componentItem.variant || undefined
                    });
                    
                    if (!productCounts[componentName!].variants[variantKey]) {
                      productCounts[componentName!].variants[variantKey] = {
                        needed: 0,
                        available: 0,
                        details: {
                          size: componentItem.size || undefined,
                          color: componentItem.color || undefined,
                          variant: componentItem.variant || undefined
                        }
                      };
                    }
                    // Note: We can't know which specific variant is needed for the bundle
                    // So we mark it generically - you'll need to manually choose variants
                  });
                }
              }
              
              // Always track the total needed for this component (regardless of variant)
              const totalKey = 'Bundle Component (variant not specified)';
              if (!productCounts[componentName].variants[totalKey]) {
                productCounts[componentName].variants[totalKey] = {
                  needed: 0,
                  available: 0,
                  details: { variant: 'From bundle - select variant manually' }
                };
              }
              productCounts[componentName].variants[totalKey].needed += quantity * item.quantity;
            }
          });
        } else {
          // Regular item
          if (!productCounts[item.product]) {
            productCounts[item.product] = { 
              needed: 0, 
              available: 0, 
              productId: item.product_id,
              variants: {}
            };
          }
          productCounts[item.product].needed += item.quantity;
          
          // Track by variant
          const variantKey = getVariantKey({
            size: item.size,
            color: item.color,
            variant: item.variant
          });
          
          if (!productCounts[item.product].variants[variantKey]) {
            productCounts[item.product].variants[variantKey] = {
              needed: 0,
              available: 0,
              details: {
                size: item.size,
                color: item.color,
                variant: item.variant
              }
            };
          }
          productCounts[item.product].variants[variantKey].needed += item.quantity;
        }
      });
    });

    // Set available inventory from actual product data
    products.forEach(productWithInfo => {
      const productName = productWithInfo.product.name;
      
      if (productCounts[productName]) {
        if (Array.isArray(productWithInfo.info)) {
          // For items, sum up all quantities and track by variant
          const totalQuantity = productWithInfo.info.reduce((sum, item) => sum + item.quantity, 0);
          productCounts[productName].available = totalQuantity;
          
          // Track availability by variant
          productWithInfo.info.forEach(item => {
            const variantKey = getVariantKey({
              size: item.size || undefined,
              color: item.color || undefined,
              variant: item.variant || undefined
            });
            
            if (!productCounts[productName].variants[variantKey]) {
              productCounts[productName].variants[variantKey] = {
                needed: 0,
                available: 0,
                details: {
                  size: item.size || undefined,
                  color: item.color || undefined,
                  variant: item.variant || undefined
                }
              };
            }
            productCounts[productName].variants[variantKey].available += item.quantity;
          });
        }
        productCounts[productName].productId = productWithInfo.product.product_id;
      }
    });

    return productCounts;
  };

  const inventoryNeeds = calculateInventoryNeeds();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-secondary mt-2">
          {orders.length} total order{orders.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="w-full mx-auto flex gap-6">
        {/* Main Orders Section */}
        <div className="flex-1">
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search by name, email, or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.name}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                        <div className="text-sm text-gray-500">{order.contactNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.items[0]?.product}
                          {order.items.length > 1 && ` +${order.items.length - 1} more`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₱{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      {searchQuery || filterStatus !== 'all'
                        ? 'No orders found matching your criteria'
                        : 'No orders yet'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>

        {/* Inventory Needs Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4">Inventory Status</h2>
            <p className="text-sm text-gray-600 mb-4">Total quantities needed to fulfill all orders</p>
            
            <div className="space-y-4">
              {Object.entries(inventoryNeeds).map(([product, counts]) => {
                const shortage = counts.needed - counts.available;
                const hasShortage = shortage > 0;
                const hasVariants = Object.keys(counts.variants).length > 0;
                
                return (
                  <div key={product} className="border-b pb-4 last:border-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{product}</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Needed:</span>
                        <span className="font-medium">{counts.needed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Available:</span>
                        <span className="font-medium">{counts.available}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-gray-600">To Order:</span>
                        <span className={`font-bold ${hasShortage ? 'text-red-600' : 'text-green-600'}`}>
                          {hasShortage ? shortage : 0}
                        </span>
                      </div>
                    </div>
                    
                    {/* Variant Breakdown */}
                    {hasVariants && (
                      <div className="mt-3 pl-3 border-l-2 border-gray-200 space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase">Specific Products:</p>
                        {Object.entries(counts.variants).map(([variantKey, variantData]) => {
                          const variantShortage = variantData.needed - variantData.available;
                          const hasVariantShortage = variantShortage > 0;
                          const details = variantData.details;
                          
                          // Build display label
                          const displayParts = [];
                          if (details.size) displayParts.push(`Size: ${details.size}`);
                          if (details.color) displayParts.push(`Color: ${details.color}`);
                          if (details.variant) displayParts.push(details.variant);
                          const displayLabel = displayParts.length > 0 ? displayParts.join(', ') : variantKey;
                          
                          return (
                            <div key={variantKey} className="bg-gray-50 rounded p-2 text-xs">
                              <p className="font-medium text-gray-700 mb-1">{displayLabel}</p>
                              <div className="space-y-0.5">
                                <div className="flex justify-between text-gray-600">
                                  <span>Needed:</span>
                                  <span>{variantData.needed}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                  <span>Available:</span>
                                  <span>{variantData.available}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                                  <span>To Order:</span>
                                  <span className={`font-bold ${hasVariantShortage ? 'text-red-600' : 'text-green-600'}`}>
                                    {hasVariantShortage ? variantShortage : 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {hasShortage && (
                      <div className="mt-2 px-2 py-1 bg-red-50 rounded text-xs text-red-700">
                        ⚠️ Shortage: {shortage} unit{shortage !== 1 ? 's' : ''}
                      </div>
                    )}
                    {!hasShortage && counts.available > counts.needed && (
                      <div className="mt-2 px-2 py-1 bg-green-50 rounded text-xs text-green-700">
                        ✓ Surplus: {counts.available - counts.needed} unit{(counts.available - counts.needed) !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h3 className="font-semibold mb-2">Summary</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Products:</span>
                  <span className="font-medium">{Object.keys(inventoryNeeds).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Products with Shortage:</span>
                  <span className="font-medium text-red-600">
                    {Object.values(inventoryNeeds).filter(c => c.needed > c.available).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedOrder.orderId}</h2>
                  <p className="text-sm text-gray-500 mt-1">{selectedOrder.timestamp}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedOrder.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.email}</p>
                  <p><span className="font-medium">Contact:</span> {selectedOrder.contactNumber}</p>
                  <p><span className="font-medium">Payment Schedule:</span> {selectedOrder.paymentSchedule}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">{item.product}</p>
                      <div className="mt-2 text-sm text-gray-600 space-y-1">
                        {item.color && <p>Color: {item.color}</p>}
                        {item.size && <p>Size: {item.size}</p>}
                        {item.variant && <p>Variant: {item.variant}</p>}
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Information */}
              {selectedOrder.proofOfPayment && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Proof of Payment</h3>
                  <a
                    href={selectedOrder.proofOfPayment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Payment Screenshot
                  </a>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-gray-900">₱{selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Status Update */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Update Status</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.orderId, 'pending');
                      setSelectedOrder({ ...selectedOrder, status: 'pending' });
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.orderId, 'confirmed');
                      setSelectedOrder({ ...selectedOrder, status: 'confirmed' });
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Confirmed
                  </button>
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.orderId, 'completed');
                      setSelectedOrder({ ...selectedOrder, status: 'completed' });
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.orderId, 'cancelled');
                      setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Cancelled
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default OrdersPage