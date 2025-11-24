// src/hooks/useCart.js
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext(null);
const STORAGE_KEY = 'cart_state_v1';
const FAV_KEY = 'favorites_v1';
const COUPON_CODE = 'VENDEDOR10';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);   // {id, name, price, qty}
  const [coupon, setCoupon] = useState('');
  const [favorites, setFavorites] = useState([]); // [productId]

  // load
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.items) setItems(saved.items);
          if (saved.coupon) setCoupon(saved.coupon);
        }
        const fr = await AsyncStorage.getItem(FAV_KEY);
        if (fr) setFavorites(JSON.parse(fr));
      } catch {}
    })();
  }, []);

  // persist
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ items, coupon }));
        await AsyncStorage.setItem(FAV_KEY, JSON.stringify(favorites));
      } catch {}
    })();
  }, [items, coupon, favorites]);

  // actions
  const addToCart = (product) => {
    if (!product) return;
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { id: product.id, name: product.name, price: Number(product.price) || 0, qty: 1 }];
    });
  };

  const updateQty = (id, delta) =>
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p
      )
    );

  const removeItem = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clearCart = () => setItems([]);
  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // totals
  const subtotal = useMemo(
    () => items.reduce((acc, p) => acc + p.price * p.qty, 0),
    [items]
  );

  const discount = useMemo(
    () => (coupon.trim().toUpperCase() === COUPON_CODE ? subtotal * 0.1 : 0),
    [coupon, subtotal]
  );

  const total = useMemo(() => subtotal - discount, [subtotal, discount]);

  // 🔹 NOVO: quantidade total de itens no carrinho (soma de todas as qty)
  const itemsCount = useMemo(
    () => items.reduce((acc, p) => acc + p.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      updateQty,
      removeItem,
      clearCart,
      coupon,
      setCoupon,
      subtotal,
      discount,
      total,
      favorites,
      toggleFavorite,
      COUPON_CODE,
      itemsCount, // 👈 exposto no contexto
    }),
    [items, coupon, subtotal, discount, total, favorites, itemsCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
