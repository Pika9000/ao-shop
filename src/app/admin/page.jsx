"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const EMPTY_FORM = {
  name: "",
  price: "",
  stockQuantity: "0",
  imageUrl: "",
  description: "",
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function loadProducts() {
    setLoading(true)
    const res = await fetch("/api/admin/products")
    if (res.status === 401) {
      router.replace("/admin/login")
      return
    }
    const json = await res.json()
    if (json.success) {
      setProducts(json.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  function startEdit(p) {
    setEditingId(p.id)
    setForm({
      name: p.name || "",
      price: String(p.price ?? ""),
      stockQuantity: String(p.stockQuantity ?? 0),
      imageUrl: p.imageUrl || "",
      description: p.description || "",
    })
    setMessage("")
    setError("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function resetForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage("")
    setError("")

    const url = editingId
      ? `/api/admin/products/${editingId}`
      : "/api/admin/products"
    const method = editingId ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        imageUrl: form.imageUrl,
        description: form.description,
      }),
    })

    const json = await res.json()
    if (!res.ok || !json.success) {
      setError(json.error || "Có lỗi xảy ra")
      return
    }

    setMessage(json.message)
    resetForm()
    loadProducts()
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Bạn chắc chắn muốn xóa "${name}"?`)) return
    setMessage("")
    setError("")

    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    const json = await res.json()
    if (!res.ok || !json.success) {
      setError(json.error || "Xóa thất bại")
      return
    }

    setMessage(json.message)
    if (editingId === id) resetForm()
    loadProducts()
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin/login")
  }

  if (loading) {
    return <p>Đang tải dữ liệu quản trị...</p>
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2 className="page-title">Quản lý Sản phẩm (Admin)</h2>
        <button onClick={handleLogout} className="btn-danger">
          Đăng xuất Admin
        </button>
      </div>

      {message && <div className="admin-alert admin-alert-ok">{message}</div>}
      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      <form className="admin-card admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm mới"}</h3>

        <div className="admin-form-grid">
          <div className="form-group">
            <label htmlFor="prod-name">Tên sản phẩm *</label>
            <input
              id="prod-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="VD: Áo Thun Polo"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="prod-price">Giá bán (VNĐ) *</label>
            <input
              id="prod-price"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="VD: 250000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="prod-stock">Số lượng kho</label>
            <input
              id="prod-stock"
              type="number"
              min="0"
              value={form.stockQuantity}
              onChange={(e) =>
                setForm({ ...form, stockQuantity: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="prod-img">Link ảnh (URL)</label>
            <input
              id="prod-img"
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://picsum.photos/seed/ao/400/500"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="prod-desc">Mô tả sản phẩm</label>
          <textarea
            id="prod-desc"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Chất liệu, kiểu dáng..."
          />
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="btn-primary">
            {editingId ? "Lưu cập nhật" : "Thêm sản phẩm"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="btn-secondary"
            >
              Hủy sửa
            </button>
          )}
        </div>
      </form>

      <div className="admin-card">
        <h3>Danh sách sản phẩm ({products.length})</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="admin-thumb"
                      />
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    {p.description && (
                      <div className="admin-subtext">{p.description}</div>
                    )}
                  </td>
                  <td>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(p.price)}
                  </td>
                  <td>{p.stockQuantity ?? 0}</td>
                  <td className="admin-actions-cell">
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="btn-edit"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.name)}
                      className="btn-danger"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    Chưa có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
