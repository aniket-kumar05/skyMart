import React, { useState, useEffect } from 'react';
import { ProductStore } from './ProductContext';
import { toast } from 'react-toastify';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  // Persistent Cart state initialized from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart state to localStorage on any change
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cart));
    } catch (e) {
      console.error("Error persisting cart to localStorage", e);
    }
  }, [cart]);

  // Reset in-memory cart when another part of the app clears cartItems
  // (e.g. logout or new account creation)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "cartItems" && e.newValue === null) {
        setCart([]);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Add product to cart & open cart drawer
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
     toast.success("Added to cart 🛒", { position: "bottom-right" });
  };

  // Update item quantity
  const updateQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Clear all items & localStorage
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cartItems");
  };

  // Calculate totals
  const cartTotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ProductStore.Provider
      value={{
        products,
        setProducts,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cart,
        setCart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </ProductStore.Provider>
  );
};