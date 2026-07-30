import React, { useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { AuthStore } from '../context/AuthContext';
import { ProductStore } from '../context/ProductContext';
import {
  ShoppingBag, TrendingUp, Star, Tag, ArrowRight,
  Zap, Shield, DollarSign, ShoppingCart
} from 'lucide-react';

/* ── Category icon/emoji map ── */
const categoryEmojis = {
  beauty: '💄',
  fragrances: '🧴',
  furniture: '🪑',
  groceries: '🛒',
  'home-decoration': '🏠',
  'kitchen-accessories': '🍳',
  laptops: '💻',
  'mens-shirts': '👔',
  'mens-shoes': '👞',
  'mens-watches': '⌚',
  'mobile-accessories': '📱',
  motorcycle: '🏍️',
  'skin-care': '🧖',
  smartphones: '📱',
  'sports-accessories': '⚽',
  sunglasses: '🕶️',
  tablets: '📱',
  tops: '👚',
  vehicle: '🚗',
  'womens-bags': '👜',
  'womens-dresses': '👗',
  'womens-jewellery': '💎',
  'womens-shoes': '👠',
  'womens-watches': '⌚',
};

/* ── Format slug to readable label ── */
const formatCategory = (cat) =>
  cat
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

/* ── Greeting based on time of day ── */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', emoji: '☀️' };
  if (h < 17) return { text: 'Good Afternoon', emoji: '👋' };
  return { text: 'Good Evening', emoji: '🌙' };
};

