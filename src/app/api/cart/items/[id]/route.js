import prisma from "../../../../../lib/prisma"
import { buildCartData, readCartCookie, writeCartCookie } from "../../../../../lib/cart"

export async function PUT(request, ctx) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { success: false, error: "Dữ liệu JSON không hợp lệ", code: "INVALID_JSON" },
      { status: 400 }
    )
  }

  const qty = Number(body?.quantity)
  if (!Number.isInteger(qty) || qty < 1) {
    return Response.json(
      { success: false, error: "Số lượng phải là số nguyên lớn hơn hoặc bằng 1", code: "INVALID_QUANTITY" },
      { status: 400 }
    )
  }

  try {
    const { id } = await ctx.params
    const raw = await readCartCookie()
    if (!raw.some((item) => item.productId === id)) {
      return Response.json(
        { success: false, error: "Không tìm thấy sản phẩm trong giỏ hàng", code: "ITEM_NOT_FOUND" },
        { status: 404 }
      )
    }

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      return Response.json(
        { success: false, error: "Sản phẩm không còn tồn tại", code: "PRODUCT_NOT_FOUND" },
        { status: 404 }
      )
    }

    if (qty > product.stockQuantity) {
      return Response.json(
        {
          success: false,
          error: `Số lượng trong kho không đủ (chỉ còn ${product.stockQuantity} sản phẩm)`,
          code: "OUT_OF_STOCK",
        },
        { status: 400 }
      )
    }

    const nextItems = raw.map((item) =>
      item.productId === id ? { ...item, quantity: qty } : item
    )
    await writeCartCookie(nextItems)
    const data = await buildCartData(nextItems)

    return Response.json({
      success: true,
      message: "Đã cập nhật số lượng thành công",
      data,
    })
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || "Lỗi cập nhật giỏ hàng", code: "SERVER_ERROR" },
      { status: 500 }
    )
  }
}

export async function DELETE(_request, ctx) {
  try {
    const { id } = await ctx.params
    const raw = await readCartCookie()
    if (!raw.some((item) => item.productId === id)) {
      return Response.json(
        { success: false, error: "Không tìm thấy sản phẩm trong giỏ hàng", code: "ITEM_NOT_FOUND" },
        { status: 404 }
      )
    }

    const nextItems = raw.filter((item) => item.productId !== id)
    await writeCartCookie(nextItems)
    const data = await buildCartData(nextItems)

    return Response.json({
      success: true,
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
      data,
    })
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || "Lỗi xóa sản phẩm khỏi giỏ hàng", code: "SERVER_ERROR" },
      { status: 500 }
    )
  }
}
