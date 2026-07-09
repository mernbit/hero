import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTenant } from "../../context/TenantContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const tenant = useTenant();

  return (
    <div className="w-full min-h-screen bg-[#f2f4f7] flex flex-col">
      {/* Sticky Header Area */}
      <div className="w-full bg-accent/5 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 pt-4 pb-2">
          <Navbar isStatic={true} />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-10 flex-1 w-full">
        <h1 className="font-black text-[32px] md:text-[40px] text-text-main uppercase mb-8" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-1px" }}>
          Your Bucket
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <h2 className="text-[24px] font-bold text-text-main mb-2">Your bucket is empty</h2>
            <p className="text-text-muted mb-8 max-w-[400px]">Looks like you haven't added any items to your bucket yet. Start exploring our menu to discover delicious options!</p>
            <Link 
              to={`/${tenant?.id}/menu`}
              className="bg-accent text-white px-8 py-3.5 rounded-full font-bold uppercase tracking-wider hover:brightness-110 transition-all no-underline"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="bg-white p-4 md:p-6 rounded-xl shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start relative border border-gray-100">
                  <button 
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>

                  <div className="w-[120px] h-[120px] shrink-0 bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                    <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  </div>

                  <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                    <h3 className="font-bold text-[18px] text-text-main mb-1">{item.title}</h3>
                    <p className="text-[13px] text-text-muted mb-4 line-clamp-2">{item.description}</p>
                    
                    <div className="flex flex-col sm:flex-row items-center sm:justify-between w-full mt-auto gap-4">
                      <span className="font-black text-[18px] text-accent">Rs {item.price}</span>
                      
                      <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-200">
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-8 h-8 rounded-md bg-white flex items-center justify-center font-bold text-text-main hover:bg-gray-100 cursor-pointer border border-gray-200 shadow-sm"
                        >−</button>
                        <span className="font-bold text-[15px] w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-8 h-8 rounded-md bg-white flex items-center justify-center font-bold text-text-main hover:bg-gray-100 cursor-pointer border border-gray-200 shadow-sm"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6 border border-gray-100">
                <h3 className="font-bold text-[20px] text-text-main mb-6 uppercase tracking-tight font-inter">Order Summary</h3>
                
                <div className="flex flex-col gap-4 mb-6 text-[15px]">
                  <div className="flex justify-between items-center text-text-muted">
                    <span>Subtotal</span>
                    <span className="font-semibold text-text-main">Rs {cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-text-muted">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-text-main">Rs 150</span>
                  </div>
                  <div className="flex justify-between items-center text-text-muted">
                    <span>Tax (GST)</span>
                    <span className="font-semibold text-text-main">Rs {(cartTotal * 0.16).toFixed(0)}</span>
                  </div>
                </div>

                <div className="h-px w-full bg-gray-100 mb-6"></div>

                <div className="flex justify-between items-center mb-8">
                  <span className="font-bold text-[18px] text-text-main uppercase">Total</span>
                  <span className="font-black text-[24px] text-accent">Rs {cartTotal + 150 + Math.round(cartTotal * 0.16)}</span>
                </div>

                <button className="w-full bg-accent text-white py-4 rounded-xl font-bold uppercase tracking-wider text-[15px] hover:bg-[#c60024] transition-colors shadow-[0_8px_20px_rgba(228,0,43,0.25)] border-none cursor-pointer">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
