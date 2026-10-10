"use client"

import { createContext, useContext, useState, useEffect } from 'react';

// 1. Tạo một cái "Kho chứa chung" (Context)
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Hàm này chạy 1 lần khi web vừa mở lên: Lấy giỏ hàng từ bộ nhớ trình duyệt ra
  useEffect(() => {
    const savedCart = localStorage.getItem('ao_shop_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Hàm thêm áo vào giỏ
  const addToCart = (product) => {
    setCart((gh_cu) => {
      // Kiểm tra xem áo này đã có trong giỏ chưa
      const daCo = gh_cu.find(item => item.id === product.id);
      let gh_moi;
      
      if (daCo) {
        // Nếu có rồi thì tăng số lượng lên 1
        gh_moi = gh_cu.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Nếu chưa có thì thêm áo mới vào với số lượng = 1
        gh_moi = [...gh_cu, { ...product, quantity: 1 }];
      }
      
      // Lưu lại vào bộ nhớ trình duyệt để f5 không bị mất
      localStorage.setItem('ao_shop_cart', JSON.stringify(gh_moi));
      return gh_moi;
    });
    
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Hàm rút gọn để các file khác lấy giỏ hàng ra dùng cho nhanh
export function useCart() {
  return useContext(CartContext);
}
