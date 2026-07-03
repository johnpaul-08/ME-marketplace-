import React, { createContext, useState, useContext } from 'react';
import { supabase } from '../supabase';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  const addToCart = async (product) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('Please login first');
      return;
    }

    const { data: existingItem } = await supabase
      .schema('marketplace_dataspace')
      .from('cart_items')
      .select('*')
      .eq('buyer_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle();

    if (existingItem) {
      await supabase
        .schema('marketplace_dataspace')
        .from('cart_items')
        .update({
          quantity: existingItem.quantity + 1,
        })
        .eq('id', existingItem.id);
    } else {
      await supabase
        .schema('marketplace_dataspace')
        .from('cart_items')
        .insert({
          buyer_id: user.id,
          product_id: product.id,
          quantity: 1,
        });
    }

    // Optional: update UI immediately
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);

      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = async (productId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .schema('marketplace_dataspace')
      .from('cart_items')
      .delete()
      .eq('buyer_id', user.id)
      .eq('product_id', productId);

    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = async (productId, amount) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const currentItem = cartItems.find((item) => item.id === productId);

    if (!currentItem) return;

    const newQuantity = Math.max(1, currentItem.quantity + amount);

    await supabase
      .schema('marketplace_dataspace')
      .from('cart_items')
      .update({
        quantity: newQuantity,
      })
      .eq('buyer_id', user.id)
      .eq('product_id', productId);

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .schema('marketplace_dataspace')
      .from('cart_items')
      .delete()
      .eq('buyer_id', user.id);

    setCartItems([]);
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};export default CartProvider;