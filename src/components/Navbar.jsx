import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { Zap, ShoppingBag, LogOut, Menu, X } from 'lucide-react';
import { AuthStore } from '../context/AuthContext';
import { ProductStore } from '../context/ProductContext';

const Navbar = () => {
  const { loggedIn, logout } = useContext(AuthStore);
  const { setIsCartOpen, cartCount, clearCart } = useContext(ProductStore);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearCart(); // clear in-memory cart state immediately
    logout();
    navigate('/login');
  };

  const userName = loggedIn?.name || (typeof loggedIn === 'string' ? loggedIn : 'User');
  const initial = userName.charAt(0).toUpperCase();

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-[#C8FF00] font-semibold relative after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#C8FF00]'
      : 'text-[#7A7A7A] hover:text-white transition-colors';

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? 'text-[#C8FF00] font-semibold text-lg'
      : 'text-[#7A7A7A] hover:text-white transition-colors text-lg';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">

        {/* ── Brand Logo ── */}
        <NavLink to="/home" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#C8FF00] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(200,255,0,0.15)] group-hover:scale-105 transition-transform">
            <Zap size={18} color="#0D0D0D" fill="#0D0D0D" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Sky<span className="text-[#C8FF00]">Mart</span>
          </span>
        </NavLink>

        {/* ── Center Nav Links (Desktop only) ── */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <NavLink to="/home" className={navLinkClass}>Home</NavLink>
          <NavLink to="/products" className={navLinkClass}>Shop</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
        </nav>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Profile Pill */}
          <div className="flex items-center gap-2 bg-[#1C1C1C] border border-[#333] rounded-full px-3 py-1.5 text-sm font-medium text-white shadow-sm">
            <div className="w-6 h-6 rounded-full bg-[#C8FF00] text-[#0D0D0D] flex items-center justify-center text-xs font-bold shrink-0">
              {initial}
            </div>
            <span className="capitalize text-white/90">{userName}</span>
          </div>

          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1C1C1C] border border-[#333] flex items-center justify-center text-white/80 hover:text-white hover:border-[#444] hover:bg-[#252525] transition-all cursor-pointer relative"
            aria-label="Open Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#C8FF00] text-[#0D0D0D] font-bold text-[10px] rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Logout Button (Desktop) */}
          <button
            onClick={handleLogout}
            className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1C1C1C] border border-[#333] items-center justify-center text-[#7A7A7A] hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all cursor-pointer"
            aria-label="Log Out"
          >
            <LogOut size={18} />
          </button>

          {/* Hamburger Menu (Mobile only) */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1C1C1C] border border-[#333] flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {/* ── Mobile Slide-down Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121212] border-t border-[#222] px-6 py-5 space-y-4 animate-fadeIn flex flex-col items-start">
          <NavLink
            to="/home"
            className={mobileNavLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={mobileNavLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            Shop
          </NavLink>
          <NavLink
            to="/about"
            className={mobileNavLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </NavLink>
          
          <div className="w-full border-t border-[#222]" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 text-red-500 hover:text-red-400 font-semibold text-lg transition-colors cursor-pointer bg-transparent border-none"
            aria-label="Log Out"
          >
            <LogOut size={20} className="text-red-500" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;