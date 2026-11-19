"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useCart } from "../../components/CartContext"

const formatVND = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)

export default function CartPage() {
  const {
    cart,
    totalQuantity,
    totalAmount,
    loading,
    refreshCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart()
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [busyId, setBusyId] = useState(null)
  const [paying, setPaying] = useState("")
  const [vietQr, setVietQr] = useState(null)

  useEffect(() => {
    const search = window.location.search
    const params = new URLSearchParams(search)
    if (!params.get("partnerCode") || !params.get("signature")) return

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/payments/momo/verify${search}`)
        const json = await res.json()
        if (cancelled) return
        if (res.ok && json.success) {
          setNotice(
            `Thanh toán MoMo thành công! Mã đơn: ${json.data.orderId} — Mã GD: ${json.data.transactionId}`
          )
          await refreshCart()
        } else {
          setError(json.error || "Xác thực thanh toán MoMo thất bại")
        }
      } catch {
        if (!cancelled) setError("Lỗi kết nối khi xác thực thanh toán MoMo")
      } finally {
        window.history.replaceState({}, "", "/cart")
      }
    })()

    return () => {
      cancelled = true
    }
  }, [refreshCart])

  async function handleQuantity(productId, nextQty) {
    setError("")
    setVietQr(null)
    setBusyId(productId)
    const res = await updateQuantity(productId, nextQty)
    if (!res.ok) setError(res.error)
    setBusyId(null)
  }

  async function handleRemove(productId) {
    setError("")
    setVietQr(null)
    setBusyId(productId)
    const res = await removeItem(productId)
    if (!res.ok) setError(res.error)
    setBusyId(null)
  }

  async function handleClear() {
    if (!window.confirm("Bạn chắc chắn muốn xóa toàn bộ giỏ hàng?")) return
    setError("")
    setVietQr(null)
    const res = await clearCart()
    if (!res.ok) setError(res.error)
  }

  async function runPayment(type, url, body, onSuccess) {
    setError("")
    setNotice("")
    setPaying(type)
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error || "Không thể khởi tạo thanh toán")
        return
      }
      onSuccess(json.data)
    } catch {
      setError("Lỗi kết nối tới máy chủ thanh toán")
    } finally {
      setPaying("")
    }
  }

  const handleVietQr = () =>
    runPayment("vietqr", "/api/payments/vietqr/generate", {}, (data) => {
      setVietQr(data)
    })

  const handleMomo = () =>
    runPayment(
      "momo",
      "/api/payments/momo/create",
      { requestType: "payWithMethod" },
      (data) => {
        if (data?.payUrl) {
          window.location.href = data.payUrl
        } else {
          setError("Không nhận được đường dẫn thanh toán MoMo")
        }
      }
    )

  const alerts = (
    <>
      {notice && <div className="admin-alert admin-alert-ok">{notice}</div>}
      {error && <div className="admin-alert admin-alert-error">{error}</div>}
    </>
  )

  if (loading) {
    return <p>Đang tải giỏ hàng...</p>
  }

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        {alerts}
        <div className="admin-card cart-empty">
          <h2 className="page-title">Giỏ hàng của bạn đang trống</h2>
          <p>Hãy chọn thêm sản phẩm yêu thích ở trang chủ nhé.</p>
          <Link href="/" className="btn-primary cart-back-link">
            ← Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="page-title">Giỏ hàng của bạn ({totalQuantity} sản phẩm)</h2>
        <button type="button" onClick={handleClear} className="btn-danger">
          Xóa tất cả
        </button>
      </div>

      {alerts}

      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => {
                const disabled = busyId === item.productId
                return (
                  <tr key={item.productId}>
                    <td>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="admin-thumb"
                        />
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td>
                      <strong>{item.productName}</strong>
                      <div className="admin-subtext">
                        Kho còn: {item.stockQuantity}
                      </div>
                    </td>
                    <td>{formatVND(item.price)}</td>
                    <td>
                      <div className="cart-qty-control">
                        <button
                          type="button"
                          className="cart-qty-btn"
                          disabled={disabled || item.quantity <= 1}
                          onClick={() =>
                            handleQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span className="cart-qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="cart-qty-btn"
                          disabled={disabled}
                          onClick={() =>
                            handleQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <strong>{formatVND(item.subtotal)}</strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => handleRemove(item.productId)}
                        className="btn-danger"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card cart-summary">
        <div>
          <p>
            Tổng số lượng: <strong>{totalQuantity}</strong> sản phẩm
          </p>
          <p className="cart-summary-total">
            Tổng thanh toán: <strong>{formatVND(totalAmount)}</strong>
          </p>
        </div>
        <div className="cart-actions-row">
          <Link href="/" className="cart-back-link btn-secondary">
            ← Tiếp tục mua sắm
          </Link>
          <button
            type="button"
            className="btn-vietqr"
            disabled={Boolean(paying)}
            onClick={handleVietQr}
          >
            {paying === "vietqr" ? "Đang tạo mã..." : "Thanh toán VietQR"}
          </button>
          <button
            type="button"
            className="btn-momo"
            disabled={Boolean(paying)}
            onClick={handleMomo}
          >
            {paying === "momo" ? "Đang chuyển MoMo..." : "Thanh toán MoMo"}
          </button>
        </div>
      </div>

      {vietQr && (
        <div className="admin-card cart-qr-card">
          <h3>Quét mã VietQR để thanh toán</h3>
          <div className="cart-qr-body">
            <img
              src={vietQr.qrUrl}
              alt="Mã VietQR thanh toán"
              className="cart-qr-img"
            />
            <div className="cart-qr-info">
              <p>
                <strong>Ngân hàng:</strong> {vietQr.bankCode} ({vietQr.bankBin})
              </p>
              <p>
                <strong>Số tài khoản:</strong> {vietQr.accountNo}
              </p>
              <p>
                <strong>Chủ tài khoản:</strong> {vietQr.accountName}
              </p>
              <p>
                <strong>Số tiền:</strong> {formatVND(vietQr.amount)}
              </p>
              <p>
                <strong>Nội dung CK:</strong> <code>{vietQr.content}</code>
              </p>
              <p className="admin-subtext">
                Sau khi chuyển khoản, đơn hàng sẽ chờ Admin xác nhận qua cổng{" "}
                <code>/api/payments/vietqr/confirm</code>.
              </p>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setVietQr(null)}
                style={{ marginTop: 12 }}
              >
                Đóng mã QR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
