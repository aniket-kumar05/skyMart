import React, { useState, useEffect } from 'react';
import { ProductStore } from './ProductContext';
import { toast } from 'react-toastify';


const cartKey = (email) => `cart_${email}`;

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const [cart, setCart] = useState(() => {
    try {
      const loggedIn = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      if (loggedIn?.email) {
        const saved = localStorage.getItem(cartKey(loggedIn.email));
        return saved ? JSON.parse(saved) : [];
      }
    } catch {/* ignore */}
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync the in-memory cart to the ACTIVE user's localStorage key on every change.
  // We read the logged-in user's email directly from localStorage so we don't
  // need to pass the auth context here (avoids circular deps).
  useEffect(() => {
    try {
      const loggedIn = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      if (loggedIn?.email) {
        localStorage.setItem(cartKey(loggedIn.email), JSON.stringify(cart));
      }
    } catch (e) {
      console.error('Error persisting cart to localStorage', e);
    }
  }, [cart]);

  // ── Load cart for a specific user (called on login) ────────────────────────
  const loadCartForUser = (user) => {
    try {
      const saved = localStorage.getItem(cartKey(user.email));
      setCart(saved ? JSON.parse(saved) : []);
    } catch {
      setCart([]);
    }
  };


  const saveAndClearCart = () => {
    setCart([]);
  };

  const clearCart = () => {
    setCart([]);
  };

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
    toast.success('Added to cart 🛒', { position: 'bottom-right' });
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
        loadCartForUser,
        saveAndClearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </ProductStore.Provider>
  );
};