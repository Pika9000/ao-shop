"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        setError(json.error || "Đăng nhập thất bại")
        return
      }

      router.push("/admin")
      router.refresh()
    } catch {
      setError("Lỗi kết nối tới máy chủ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-wrapper">
      <form className="admin-card admin-login-box" onSubmit={handleSubmit}>
        <h2 className="page-title">Đăng nhập Quản trị (Admin)</h2>
        <p className="admin-hint">Mặc định: admin / admin123</p>

        {error && <div className="admin-alert admin-alert-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="admin-user">Tài khoản</label>
          <input
            id="admin-user"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tài khoản admin"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="admin-pass">Mật khẩu</label>
          <input
            id="admin-pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  )
}
