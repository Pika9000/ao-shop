import { markOrderPaidIfExists, verifyMomoCallback } from "../../../../../lib/payment"

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

  try {
    const check = verifyMomoCallback(body)
    if (!check.valid) {
      return Response.json(
        { success: false, error: "Chữ ký IPN MoMo không hợp lệ", code: "INVALID_SIGNATURE" },
        { status: 400 }
      )
    }

    const paid = check.resultCode === 0
    if (paid) {
      await markOrderPaidIfExists(check.internalOrderId, "MOMO")
    }

    return Response.json({
      success: true,
      message: "IPN processed",
      data: {
        orderId: check.internalOrderId,
        paymentStatus: paid ? "SUCCESS" : "FAILED",
        orderStatus: paid ? "PAID" : "PENDING",
        transactionId: String(body.transId || ""),
      },
    })
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || "Lỗi xử lý IPN MoMo", code: "SERVER_ERROR" },
      { status: 500 }
    )
  }
}
