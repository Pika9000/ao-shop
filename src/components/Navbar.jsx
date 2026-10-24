"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { useCart } from "./CartContext"

export function Navbar() {
  const { data: session } = useSession()
  const { cart } = useCart()
  
  // Tính tổng số lượng áo có trong giỏ
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="navbar-header">
      <div className="container navbar">
        <Link href="/" className="logo">
          Áo Shop
        </Link>
        
        <nav className="nav-links">
          <Link href="/admin">⚙️ Admin</Link>
          <Link href="/cart">🛒 Giỏ hàng ({totalItems})</Link>
          
          {session ? (
            <div className="user-info">
              {session.user?.image && (
                <img src={session.user.image} alt="Avatar" className="avatar" />
              )}
              <span>{session.user?.name || session.user?.email}</span>
              <button onClick={() => signOut()} className="btn-logout">
                Đăng xuất
              </button>
            </div>
          ) : (
            <button onClick={() => signIn()} className="btn-login">
              Đăng nhập Google
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
