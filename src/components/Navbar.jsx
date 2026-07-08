import React, { useState } from "react";
import { useTenant } from "../context/TenantContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Navbar = ({ isStatic = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const tenant = useTenant();
  const { itemCount } = useCart();

  return (
    <div
      className={
        isStatic
          ? "w-full relative z-50"
          : "fixed top-3 left-4 right-4 lg:left-5 lg:right-5 z-[9999]"
      }
    >
      <header className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center shrink-0">
            <svg viewBox="0 0 40 40" fill="none" className="w-[26px] h-[26px]">
              <circle cx="20" cy="20" r="16" stroke="#fff" strokeWidth="2" />
              <path
                d="M12 20c4-8 12-8 16 0"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 20c4 8 12 8 16 0"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex flex-col leading-[1.1]">
            <span className="font-bold text-[12px] lg:text-[14px] tracking-[1.5px] uppercase">
              {tenant?.name || "The Creamery"}
            </span>
            <span className="text-[8px] lg:text-[9px] tracking-[2px] uppercase text-text-muted">
              {tenant?.since || "Since 2024"}
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-0 bg-white/10 border border-white backdrop-blur-sm rounded-full py-1.5 px-2 shadow-[0_1px_4px_rgba(0,0,0,.06)]">
          <a
           href="#home"
           className="no-underline text-text-main text-[14px] font-medium py-2 px-5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Home
          </a>
          <a
            href="#explore"
            className="no-underline text-text-main text-[14px] font-medium py-2 px-5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Products
          </a>
          <a
            href="#gallery"
            className="no-underline text-text-main text-[14px] font-medium py-2 px-5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Gallery
          </a>
          <a
            href="#about"
            className="no-underline text-text-main text-[14px] font-medium py-2 px-5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
          >
            About
          </a>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/20 border border-white backdrop-blur-sm z-10000"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-5 h-5 text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Right side controls */}
        <div className="hidden lg:flex items-center gap-3 w-[160px] justify-end">
          <Link
            href={`/${tenant?.id}/cart`}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/20 border border-white backdrop-blur-sm hover:bg-white/40 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-[scaleUp_0.2s_ease-out]">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden absolute top-[60px] left-0 right-0 bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 z-9999 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${
          isMobileMenuOpen
            ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-y-75 -translate-y-4 pointer-events-none"
        }`}
      >
        <a
          href="#home"
          className="no-underline text-text-main text-[15px] font-semibold py-3 px-4 rounded-xl cursor-pointer bg-white/50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Home
        </a>
        <a
          href="#explore"
          className="no-underline text-text-main text-[15px] font-medium py-3 px-4 rounded-xl cursor-pointer hover:bg-white/50 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Products
        </a>
        <a
          href="#about"
          className="no-underline text-text-main text-[15px] font-medium py-3 px-4 rounded-xl cursor-pointer hover:bg-white/50 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          About
        </a>
        <a
          href="#gallery"
          className="no-underline text-text-main text-[15px] font-medium py-3 px-4 rounded-xl cursor-pointer hover:bg-white/50 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Gallery
        </a>
      </div>
    </div>
  );
};

export default Navbar;
