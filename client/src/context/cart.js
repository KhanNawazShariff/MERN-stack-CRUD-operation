import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [auth] = useAuth();

  const getStorageKey = () => {
    if (auth?.user?.email) return `cart_${auth.user.email}`;
    return "guest_cart";
  };

  // Load cart on auth change
  useEffect(() => {
    const key = getStorageKey();
    const savedCart = localStorage.getItem(key);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]);
    }
  }, [auth?.user?.email]);

  // Save cart to storage on change
  useEffect(() => {
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, auth?.user?.email]);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => useContext(CartContext);
