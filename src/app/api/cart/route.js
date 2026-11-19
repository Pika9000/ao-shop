import { buildCartData, readCartCookie, writeCartCookie } from "../../../lib/cart"

export async function GET() {
  try {
    const raw = await readCartCookie()
    const data = await buildCartData(raw)
    return Response.json({ success: true, data })
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || "Lỗi lấy dữ liệu giỏ hàng", code: "SERVER_ERROR" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    await writeCartCookie([])
    return Response.json({
      success: true,
      message: "Đã xóa toàn bộ giỏ hàng",
      data: { items: [], totalQuantity: 0, totalAmount: 0 },
    })
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || "Lỗi xóa giỏ hàng", code: "SERVER_ERROR" },
      { status: 500 }
    )
  }
}
