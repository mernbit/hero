import React, { useRef } from "react";
import { useTenant } from "../context/TenantContext";

const ExploreMenu = () => {
  const tenant = useTenant();
  const categories = tenant.exploreMenu;
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = 260;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-[#f2f4f7] relative py-16 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h2 className="bungee-regular text-3xl md:text-4xl text-text-main uppercase">
              Explore Menu
            </h2>
            <div className="w-[60px] h-[4px] bg-accent mt-2 rounded-full"></div>
          </div>
          <a
            href="#"
            className="text-[14px] font-bold text-text-main uppercase underline underline-offset-4 tracking-wide hover:text-accent transition-colors mt-2"
          >
            View All
          </a>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-[36px] h-[36px] rounded-full border-2 border-accent bg-white flex items-center justify-center cursor-pointer hover:bg-accent hover:text-white transition-all group shadow-md"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[16px] h-[16px] text-accent group-hover:text-white"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            className="flex gap-6 md:gap-10 overflow-x-auto scrollbar-hide px-8 md:px-10 py-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-4 cursor-pointer group snap-start shrink-0"
                style={{ minWidth: "160px" }}
              >
                {/* Circle Image */}
                <div className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-l-full rounded-t-full bg-white shadow-sm flex items-center justify-center overflow-hidden group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-[75%] h-[75%] object-contain drop-shadow-md"
                  />
                </div>

                {/* Category Name */}
                <span className="text-[14px] md:text-[15px] font-semibold text-text-main text-center leading-tight">
                  {cat.name}
                </span>

                {/* Accent underline */}
                <div className="w-[30px] h-[3px] bg-accent rounded-full -mt-1"></div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-[36px] h-[36px] rounded-full border-2 border-accent bg-white flex items-center justify-center cursor-pointer hover:bg-accent hover:text-white transition-all group shadow-md"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[16px] h-[16px] text-accent group-hover:text-white"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExploreMenu;
