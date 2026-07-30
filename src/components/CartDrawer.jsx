import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { ProductStore } from '../context/ProductContext';
import { toast } from 'react-toastify';

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  } = useContext(ProductStore);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    clearCart();
    toast.success("Order Placed! Thank you for shopping with SkyMart", { position: "bottom-right" });
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* ── Dark Blurred Backdrop ── */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
      />

      {/* ── Slide-over Panel ── */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#121212] border-l border-[#272727] shadow-2xl z-50 flex flex-col justify-between transform transition-transform duration-300 ease-out">
        
        {/* ── Drawer Header ── */}
        <div className="p-6 border-b border-[#242424] flex items-center justify-between bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C8FF00]/10 flex items-center justify-center text-[#C8FF00]">
              <ShoppingBag size={18} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Cart</h2>
            <span className="bg-[#C8FF00]/15 text-[#C8FF00] border border-[#C8FF00]/30 rounded-full px-2.5 py-0.5 text-xs font-semibold">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="text-[#7A7A7A] hover:text-white p-1.5 rounded-lg hover:bg-[#202020] transition-colors cursor-pointer border-none"
            aria-label="Close Cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Cart Items List ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-20">
              {/* Box Icon */}
              <div className="w-24 h-24 rounded-3xl bg-[#1E1E1E] flex items-center justify-center shadow-inner">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Bottom face */}
                  <path
                    d="M24 28L8 20V36L24 44L40 36V20L24 28Z"
                    stroke="#555"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Top face */}
                  <path
                    d="M24 4L8 12L24 20L40 12L24 4Z"
                    stroke="#555"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Left vertical */}
                  <line x1="8" y1="12" x2="8" y2="20" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
                  {/* Right vertical */}
                  <line x1="40" y1="12" x2="40" y2="20" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
                  {/* Center vertical */}
                  <line x1="24" y1="20" x2="24" y2="28" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>

              {/* Text */}
              <div className="space-y-1.5">
                <p className="text-xl font-bold text-white">Cart is empty</p>
                <p className="text-sm text-[#7A7A7A]">Go shop something cool!</p>
              </div>

              {/* Browse Products Button */}
              <button
                onClick={() => { setIsCartOpen(false); navigate('/products'); }}
                className="bg-[#C8FF00] hover:bg-[#a8d900] text-[#0D0D0D] font-bold text-base px-8 py-3.5 rounded-full transition-all hover:shadow-[0_6px_24px_rgba(200,255,0,0.25)] hover:-translate-y-0.5 active:scale-95 cursor-pointer border-none"
              >
                Browse Products
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-[#181818] border border-[#2B2B2B] rounded-2xl p-4 flex gap-4 relative transition-colors hover:border-[#383838]"
              >
                {/* Product Image Box */}
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1.5 overflow-hidden shrink-0">
                  <img
                    src={item.thumbnail || item.images?.[0]}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Details & Controls */}
                <div className="flex-1 min-w-0 pr-6">
                  <h3 className="text-sm font-semibold text-white line-clamp-1 mb-1">
                    {item.title}
                  </h3>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-[#C8FF00] font-bold text-base">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                    <span className="text-xs text-[#7A7A7A]">
                      ${Number(item.price).toFixed(2)} each
                    </span>
                  </div>

                  {/* Quantity Control Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-[#242424] border border-[#333] hover:bg-[#303030] text-white flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="text-sm font-bold text-white px-2">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-[#242424] border border-[#333] hover:bg-[#303030] text-white flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Remove Icon */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="absolute bottom-4 right-4 text-[#7A7A7A] hover:text-red-400 p-1 transition-colors cursor-pointer bg-transparent border-none"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* ── Footer / Checkout Section ── */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#242424] bg-[#121212] space-y-4">
            {/* Total Row */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#7A7A7A]">Total</span>
              <span className="text-3xl font-black text-white tracking-tight">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-[#C8FF00] hover:bg-[#a8d900] text-[#0D0D0D] font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-[0_6px_24px_rgba(200,255,0,0.2)] transition-all hover:scale-[1.01] active:scale-95 border-none"
            >
              Checkout <ArrowRight size={18} />
            </button>

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="w-full text-center text-xs font-medium text-[#7A7A7A] hover:text-white transition-colors bg-transparent border-none cursor-pointer py-1"
            >
              Clear cart
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;
