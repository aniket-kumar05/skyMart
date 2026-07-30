import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { ProductStore } from '../context/ProductContext';
import ProductCard from '../components/Card';
import {
  Star, ShoppingCart, Check, ArrowLeft, Shield, Truck, RotateCcw, Award
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, setProducts, cart, addToCart } = useContext(ProductStore);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product data & full catalog if not loaded
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);

    const getSingleProduct = async () => {
      try {
        // Try finding from context first
        const found = products?.find((p) => p.id === Number(id));
        if (found) {
          setProduct(found);
        } else {
          const res = await axios.get(`https://dummyjson.com/products/${id}`);
          setProduct(res.data);
        }

        // Ensure products catalog is loaded for related products section
        if (!products || products.length === 0) {
          const catalogRes = await axios.get('https://dummyjson.com/products?limit=194');
          if (catalogRes.data && Array.isArray(catalogRes.data.products)) {
            setProducts(catalogRes.data.products);
          }
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    };

    getSingleProduct();
  }, [id, products, setProducts]);

  const isAdded = cart?.some((item) => item?.id === product?.id);

  // Derived related products (same category or top products, excluding current)
  const relatedProducts = (Array.isArray(products) ? products : [])
    .filter((p) => p.id !== Number(id))
    .filter((p) => (product?.category ? p.category === product.category : true))
    .slice(0, 5);

  // Fallback if not enough category matches
  const displayRelated = relatedProducts.length >= 3
    ? relatedProducts
    : (Array.isArray(products) ? products : [])
        .filter((p) => p.id !== Number(id))
        .slice(0, 5);

  const categoryName = product?.category
    ? product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' ')
    : 'General';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white py-10 px-6 max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#C8FF00] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#7A7A7A] text-sm">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white py-20 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-[#C8FF00] text-[#0D0D0D] font-bold px-6 py-3 rounded-xl cursor-pointer"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* ── Back Button ── */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-2 text-sm font-medium text-[#7A7A7A] hover:text-white transition-colors mb-8 cursor-pointer bg-transparent border-none"
      >
        <ArrowLeft size={18} /> Back to Products
      </button>

      {/* ── Main Product Detail Card ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-[#141414] border border-[#272727] rounded-3xl p-6 sm:p-10 mb-16 shadow-xl">
        
        {/* Left Image View */}
        <div className="relative bg-white p-8 rounded-2xl h-80 sm:h-96 md:h-[420px] flex items-center justify-center overflow-hidden">
          <span className="absolute top-4 left-4 z-10 bg-[#2A2A2A]/90 backdrop-blur-sm text-white text-xs font-semibold px-3.5 py-1.5 rounded-full capitalize border border-[#3E3E3E] shadow-sm">
            {categoryName}
          </span>
          <img
            src={product.thumbnail || product.images?.[0]}
            alt={product.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Right Content Details */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Category */}
            <p className="text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider mb-2">
              {categoryName}
            </p>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              {product.title}
            </h1>

            {/* Rating & Stock Pill */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={`${
                      star <= Math.round(product.rating || 4)
                        ? 'fill-[#f59e0b] text-[#f59e0b]'
                        : 'fill-transparent text-[#444]'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-white">
                  {product.rating}
                </span>
                <span className="text-xs text-[#7A7A7A]">
                  ({product.stock ? product.stock * 4 : 85} reviews)
                </span>
              </div>

              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                In Stock ({product.stock || 25} units left)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-black text-[#C8FF00] tracking-tight">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.discountPercentage && (
                <span className="ml-3 text-sm text-[#7A7A7A] line-through">
                  ${(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-[#9A9A9A] text-sm sm:text-base leading-relaxed mb-8">
              {product.description}
            </p>
          </div>

          {/* Action Button & Features */}
          <div className="space-y-6">
            {/* Add to Cart Button */}
            {isAdded ? (
              <button
                onClick={() => addToCart(product)}
                className="w-full flex items-center justify-center gap-2 bg-[#062D1B] border border-[#10B981]/60 text-[#10B981] font-bold text-base py-4 rounded-2xl transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(16,185,129,0.2)] active:scale-95"
              >
                <Check size={20} strokeWidth={2.5} />
                Added to Cart
              </button>
            ) : (
              <button
                onClick={() => addToCart(product)}
                className="w-full flex items-center justify-center gap-2 bg-[#C8FF00] hover:bg-[#a8d900] text-[#0D0D0D] font-bold text-base py-4 rounded-2xl transition-all duration-200 hover:shadow-[0_6px_24px_rgba(200,255,0,0.25)] active:scale-95 cursor-pointer border-none"
              >
                <ShoppingCart size={20} strokeWidth={2.5} />
                Add to Cart
              </button>
            )}

            {/* Features Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#242424]">
              <div className="flex items-center gap-2 text-xs text-[#7A7A7A]">
                <Truck size={16} className="text-[#C8FF00] shrink-0" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#7A7A7A]">
                <Shield size={16} className="text-[#C8FF00] shrink-0" />
                <span>2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#7A7A7A]">
                <RotateCcw size={16} className="text-[#C8FF00] shrink-0" />
                <span>30-Day Return</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#7A7A7A]">
                <Award size={16} className="text-[#C8FF00] shrink-0" />
                <span>Authentic</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── Related Products Section ── */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-6">
          Related Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {displayRelated.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
        <footer className="border-t border-[#1E1E1E] pt-6 sm:pt-8 pb-4 text-center">
          <p className="text-xl sm:text-2xl font-black text-[#C8FF00] mb-2">SkyMart</p>
          <p className="text-[#5A5A5A] text-[10px] sm:text-xs">
            © 2025 SkyMart • Built with React + Redux + TanStack Query
          </p>
        </footer>
      </section>

    </div>
  );
};

export default ProductDetail;
