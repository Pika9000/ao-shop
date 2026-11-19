import {
  getMomoConfig,
  readOptionalJson,
  resolvePaymentOrder,
  signMomoCreate,
} from "../../../../../lib/payment"

const ALLOWED_REQUEST_TYPES = new Set([
  "payWithMethod",
  "captureWallet",
  "payWithATM",
  "payWithCC",
])

export async function POST(request) {
  const parsed = await readOptionalJson(request)
  if (!parsed.ok) {
    return Response.json(
      { success: false, error: "Dữ liệu JSON không hợp lệ", code: "INVALID_JSON" },
      { status: 400 }
    )
  }

  const requestType = parsed.body?.requestType || "payWithMethod"
  if (!ALLOWED_REQUEST_TYPES.has(requestType)) {
    return Response.json(
      {
        success: false,
        error: "requestType không hợp lệ",
        code: "INVALID_REQUEST_TYPE",
      },
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

    const { orderId, amount, fromOrder } = resolved
    if (amount < 1000 || amount > 50000000) {
      return Response.json(
        {
          success: false,
          error: "Số tiền thanh toán MoMo phải từ 1.000đ đến 50.000.000đ",
          code: "INVALID_AMOUNT",
        },
        { status: 400 }
      )
    }

    const config = getMomoConfig()
    const momoOrderId = fromOrder ? `${orderId}_${Date.now()}` : orderId
    const requestId = `REQ_${momoOrderId}`
    const orderInfo = `Thanh toan don hang ${orderId}`
    const extraData = Buffer.from(JSON.stringify({ orderId, fromOrder })).toString("base64")

    const signature = signMomoCreate({
      accessKey: config.accessKey,
      amount,
      extraData,
      ipnUrl: config.ipnUrl,
      orderId: momoOrderId,
      orderInfo,
      partnerCode: config.partnerCode,
      redirectUrl: config.redirectUrl,
      requestId,
      requestType,
      secretKey: config.secretKey,
    })

    const momoRes = await fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        partnerCode: config.partnerCode,
        partnerName: "Ao Shop",
        storeId: "AoShopStore",
        requestId,
        amount,
        orderId: momoOrderId,
        orderInfo,
        redirectUrl: config.redirectUrl,
        ipnUrl: config.ipnUrl,
        lang: "vi",
        extraData,
        requestType,
        signature,
      }),
    })

    const momoJson = await momoRes.json().catch(() => null)
    if (!momoRes.ok || !momoJson || momoJson.resultCode !== 0 || !momoJson.payUrl) {
      return Response.json(
        {
          success: false,
          error: momoJson?.message || "Không thể tạo giao dịch MoMo lúc này",
          code: "MOMO_CREATE_FAILED",
        },
        { status: 502 }
      )
    }

    return Response.json({
      success: true,
      message: "Đã khởi tạo phiên thanh toán MoMo",
      data: {
        orderId,
        momoOrderId,
        requestId,
        payUrl: momoJson.payUrl,
        qrCodeUrl: momoJson.qrCodeUrl || null,
        deeplink: momoJson.deeplink || null,
      },
    })
  } catch (err) {
    return Response.json(
      {
        success: false,
        error: err.message || "Lỗi kết nối cổng thanh toán MoMo",
        code: "MOMO_CREATE_FAILED",
      },
      { status: 502 }
    )
  }
}
