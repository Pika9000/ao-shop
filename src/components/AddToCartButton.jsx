"use client"

import { useCart } from "./CartContext"

export function AddToCartButton({ product }) {
  const { addToCart } = useCart()

  return (
    <button 
      onClick={(e) => {
        e.preventDefault(); // Ngăn không cho click chuyển trang khi bấm nút
        addToCart(product);
      }} 
      className="btn-add-cart"
    >
      Thêm vào giỏ
    </button>
  )
}
