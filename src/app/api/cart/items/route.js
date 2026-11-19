import prisma from "../../../../lib/prisma"
import { buildCartData, readCartCookie, writeCartCookie } from "../../../../lib/cart"

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { success: false, error: "Dữ liệu JSON không hợp lệ", code: "INVALID_JSON" },
      { status: 400 }
    )
  }

  const rawId = body?.productId ?? body?.variantId
  const productId = typeof rawId === "string" ? rawId.trim() : ""
  const qty = body?.quantity === undefined ? 1 : Number(body.quantity)

  if (!productId || !Number.isInteger(qty) || qty < 1) {
    return Response.json(
      { success: false, error: "productId và số lượng nguyên dương là bắt buộc", code: "INVALID_INPUT" },
      { status: 400 }
    )
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return Response.json(
        { success: false, error: "Không tìm thấy sản phẩm", code: "PRODUCT_NOT_FOUND" },
        { status: 404 }
      )
    }

    const raw = await readCartCookie()
    const existing = raw.find((item) => item.productId === productId)
    const newQty = (existing ? existing.quantity : 0) + qty

    if (newQty > product.stockQuantity) {
      return Response.json(
        {
          success: false,
          error: `Số lượng trong kho không đủ (chỉ còn ${product.stockQuantity} sản phẩm)`,
          code: "OUT_OF_STOCK",
        },
        { status: 400 }
      )
    }

    const nextItems = existing
      ? raw.map((item) => (item.productId === productId ? { ...item, quantity: newQty } : item))
      : [...raw, { productId, quantity: newQty }]

    await writeCartCookie(nextItems)
    const data = await buildCartData(nextItems)

    return Response.json(
      { success: true, message: "Đã thêm sản phẩm vào giỏ hàng thành công", data },
      { status: 201 }
    )
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || "Lỗi thêm vào giỏ hàng", code: "SERVER_ERROR" },
      { status: 500 }
    )
  }
}
