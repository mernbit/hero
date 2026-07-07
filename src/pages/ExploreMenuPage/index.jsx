import React, { useState, useMemo } from "react";
import { useTenant } from "../../context/TenantContext";
import { useCart } from "../../context/CartContext";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

const ExploreMenuPage = () => {
  const tenant = useTenant();
  const { openModal } = useCart();
  const allProducts = tenant.products;
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState({});

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = [
      "All",
      ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
    ];
    return cats;
  }, [allProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, activeCategory, searchQuery]);

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full min-h-screen bg-[#f2f4f7]">
      {/* Hero Banner */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, var(--color-accent) 0%, color-mix(in srgb, var(--color-accent) 80%, #000) 100%)`,
          minHeight: "220px",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: "white" }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-[200px] h-[200px] rounded-full opacity-5"
          style={{ background: "white" }}
        />

        <div className="max-w-[1440px] mx-auto px-4 md:px-12 pt-24 pb-10 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-[13px] mb-4">
            <Link
              to={`/${tenant.id}`}
              className="hover:text-white transition-colors no-underline text-white/60"
            >
              Home
            </Link>
            <svg
              viewBox="0 0 24 24"
              className="w-[12px] h-[12px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span className="text-white">Full Menu</span>
          </div>

          <h1 className="bungee-regular text-4xl md:text-5xl text-white mb-3">
            Full Menu
          </h1>
          <p className="text-white/70 text-[15px] max-w-[500px] leading-[1.6]">
            Explore our complete range of mouth-watering dishes. From crispy
            favorites to family feasts — there's something for everyone.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-[420px] relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg
                viewBox="0 0 24 24"
                className="w-[18px] h-[18px] text-text-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for a dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3.5 pl-12 pr-4 rounded-full bg-white border-none text-[14px] text-text-main placeholder:text-text-muted/60 outline-none"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
            />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12">
          <div
            className="flex gap-2 py-4 overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 py-2.5 px-6 rounded-full text-[13px] font-semibold border-2 cursor-pointer transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-accent text-white border-accent"
                    : "bg-white text-text-main border-gray-200 hover:border-accent hover:text-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-10">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[14px] text-text-muted">
            Showing{" "}
            <span className="font-bold text-text-main">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1 ? "item" : "items"}
            {activeCategory !== "All" && (
              <span>
                {" "}
                in{" "}
                <span className="font-bold text-accent">{activeCategory}</span>
              </span>
            )}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg
              viewBox="0 0 24 24"
              className="w-[48px] h-[48px] text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <h3 className="text-[18px] font-bold text-text-main mb-1">
              No items found
            </h3>
            <p className="text-[14px] text-text-muted">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openModal(item)}
                className="relative bg-white rounded-lg overflow-hidden group cursor-pointer"
                style={{
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.35s ease, transform 0.35s ease",
                  animationDelay: `${index * 60}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 16px 48px rgba(0,0,0,0.12)";
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 2px 12px rgba(0,0,0,0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Accent Bars + Wishlist */}
                <div className="absolute top-0 left-0 right-0 flex items-start justify-between px-4 pt-3 z-10">
                  <div className="flex gap-[6px]">
                    <div className="w-[14px] h-[18px] bg-accent rounded-b-sm"></div>
                    <div className="w-[14px] h-[18px] bg-accent rounded-b-sm"></div>
                    <div className="w-[14px] h-[18px] bg-accent rounded-b-sm"></div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item.id);
                    }}
                    className="w-[34px] h-[34px] rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border-none cursor-pointer hover:bg-white hover:scale-110 transition-all duration-200"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-[18px] h-[18px]"
                      fill={wishlist[item.id] ? "#E4002B" : "none"}
                      stroke={wishlist[item.id] ? "#E4002B" : "#999"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                {/* Category Badge */}
                {item.category && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                    {/* intentionally blank to keep layout */}
                  </div>
                )}

                {/* Image */}
                <div className="relative h-[220px] flex items-center justify-center px-8 pt-10 pb-4 overflow-hidden bg-linear-to-b from-white/0 to-gray-50/50">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Content */}
                <div className="px-5 pb-5 pt-2">
                  {/* Category Tag */}
                  {item.category && (
                    <span className="inline-block text-[11px] font-semibold text-accent/70 uppercase tracking-wider mb-1.5">
                      {item.category}
                    </span>
                  )}

                  <h3 className="font-bold text-[17px] text-text-main leading-tight mb-1">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-[13px] text-text-muted leading-normal mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Price + Button */}
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[20px] text-text-main">
                      <span className="text-[13px] font-bold mr-0.5">Rs</span>
                      {item.price}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); openModal(item); }}
                      className="flex items-center gap-1.5 py-2 px-4 bg-accent text-white border-none rounded-full text-[12px] font-bold cursor-pointer uppercase tracking-wider hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-200"
                      style={{ boxShadow: "0 4px 12px rgba(228,0,43,0.25)" }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-[14px] h-[14px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add to Bucket
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ExploreMenuPage;