const Home = () => {
  const navigate = useNavigate();
  const { loggedIn } = useContext(AuthStore);
  const { products, setProducts, cartCount, cartTotal, addToCart } =
    useContext(ProductStore);

  const userName = loggedIn?.name || 'User';
  const greeting = getGreeting();

  /* ── Fetch products if not already loaded ── */
  useEffect(() => {
    if (!products || products.length === 0) {
      axios
        .get('https://dummyjson.com/products?limit=194')
        .then((res) => {
          if (res.data && Array.isArray(res.data.products)) {
            setProducts(res.data.products);
          }
        })
        .catch((err) => console.error('Error fetching products:', err));
    }
  }, []);

  /* ── Derived data ── */
  const safeProducts = Array.isArray(products) ? products : [];

  const categoryData = useMemo(() => {
    const map = {};
    safeProducts.forEach((p) => {
      if (p.category) {
        map[p.category] = (map[p.category] || 0) + 1;
      }
    });
    return Object.entries(map)
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  const topRated = useMemo(
    () =>
      [...safeProducts]
        .filter((p) => p.rating >= 4)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8),
    [products]
  );

  const newArrivals = useMemo(
    () => [...safeProducts].sort((a, b) => b.id - a.id).slice(0, 8),
    [products]
  );

  const topProductsCount = useMemo(
    () => safeProducts.filter((p) => p.rating >= 4.5).length,
    [products]
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* ═══════════════════════════════════════════
            HERO BANNER
        ═══════════════════════════════════════════ */}
        <section className="bg-[#141414] border border-[#272727] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left content */}
            <div className="max-w-lg">
              <p className="text-[10px] sm:text-xs font-bold text-[#C8FF00] uppercase tracking-widest mb-3 sm:mb-4">
                {greeting.text} {greeting.emoji}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3 sm:mb-4">
                Welcome back,
                <br />
                <span className="text-[#C8FF00]">{userName}!</span>
              </h1>
              <p className="text-[#7A7A7A] text-xs sm:text-sm md:text-base leading-relaxed mb-5 sm:mb-6 max-w-md">
                Discover today's picks — hand-curated products across
                electronics, fashion, and more.
              </p>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => navigate('/products')}
                  className="flex items-center gap-2 bg-[#C8FF00] hover:bg-[#a8d900] text-[#0D0D0D] font-bold text-xs sm:text-sm px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all hover:shadow-[0_6px_24px_rgba(200,255,0,0.25)] hover:-translate-y-0.5 active:scale-95 cursor-pointer border-none"
                >
                  Shop Now <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border border-[#333] hover:border-[#555] bg-transparent hover:bg-[#1C1C1C] transition-all cursor-pointer"
                >
                  View All Products
                </button>
              </div>
            </div>

            {/* Right badges */}
            <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
              <div className="flex-1 md:flex-none bg-[#1C1C1C] border border-[#333] rounded-2xl px-5 sm:px-6 py-3 sm:py-4 text-center">
                <p className="text-xl sm:text-2xl font-black text-[#C8FF00]">
                  {safeProducts.length > 0 ? `${safeProducts.length}+` : '...'}
                </p>
                <p className="text-[10px] sm:text-xs text-[#7A7A7A] font-medium mt-1">Products Available</p>
              </div>
              <div className="flex-1 md:flex-none bg-[#1C1C1C] border border-[#333] rounded-2xl px-5 sm:px-6 py-3 sm:py-4 text-center">
                <p className="text-xl sm:text-2xl font-black text-white">Free</p>
                <p className="text-[10px] sm:text-xs text-[#7A7A7A] font-medium mt-1">Delivery on ₹999+</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            STATS ROW
        ═══════════════════════════════════════════ */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          <StatCard
            icon={<ShoppingBag size={20} className="text-[#C8FF00]" />}
            value={cartCount}
            label="Cart Items"
            sub="In your bag"
          />
          <StatCard
            icon={<TrendingUp size={20} className="text-[#C8FF00]" />}
            value={`$${cartTotal.toFixed(2)}`}
            label="Cart Value"
            sub="Ready to checkout"
          />
          <StatCard
            icon={<Star size={20} className="text-[#C8FF00]" />}
            value={topProductsCount}
            label="Top Products"
            sub="Highly rated"
          />
          <StatCard
            icon={<Tag size={20} className="text-[#C8FF00]" />}
            value={categoryData.length}
            label="Categories"
            sub="To explore"
          />
        </section>

        {/* ═══════════════════════════════════════════
            SHOP BY CATEGORY
        ═══════════════════════════════════════════ */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Shop by Category</h2>
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-1 text-[#C8FF00] text-xs sm:text-sm font-semibold bg-transparent border-none cursor-pointer hover:underline"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {categoryData.slice(0, 8).map((cat) => (
              <button
                key={cat.slug}
                onClick={() => navigate('/products')}
                className="bg-[#141414] border border-[#272727] rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center gap-1.5 sm:gap-2 hover:border-[#C8FF00]/40 transition-all cursor-pointer group"
              >
                <span className="text-2xl sm:text-3xl mb-1">
                  {categoryEmojis[cat.slug] || '📦'}
                </span>
                <p className="text-white font-bold text-xs sm:text-sm group-hover:text-[#C8FF00] transition-colors">
                  {formatCategory(cat.slug)}
                </p>
                <p className="text-[#7A7A7A] text-[10px] sm:text-xs font-medium">
                  {cat.count} {cat.count === 1 ? 'item' : 'items'}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            TOP RATED + NEW ARRIVALS
        ═══════════════════════════════════════════ */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">

          {/* ── Top Rated ── */}
          <div className="bg-[#141414] border border-[#272727] rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-white">
                <Star size={18} className="text-[#f59e0b] fill-[#f59e0b]" />
                Top Rated
              </h3>
              <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-1 text-[#C8FF00] text-xs font-semibold bg-transparent border-none cursor-pointer hover:underline"
              >
                See all <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {topRated.map((item) => (
                <ProductRow key={item.id} item={item} onAdd={() => addToCart(item)} />
              ))}
            </div>
          </div>

          {/* ── New Arrivals ── */}
          <div className="bg-[#141414] border border-[#272727] rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-white">
                <Zap size={18} className="text-[#C8FF00] fill-[#C8FF00]" />
                New Arrivals
              </h3>
              <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-1 text-[#C8FF00] text-xs font-semibold bg-transparent border-none cursor-pointer hover:underline"
              >
                See all <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {newArrivals.map((item) => (
                <ProductRow key={item.id} item={item} onAdd={() => addToCart(item)} />
              ))}
            </div>
          </div>

        </section>

        {/* ═══════════════════════════════════════════
            FEATURES ROW
        ═══════════════════════════════════════════ */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12">
          <FeatureCard
            icon={<Zap size={20} className="text-[#C8FF00]" />}
            title="Fast Delivery"
            desc="Same-day on select items"
          />
          <FeatureCard
            icon={<Shield size={20} className="text-[#C8FF00]" />}
            title="Secure Payments"
            desc="100% encrypted checkout"
          />
          <FeatureCard
            icon={<DollarSign size={20} className="text-[#C8FF00]" />}
            title="Best Prices"
            desc="Price-match guarantee"
          />
        </section>

        {/* ═══════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════ */}
        <footer className="border-t border-[#1E1E1E] pt-6 sm:pt-8 pb-4 text-center">
          <p className="text-xl sm:text-2xl font-black text-[#C8FF00] mb-2">SkyMart</p>
          <p className="text-[#5A5A5A] text-[10px] sm:text-xs">
            © 2025 SkyMart • Built with React + Redux + TanStack Query
          </p>
        </footer>

      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Stat Card — used in the stats row
═══════════════════════════════════════════ */
const StatCard = ({ icon, value, label, sub }) => (
  <div className="bg-[#141414] border border-[#272727] rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:border-[#C8FF00]/30 transition-all">
    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#C8FF00]/10 rounded-xl flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-lg sm:text-2xl font-black text-white truncate">{value}</p>
      <p className="text-[10px] sm:text-xs font-semibold text-[#C8FF00]">{label}</p>
      <p className="text-[9px] sm:text-[10px] text-[#7A7A7A] mt-0.5">{sub}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Feature Card — used in the features row
═══════════════════════════════════════════ */
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-[#141414] border border-[#272727] rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#C8FF00]/10 rounded-xl flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-white font-bold text-xs sm:text-sm">{title}</p>
      <p className="text-[#7A7A7A] text-[10px] sm:text-xs mt-0.5">{desc}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Product Row — compact list item used in
   Top Rated & New Arrivals sections
═══════════════════════════════════════════ */
const ProductRow = ({ item, onAdd }) => (
  <div className="flex items-center justify-between bg-[#1C1C1C] border border-[#272727] rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 hover:border-[#333] transition-all group">
    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shrink-0 overflow-hidden p-1">
        <img
          src={item.thumbnail || item.images?.[0]}
          alt={item.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      {/* Title hidden on very small screens, price always visible */}
      <p className="hidden sm:block text-sm font-semibold text-white truncate max-w-[140px]">{item.title}</p>
    </div>
    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
      <span className="text-[#C8FF00] font-bold text-xs sm:text-sm">${Number(item.price).toFixed(2)}</span>
      <button
        onClick={onAdd}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#C8FF00]/10 border border-[#C8FF00]/20 flex items-center justify-center text-[#C8FF00] hover:bg-[#C8FF00] hover:text-[#0D0D0D] transition-all cursor-pointer"
        aria-label={`Add ${item.title} to cart`}
      >
        <ShoppingCart size={14} />
      </button>
    </div>
  </div>
);

export default Home;
