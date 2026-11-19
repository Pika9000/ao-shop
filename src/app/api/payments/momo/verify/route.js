import { writeCartCookie } from "../../../../../lib/cart"
import { markOrderPaidIfExists, verifyMomoCallback } from "../../../../../lib/payment"

export async function GET(request) {
  try {
    const params = Object.fromEntries(new URL(request.url).searchParams.entries())
    const check = verifyMomoCallback(params)

    if (!check.valid) {
      return Response.json(
        {
          success: false,
          error: "Chữ ký xác thực MoMo không hợp lệ",
          code: "INVALID_SIGNATURE",
        },
        { status: 400 }
      )
    }

    if (check.resultCode !== 0) {
      return Response.json(
        {
          success: false,
          error: params.message || "Giao dịch MoMo chưa thành công hoặc đã bị hủy",
          code: "MOMO_VERIFY_FAILED",
        },
        { status: 400 }
      )
    }

    await markOrderPaidIfExists(check.internalOrderId, "MOMO")
    if (!check.fromOrder) {
      await writeCartCookie([])
    }

    return Response.json({
      success: true,
      message: "Thanh toán MoMo thành công",
      data: {
        orderId: check.internalOrderId,
        paymentStatus: "SUCCESS",
        orderStatus: "PAID",
        transactionId: String(params.transId || ""),
      },
    })
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || "Lỗi xác thực MoMo", code: "SERVER_ERROR" },
      { status: 500 }
    )
  }
}
