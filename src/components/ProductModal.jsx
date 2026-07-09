import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useTenant } from "../context/TenantContext";

const ProductModal = () => {
  const { isModalOpen, closeModal, selectedProduct, addToCart } = useCart();
  const tenant = useTenant();
  const [quantity, setQuantity] = useState(1);

  if (!isModalOpen || !selectedProduct) return null;

  const handleAdd = () => {
    addToCart(selectedProduct, quantity);
    setQuantity(1);
  };

  const totalPrice = (selectedProduct.price * quantity).toLocaleString();

  return (
    <div 
      className="fixed inset-0 z-10000 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]"
      onClick={closeModal}
    >
      {/* Modal Container */}
      <div 
        className="relative bg-white w-full max-w-[800px] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden scale-95 animate-[scaleUp_0.3s_ease-out_forwards]"
        onClick={(e) => e.stopPropagation()}
        style={{ minHeight: "500px" }}
      >
        {/* Top 3 Red Bars */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-[6px] z-10">
          <div className="w-[16px] h-[20px] bg-accent rounded-b-sm"></div>
          <div className="w-[16px] h-[20px] bg-accent rounded-b-sm"></div>
          <div className="w-[16px] h-[20px] bg-accent rounded-b-sm"></div>
        </div>

        {/* Close Button */}
        <button 
          onClick={closeModal}
          className="absolute top-2 right-2 z-10 w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white cursor-pointer hover:brightness-90 transition-colors border-none"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Left Panel: Options */}
        <div className="w-full md:w-1/2 p-6 md:p-8 md:pr-4 pt-12 md:pt-14 overflow-y-auto max-h-[70vh] md:max-h-none border-r border-gray-100 flex flex-col gap-3">
          
          {/* Expanded Option */}
          <div className="rounded-lg overflow-hidden border border-gray-100">
            <div className="bg-accent text-white px-4 py-3 flex justify-between items-center font-bold text-[15px]">
              <span>Choose an option</span>
              <svg viewBox="0 0 24 24" className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <div className="bg-[#f0f2f5] px-4 py-4 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-[20px] h-[20px] rounded-full border-2 border-accent flex items-center justify-center bg-white">
                  <div className="w-[10px] h-[10px] rounded-full bg-accent"></div>
                </div>
                <span className="text-[15px] text-text-main font-medium">{selectedProduct.title}</span>
              </div>
              <span className="text-[12px] text-text-muted">+Rs {selectedProduct.price}</span>
            </div>
          </div>

          {/* Collapsed Options */}
          {[
            "Complete With a Drink",
            "Perfect Pairings",
            "Don't forget the Fries!",
            "Add Some Dips"
          ].map((title, i) => (
            <div key={i} className="bg-accent text-white px-4 py-3 rounded-lg flex justify-between items-center cursor-pointer hover:brightness-90 transition-colors">
              <span className="font-bold text-[15px]">{title}</span>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold">(Optional)</span>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel: Product Info */}
        <div className="w-full md:w-1/2 p-6 md:p-8 pt-10 md:pt-14 flex flex-col items-center justify-between">
          <div className="flex flex-col items-center w-full">
            <div className="w-full h-[220px] flex items-center justify-center mb-6">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.title} 
                className="max-w-full max-h-full object-contain drop-shadow-xl"
              />
            </div>
            <h2 className="font-black text-[28px] md:text-[32px] text-center text-text-main leading-tight mb-3" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-1px" }}>
              {selectedProduct.title}
            </h2>
            <p className="text-[14px] text-center text-text-muted leading-[1.6] max-w-[90%] mb-6">
              {selectedProduct.description || "A delicious meal prepared fresh just for you."}
            </p>
          </div>

          <div className="w-full flex flex-col items-center mt-auto gap-5">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-[42px] h-[42px] rounded-lg border border-gray-300 bg-white flex items-center justify-center text-[24px] font-medium text-text-main cursor-pointer hover:bg-gray-50 transition-colors"
              >−</button>
              <span className="font-bold text-[20px] w-8 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-[42px] h-[42px] rounded-lg border border-accent text-accent bg-white flex items-center justify-center text-[24px] font-medium cursor-pointer hover:bg-gray-50 transition-colors"
              >+</button>
            </div>

            {/* Add to Bucket Button */}
            <button 
              onClick={handleAdd}
              className="w-full bg-accent text-white rounded-xl py-3 px-5 flex items-center justify-between hover:brightness-90 transition-all cursor-pointer border-none shadow-lg shadow-black/20 hover:-translate-y-1"
            >
              <span className="font-bold text-[16px] tracking-wide">RS {totalPrice}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[16px] tracking-wider uppercase">Add to Bucket</span>
                <div className="w-[26px] h-[26px] bg-white rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] text-accent" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ProductModal;
