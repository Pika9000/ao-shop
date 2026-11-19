import crypto from "node:crypto"
import { cookies } from "next/headers"
import prisma from "./prisma"
import { readCartCookie, buildCartData } from "./cart"

export function getVietQrConfig() {
  // shortcut: falls back to placeholder VietQR bank info when env vars are unset, configure real bank account in .env before production
  return {
    bankBin: process.env.NEXT_PUBLIC_BANK_BIN || "970422",
    bankCode: process.env.NEXT_PUBLIC_BANK_CODE || "MB",
    accountNo: process.env.NEXT_PUBLIC_BANK_ACCOUNT || "0123456789",
    accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "SHOP AO OFFICIAL",
  }
}

export function getMomoConfig() {
  // shortcut: falls back to public MoMo sandbox credentials when env vars are unset, require env vars before production deploy
  const baseUrl = (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/+$/, "")
  return {
    partnerCode: process.env.MOMO_PARTNER_CODE || "MOMOBKUN20180529",
    accessKey: process.env.MOMO_ACCESS_KEY || "klm05TvNBzhg7h7j",
    secretKey: process.env.MOMO_SECRET_KEY || "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa",
    endpoint: process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create",
    redirectUrl: process.env.MOMO_REDIRECT_URL || `${baseUrl}/cart`,
    ipnUrl: process.env.MOMO_IPN_URL || `${baseUrl}/api/payments/momo/ipn`,
  }
}

export function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

export function hmacSha256(raw, secret) {
  return crypto.createHmac("sha256", secret).update(raw).digest("hex")
}

export async function resolvePaymentOrder(rawOrderId) {
  if (rawOrderId !== undefined && rawOrderId !== null && rawOrderId !== "") {
    if (typeof rawOrderId !== "string") {
      return { error: "orderId không hợp lệ", code: "INVALID_INPUT", status: 400 }
    }
    const orderId = rawOrderId.trim()
    if (orderId) {
      const order = await prisma.order.findUnique({ where: { id: orderId } })
      if (!order) {
        return { error: "Không tìm thấy đơn hàng", code: "ORDER_NOT_FOUND", status: 404 }
      }
      if (order.status === "PAID") {
        return { error: "Đơn hàng đã được thanh toán", code: "ORDER_ALREADY_PAID", status: 400 }
      }
      const amount = Math.round(Number(order.totalAmount))
      if (!Number.isFinite(amount) || amount <= 0) {
        return { error: "Số tiền đơn hàng không hợp lệ", code: "INVALID_ORDER_PAYMENT", status: 400 }
      }
      return { orderId: order.id, amount, fromOrder: true }
    }
  }

  const raw = await readCartCookie()
  const cart = await buildCartData(raw)
  const amount = Math.round(Number(cart.totalAmount))
  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      error: "Giỏ hàng đang trống hoặc chưa chọn đơn hàng",
      code: "INVALID_ORDER_PAYMENT",
      status: 400,
    }
  }
  return { orderId: `AOSHOP_${Date.now()}`, amount, fromOrder: false }
}

export function buildVietQrData({ orderId, amount }) {
  const { bankBin, bankCode, accountNo, accountName } = getVietQrConfig()
  const content = `AOSHOP ${orderId}`
  const qs = new URLSearchParams({
    amount: String(amount),
    addInfo: content,
    accountName,
  })
  return {
    orderId,
    qrUrl: `https://img.vietqr.io/image/${encodeURIComponent(bankBin)}-${encodeURIComponent(accountNo)}-compact2.png?${qs.toString()}`,
    bankBin,
    bankCode,
    accountNo,
    accountName,
    amount,
    content,
    status: "PENDING",
  }
}

export function signMomoCreate({
  accessKey,
  amount,
  extraData,
  ipnUrl,
  orderId,
  orderInfo,
  partnerCode,
  redirectUrl,
  requestId,
  requestType,
  secretKey,
}) {
  const rawSignature =
    `accessKey=${accessKey}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&ipnUrl=${ipnUrl}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&partnerCode=${partnerCode}` +
    `&redirectUrl=${redirectUrl}` +
    `&requestId=${requestId}` +
    `&requestType=${requestType}`
  return hmacSha256(rawSignature, secretKey)
}

function decodeMomoExtraData(extraData, fallbackOrderId) {
  if (typeof extraData === "string" && extraData.trim() !== "") {
    try {
      const parsed = JSON.parse(Buffer.from(extraData, "base64").toString("utf8"))
      if (parsed && typeof parsed.orderId === "string" && parsed.orderId.trim() !== "") {
        return { orderId: parsed.orderId, fromOrder: Boolean(parsed.fromOrder) }
      }
    } catch {
      // Fallback to MoMo orderId below
    }
  }
  return { orderId: String(fallbackOrderId || ""), fromOrder: false }
}

export function verifyMomoCallback(payload) {
  if (!payload || typeof payload.signature !== "string") {
    return { valid: false, resultCode: -1, internalOrderId: "", fromOrder: false }
  }
  const { accessKey, secretKey } = getMomoConfig()
  const rawSignature =
    `accessKey=${accessKey}` +
    `&amount=${payload.amount ?? ""}` +
    `&extraData=${payload.extraData ?? ""}` +
    `&message=${payload.message ?? ""}` +
    `&orderId=${payload.orderId ?? ""}` +
    `&orderInfo=${payload.orderInfo ?? ""}` +
    `&orderType=${payload.orderType ?? ""}` +
    `&partnerCode=${payload.partnerCode ?? ""}` +
    `&payType=${payload.payType ?? ""}` +
    `&requestId=${payload.requestId ?? ""}` +
    `&responseTime=${payload.responseTime ?? ""}` +
    `&resultCode=${payload.resultCode ?? ""}` +
    `&transId=${payload.transId ?? ""}`

  const expected = hmacSha256(rawSignature, secretKey)
  const valid = safeEqual(payload.signature.toLowerCase(), expected)
  const resultCode = Number(payload.resultCode)
  const { orderId: internalOrderId, fromOrder } = decodeMomoExtraData(
    payload.extraData,
    payload.orderId
  )
  return { valid, resultCode, internalOrderId, fromOrder }
}

export async function markOrderPaidIfExists(orderId, paymentMethod) {
  if (!orderId) return null
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) return null
  if (order.status === "PAID") return order
  return prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID", paymentMethod },
  })
}

export async function readOptionalJson(request) {
  const text = await request.text()
  if (!text.trim()) return { ok: true, body: {} }
  try {
    return { ok: true, body: JSON.parse(text) }
  } catch {
    return { ok: false }
  }
}

export async function isVietQrConfirmAuthorized(request) {
  const cookieStore = await cookies()
  if (cookieStore.get("admin_session")?.value === "authenticated") {
    return true
  }
  const configuredSecret = process.env.VIETQR_WEBHOOK_SECRET
  const providedSecret = request.headers.get("x-webhook-secret")
  if (configuredSecret && providedSecret && safeEqual(providedSecret, configuredSecret)) {
    return true
  }
  return false
}
