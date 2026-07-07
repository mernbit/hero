import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTenant } from './TenantContext';
import ProductModal from '../components/ProductModal';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const tenant = useTenant();
    const tenantId = tenant?.id || 'default';

    // State for Product Modal
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for Cart Items
    const [cartItems, setCartItems] = useState([]);

    // Load cart from localStorage when tenant changes
    useEffect(() => {
        if (!tenantId) return;
        const storedCart = localStorage.getItem(`cart_${tenantId}`);
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart from local storage", e);
                setCartItems([]);
            }
        } else {
            setCartItems([]);
        }
    }, [tenantId]);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (!tenantId) return;
        if (cartItems.length > 0 || localStorage.getItem(`cart_${tenantId}`)) {
            localStorage.setItem(`cart_${tenantId}`, JSON.stringify(cartItems));
        }
    }, [cartItems, tenantId]);

    const addToCart = (product, quantity = 1, options = {}) => {
        setCartItems(prev => {
            const optionsString = JSON.stringify(options);
            const cartItemId = `${product.id}-${optionsString}`;
            
            const existingItemIndex = prev.findIndex(item => item.cartItemId === cartItemId);
            if (existingItemIndex >= 0) {
                const newCart = [...prev];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            } else {
                return [...prev, { ...product, cartItemId, quantity, selectedOptions: options }];
            }
        });
        
        closeModal();
    };

    const removeFromCart = (cartItemId) => {
        setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(cartItemId);
            return;
        }
        setCartItems(prev => 
            prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item)
        );
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProduct(null), 300); // delay for transition
    };
    
    // Calculate totals
    const cartTotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            cartTotal,
            itemCount,
            selectedProduct,
            isModalOpen,
            openModal,
            closeModal
        }}>
            {children}
            <ProductModal />
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
