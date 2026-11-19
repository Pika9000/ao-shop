import {
  buildVietQrData,
  readOptionalJson,
  resolvePaymentOrder,
} from "../../../../../lib/payment"

export async function POST(request) {
  const parsed = await readOptionalJson(request)
  if (!parsed.ok) {
    return Response.json(
      { success: false, error: "Dữ liệu JSON không hợp lệ", code: "INVALID_JSON" },
      { status: 400 }
    )
  }

  try {
    const resolved = await resolvePaymentOrder(parsed.body?.orderId)
    if (resolved.error) {
      return Response.json(
        { success: false, error: resolved.error, code: resolved.code },
        { status: resolved.status }
      )
    }

    const data = buildVietQrData(resolved)
    return Response.json({
      success: true,
      message: "Đã tạo mã VietQR thanh toán",
      data,
    })
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || "Lỗi tạo mã VietQR", code: "SERVER_ERROR" },
      { status: 500 }
    )
  }
}
