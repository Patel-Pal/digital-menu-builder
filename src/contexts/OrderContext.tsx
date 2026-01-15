import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '@/services/menuItemService';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface OrderContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
  deviceId: string;
  customerName: string;
  setCustomerName: (name: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deviceId, setDeviceId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');

  // Generate or retrieve device ID
  useEffect(() => {
    let storedDeviceId = localStorage.getItem('deviceId');
    if (!storedDeviceId) {
      storedDeviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('deviceId', storedDeviceId);
    }
    setDeviceId(storedDeviceId);

    // Retrieve stored customer name
    const storedName = localStorage.getItem('customerName');
    if (storedName) {
      setCustomerName(storedName);
    }
  }, []);

  // Save customer name to localStorage
  const handleSetCustomerName = (name: string) => {
    setCustomerName(name);
    localStorage.setItem('customerName', name);
  };

  const addToCart = (menuItem: MenuItem, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.menuItem._id === menuItem._id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.menuItem._id === menuItem._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { menuItem, quantity }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.menuItem._id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.menuItem._id === itemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <OrderContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalAmount,
      getTotalItems,
      deviceId,
      customerName,
      setCustomerName: handleSetCustomerName
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
