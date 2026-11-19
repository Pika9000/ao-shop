"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [loading, setLoading] = useState(true)

  const syncState = useCallback((data) => {
    setCart(data?.items || [])
    setTotalQuantity(data?.totalQuantity || 0)
    setTotalAmount(data?.totalAmount || 0)
  }, [])

  const refreshCart = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/cart", { cache: "no-store" })
      const json = await res.json()
      if (res.ok && json.success) {
        syncState(json.data)
      }
    } catch {
      // Giữ nguyên state hiện tại nếu mất kết nối tạm thời
    } finally {
      setLoading(false)
    }
  }, [syncState])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const mutateCart = async (url, options) => {
    try {
      const res = await fetch(url, options)
      const json = await res.json()
      if (!res.ok || !json.success) {
        return { ok: false, error: json.error || "Thao tác giỏ hàng thất bại" }
      }
      syncState(json.data)
      return { ok: true, message: json.message }
    } catch {
      return { ok: false, error: "Lỗi kết nối tới máy chủ" }
    }
  }

  const addToCart = async (product, quantity = 1) => {
    const result = await mutateCart("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, quantity }),
    })
    if (result.ok) {
      alert(`Đã thêm "${product.name}" vào giỏ hàng!`)
    } else {
      alert(result.error)
    }
    return result
  }

  const updateQuantity = (productId, quantity) =>
    mutateCart(`/api/cart/items/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    })

  const removeItem = (productId) =>
    mutateCart(`/api/cart/items/${productId}`, { method: "DELETE" })

  const clearCart = () => mutateCart("/api/cart", { method: "DELETE" })

  return (
    <CartContext.Provider
      value={{
        cart,
        totalQuantity,
        totalAmount,
        loading,
        refreshCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
