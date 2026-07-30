import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { Star, ShoppingCart, Check } from "lucide-react";
import { ProductStore } from "../context/ProductContext";

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useContext(ProductStore);
  const navigate = useNavigate();

  if (!product) return null;

  const isAdded = cart?.some((item) => item.id === product.id);

  const categoryName = product.category
    ? product.category.charAt(0).toUpperCase() + product.category.slice(1).replace("-", " ")
    : "General";

  const reviewCount = product.stock ? product.stock : 85;

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group overflow-hidden rounded-3xl border border-[#272727] bg-[#141414] hover:border-[#C8FF00]/60 hover:shadow-[0_0_30px_rgba(200,255,0,0.08)] transition-all duration-300 flex flex-col justify-between h-full cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative bg-white p-6 h-64 flex items-center justify-center overflow-hidden rounded-t-3xl">
        <span className="absolute top-4 left-4 z-10 bg-[#2A2A2A]/90 backdrop-blur-sm text-white text-xs font-semibold px-3.5 py-1.5 rounded-full capitalize border border-[#3E3E3E] shadow-sm">
          {categoryName}
        </span>
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Bottom Content Info */}
      <div className="p-6 flex flex-col flex-1 justify-between bg-[#141414]">
        <div>
          <p className="text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider mb-1.5">
            {categoryName}
          </p>

          <h2 className="text-base font-bold text-white tracking-tight line-clamp-1 mb-3 group-hover:text-[#C8FF00] transition-colors">
            {product.title}
          </h2>

          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={`${
                  star <= Math.round(product.rating || 4)
                    ? "fill-[#f59e0b] text-[#f59e0b]"
                    : "fill-transparent text-[#444]"
                }`}
              />
            ))}
            <span className="ml-1.5 text-xs font-medium text-[#7A7A7A]">
              ({reviewCount})
            </span>
          </div>
        </div>

        {/* Divider & Price/Action Footer */}
        <div>
          <div className="border-t border-[#262626] mb-4" />

          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-[#C8FF00] tracking-tight">
              ${Number(product.price).toFixed(2)}
            </span>

            {/* Add / Added Button (stopPropagation avoids triggering card click) */}
            {isAdded ? (
              <button
                onClick={handleAddClick}
                className="flex items-center gap-1.5 bg-[#062D1B] border border-[#10B981]/60 text-[#10B981] font-bold text-sm px-4 py-2.5 rounded-full transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(16,185,129,0.2)] active:scale-95"
              >
                <Check size={16} strokeWidth={2.5} />
                Added
              </button>
            ) : (
              <button
                onClick={handleAddClick}
                className="flex items-center gap-1.5 bg-[#C8FF00] hover:bg-[#a8d900] text-[#0D0D0D] font-bold text-sm px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-[0_4px_16px_rgba(200,255,0,0.25)] active:scale-95 cursor-pointer border-none"
              >
                <ShoppingCart size={16} strokeWidth={2.5} />
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;