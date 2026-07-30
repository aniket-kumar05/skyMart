import React, { useContext, useEffect, useState, useMemo } from 'react';
import axios from "axios";
import { ProductStore } from '../context/ProductContext';
import ProductCard from '../components/Card';
import { Search, ChevronDown, X } from 'lucide-react';

// Format raw API category slug into a readable label
const formatCategory = (cat) =>
    cat
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

const Product = () => {
    const { products, setProducts } = useContext(ProductStore);
    const [loading, setLoading] = useState(true);

    // Raw text currently being typed (not committed yet)
    const [searchInput, setSearchInput] = useState('');
    // Words committed as chips (created word-by-word as you type a space)
    const [searchTags, setSearchTags] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('Featured');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // Fetch all 194 DummyJSON products so every category is represented
            const res = await axios.get("https://dummyjson.com/products?limit=194");
            if (res.data && Array.isArray(res.data.products)) {
                setProducts(res.data.products);
            }
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!products || products.length === 0) {
            fetchProducts();
        } else {
            setLoading(false);
        }
    }, []);

    // ── Dynamically build unique categories from actual product data ──
    const categories = useMemo(() => {
        if (!Array.isArray(products) || products.length === 0) return [];
        const unique = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
        return unique;
    }, [products]);

    // ── Word-by-word search: commit a word into a chip as soon as a space is typed ──
    const handleSearchChange = (e) => {
        const value = e.target.value;
        if (value.endsWith(' ')) {
            const word = value.trim();
            if (word && !searchTags.includes(word)) {
                setSearchTags((prev) => [...prev, word]);
            }
            setSearchInput('');
        } else {
            setSearchInput(value);
        }
    };

    // Commit whatever is left in the box (e.g. user hits Enter instead of Space)
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && searchInput.trim()) {
            const word = searchInput.trim();
            if (!searchTags.includes(word)) {
                setSearchTags((prev) => [...prev, word]);
            }
            setSearchInput('');
        } else if (e.key === 'Backspace' && searchInput === '' && searchTags.length > 0) {
            // Backspacing on an empty box removes the last chip, like most tag inputs
            setSearchTags((prev) => prev.slice(0, -1));
        }
    };

    const removeTag = (word) => {
        setSearchTags((prev) => prev.filter((t) => t !== word));
    };

    const hasActiveFilters =
        searchTags.length > 0 || searchInput.trim() !== '' || selectedCategory !== 'all';

    const clearAll = () => {
        setSearchInput('');
        setSearchTags([]);
        setSelectedCategory('all');
        setSortBy('Featured');
    };

    // ── Filter & Sort ──
    const filteredProducts = useMemo(() => {
        const terms = [...searchTags, ...(searchInput.trim() ? [searchInput.trim()] : [])].map((t) =>
            t.toLowerCase()
        );

        return (Array.isArray(products) ? products : [])
            .filter((item) => {
                const haystack = `${item.title ?? ''} ${item.category ?? ''} ${item.brand ?? ''}`.toLowerCase();

                const matchesSearch = terms.length === 0 || terms.every((term) => haystack.includes(term));

                const matchesCategory =
                    selectedCategory === 'all' ||
                    item.category === selectedCategory;

                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                if (sortBy === 'Price: Low to High') return a.price - b.price;
                if (sortBy === 'Price: High to Low') return b.price - a.price;
                if (sortBy === 'Top Rated') return b.rating - a.rating;
                if (sortBy === 'Lowest Rated') return a.rating - b.rating;
                return a.id - b.id; // Featured (default)
            });
    }, [products, searchTags, searchInput, selectedCategory, sortBy]);

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white py-6 sm:py-10 px-4 sm:px-6 max-w-7xl mx-auto">

            {/* ── Page Header ── */}
            <div className="mb-5 sm:mb-8">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-1 sm:mb-2">
                    {selectedCategory === 'all'
                        ? 'All Products'
                        : formatCategory(selectedCategory)}
                </h1>
                <p className="text-[#7A7A7A] text-sm sm:text-base font-medium">
                    {loading ? 'Loading products...' : `${filteredProducts.length} products found`}
                    {selectedCategory !== 'all' && !loading && (
                        <span className="text-[#C8FF00] font-semibold"> in {formatCategory(selectedCategory)}</span>
                    )}
                </p>
            </div>

            {/* ── Filter & Search Control Bar ── */}
            <div className="bg-[#141414] border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-10">
                <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4">

                    {/* Search Input */}
                    <div className="flex-1 flex items-center bg-[#1C1C1C] border border-white/20 rounded-xl px-4 py-3 text-white focus-within:border-[#C8FF00] focus-within:shadow-[0_0_0_2px_rgba(200,255,0,0.1)] transition-all w-full">
                        <Search size={18} className="text-[#7A7A7A] shrink-0" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchInput}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyDown}
                            className="bg-transparent border-none outline-none text-white text-sm placeholder:text-[#7A7A7A] w-full ml-3 font-medium"
                        />
                    </div>

                    {/* Category Dropdown — dynamically built from actual products */}
                    <div className="w-full md:w-auto relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full md:w-56 bg-[#1C1C1C] border border-white/20 hover:border-[#C8FF00] focus:border-[#C8FF00] rounded-xl px-4 py-3 pr-10 text-sm text-white outline-none cursor-pointer font-medium transition-all appearance-none"
                        >
                            <option value="all" className="bg-[#1C1C1C] text-white">
                                All Categories
                            </option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat} className="bg-[#1C1C1C] text-white">
                                    {formatCategory(cat)}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A7A] pointer-events-none"
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="w-full md:w-auto relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full md:w-48 bg-[#1C1C1C] border border-white/20 hover:border-[#C8FF00] focus:border-[#C8FF00] rounded-xl px-4 py-3 pr-10 text-sm text-white outline-none cursor-pointer font-medium transition-all appearance-none"
                        >
                            <option value="Featured" className="bg-[#1C1C1C] text-white">Featured</option>
                            <option value="Price: Low to High" className="bg-[#1C1C1C] text-white">Price: Low to High</option>
                            <option value="Price: High to Low" className="bg-[#1C1C1C] text-white">Price: High to Low</option>
                            <option value="Top Rated" className="bg-[#1C1C1C] text-white">Top Rated</option>
                            <option value="Lowest Rated" className="bg-[#1C1C1C] text-white">Lowest Rated</option>
                        </select>
                        <ChevronDown
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A7A] pointer-events-none"
                        />
                    </div>

                    {/* Clear Button */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearAll}
                            className="w-full md:w-auto flex items-center justify-center gap-1.5 bg-[#2A1414] hover:bg-[#3A1A1A] border border-red-500/40 text-red-400 rounded-xl px-4 py-3 text-sm font-semibold transition-all shrink-0"
                        >
                            <X size={14} />
                            Clear
                        </button>
                    )}
                </div>

                {/* ── Active Filter Chips ── */}
                {(searchTags.length > 0 || searchInput.trim() !== '' || selectedCategory !== 'all') && (
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/10">
                        {selectedCategory !== 'all' && (
                            <span className="flex items-center gap-1.5 bg-[#C8FF00] text-black text-xs font-bold rounded-full pl-3 pr-2 py-1.5">
                                {formatCategory(selectedCategory)}
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className="hover:bg-black/10 rounded-full p-0.5"
                                    aria-label="Remove category filter"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        )}
                        {searchTags.map((tag) => (
                            <span
                                key={tag}
                                className="flex items-center gap-1.5 bg-[#1C1C1C] border border-white/20 text-white text-xs font-medium rounded-full pl-3 pr-2 py-1.5"
                            >
                                {tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="hover:bg-white/10 rounded-full p-0.5"
                                    aria-label={`Remove ${tag}`}
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                        {/* The word currently being typed — shows live, before a space commits it */}
                        {searchInput.trim() !== '' && (
                            <span className="flex items-center gap-1.5 bg-[#1C1C1C] border border-dashed border-white/30 text-white/80 text-xs font-medium rounded-full pl-3 pr-2 py-1.5">
                                {searchInput.trim()}
                                <button
                                    onClick={() => setSearchInput('')}
                                    className="hover:bg-white/10 rounded-full p-0.5"
                                    aria-label={`Remove ${searchInput.trim()}`}
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* ── Products Grid ── */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((skel) => (
                        <div key={skel} className="h-96 bg-[#141414] border border-[#272727] rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-[#141414] border border-[#272727] rounded-3xl">
                    <p className="text-xl font-bold text-white mb-2">No products found</p>
                    <p className="text-[#7A7A7A] text-sm">Try adjusting your search or category filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredProducts.map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            )}

        </div>
    );
};

export default Product;