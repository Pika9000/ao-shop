import prisma from "../../../../../lib/prisma"
import { isVietQrConfirmAuthorized } from "../../../../../lib/payment"

export async function POST(request) {
  if (!(await isVietQrConfirmAuthorized(request))) {
    return Response.json(
      { success: false, error: "Không có quyền xác nhận thanh toán VietQR", code: "UNAUTHORIZED" },
      { status: 401 }
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { success: false, error: "Dữ liệu JSON không hợp lệ", code: "INVALID_JSON" },
      { status: 400 }
    )
  }

  const orderId = typeof body?.orderId === "string" ? body.orderId.trim() : ""
  if (!orderId) {
    return Response.json(
      { success: false, error: "orderId là bắt buộc", code: "INVALID_INPUT" },
      { status: 400 }
    )
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      return Response.json(
        { success: false, error: "Không tìm thấy đơn hàng", code: "ORDER_NOT_FOUND" },
        { status: 404 }
      )
    }
    if (order.status === "PAID") {
      return Response.json(
        {
          success: false,
          error: "Đơn hàng đã được thanh toán trước đó",
          code: "ORDER_ALREADY_PAID",
        },
        { status: 400 }
      )
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID", paymentMethod: "VIETQR" },
    })

    const transactionId =
      typeof body?.transactionId === "string" && body.transactionId.trim()
        ? body.transactionId.trim()
        : `VQR_${Date.now()}`

    return Response.json({
      success: true,
      message: "Xác nhận thanh toán VietQR thành công",
      data: {
        orderId,
        paymentStatus: "SUCCESS",
        orderStatus: "PAID",
        transactionId,
        paidAt: new Date().toISOString(),
      },
    })
  } catch (err) {
    return Response.json(
      {
        success: false,
        error: err.message || "Lỗi xác nhận thanh toán VietQR",
        code: "SERVER_ERROR",
      },
      { status: 500 }
    )
  }
}
