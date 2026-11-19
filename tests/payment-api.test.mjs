import assert from "node:assert/strict"
import crypto from "node:crypto"
import { PrismaClient } from "@prisma/client"

const BASE = "http://localhost:3000"
const ACCESS_KEY = process.env.MOMO_ACCESS_KEY || "klm05TvNBzhg7h7j"
const SECRET_KEY = process.env.MOMO_SECRET_KEY || "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa"
const PARTNER_CODE = process.env.MOMO_PARTNER_CODE || "MOMOBKUN20180529"
const jar = new Map()

function saveCookies(res) {
  for (const raw of res.headers.getSetCookie()) {
    const [pair, ...attrs] = raw.split(";").map((s) => s.trim())
    const eq = pair.indexOf("=")
    if (eq === -1) continue
    const name = pair.slice(0, eq)
    const val = pair.slice(eq + 1)
    const expired = attrs.some((a) => /^max-age=0$/i.test(a)) || val === ""
    if (expired) jar.delete(name)
    else jar.set(name, val)
  }
}

async function req(path, options = {}) {
  const cookie = [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ")
  const headers = { ...(options.headers || {}), ...(cookie ? { cookie } : {}) }
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  saveCookies(res)
  const text = await res.text()
  let json = null
  try { json = JSON.parse(text) } catch {}
  return { status: res.status, json, text }
}

function signCallback(payload) {
  const raw =
    `accessKey=${ACCESS_KEY}` +
    `&amount=${payload.amount}` +
    `&extraData=${payload.extraData}` +
    `&message=${payload.message}` +
    `&orderId=${payload.orderId}` +
    `&orderInfo=${payload.orderInfo}` +
    `&orderType=${payload.orderType}` +
    `&partnerCode=${payload.partnerCode}` +
    `&payType=${payload.payType}` +
    `&requestId=${payload.requestId}` +
    `&responseTime=${payload.responseTime}` +
    `&resultCode=${payload.resultCode}` +
    `&transId=${payload.transId}`
  return crypto.createHmac("sha256", SECRET_KEY).update(raw).digest("hex")
}

const prisma = new PrismaClient()
let tempUser = null
const tempOrderIds = []

try {
  const product = await prisma.product.findFirst()
  assert.ok(product, "Cần ít nhất 1 sản phẩm trong DB để test")

  tempUser = await prisma.user.create({
    data: { name: "Test Payment", email: `paytest_${Date.now()}@example.com` },
  })
  const orderVietQr = await prisma.order.create({
    data: {
      userId: tempUser.id,
      totalAmount: Number(product.price),
      status: "PENDING",
      paymentMethod: "VIETQR",
      shippingAddress: "Test Address",
    },
  })
  const orderMomo = await prisma.order.create({
    data: {
      userId: tempUser.id,
      totalAmount: Number(product.price),
      status: "PENDING",
      paymentMethod: "MOMO",
      shippingAddress: "Test Address",
    },
  })
  tempOrderIds.push(orderVietQr.id, orderMomo.id)

  // Đảm bảo giỏ trống trước khi bắt đầu
  await req("/api/cart", { method: "DELETE" })

  // 1. VietQR generate
  let r = await req("/api/payments/vietqr/generate", { method: "POST" })
  assert.equal(r.status, 400)
  assert.equal(r.json.code, "INVALID_ORDER_PAYMENT")

  r = await req("/api/payments/vietqr/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: "order-khong-ton-tai" }),
  })
  assert.equal(r.status, 404)

  await req("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: product.id, quantity: 1 }),
  })

  r = await req("/api/payments/vietqr/generate", { method: "POST" })
  assert.equal(r.status, 200)
  assert.match(r.json.data.qrUrl, /^https:\/\/img\.vietqr\.io\/image\//)
  assert.equal(r.json.data.amount, Math.round(Number(product.price)))

  // 2. VietQR confirm
  r = await req("/api/payments/vietqr/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: orderVietQr.id }),
  })
  assert.equal(r.status, 401)

  const loginRes = await req("/api/admin/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "admin123",
    }),
  })
  assert.equal(loginRes.status, 200)

  r = await req("/api/payments/vietqr/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: orderVietQr.id, transactionId: "FT_TEST_01" }),
  })
  assert.equal(r.status, 200)
  assert.equal(r.json.data.orderStatus, "PAID")

  const dbOrder1 = await prisma.order.findUnique({ where: { id: orderVietQr.id } })
  assert.equal(dbOrder1.status, "PAID")

  r = await req("/api/payments/vietqr/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: orderVietQr.id }),
  })
  assert.equal(r.status, 400)
  assert.equal(r.json.code, "ORDER_ALREADY_PAID")

  // 3. MoMo create (gọi thật lên MoMo Sandbox)
  r = await req("/api/payments/momo/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestType: "invalidType" }),
  })
  assert.equal(r.status, 400)

  r = await req("/api/payments/momo/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: "order-khong-ton-tai" }),
  })
  assert.equal(r.status, 404)

  r = await req("/api/payments/momo/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestType: "payWithMethod" }),
  })
  assert.equal(r.status, 200, `MoMo create failed: ${r.text}`)
  assert.match(r.json.data.payUrl, /^https:\/\//)

  // 4. MoMo IPN
  const ipnBase = {
    partnerCode: PARTNER_CODE,
    orderId: `${orderMomo.id}_${Date.now()}`,
    requestId: `REQ_${Date.now()}`,
    amount: Math.round(Number(product.price)),
    orderInfo: `Thanh toan don hang ${orderMomo.id}`,
    orderType: "momo_wallet",
    transId: 99887766,
    resultCode: 0,
    message: "Successful.",
    payType: "napas",
    responseTime: Date.now(),
    extraData: Buffer.from(
      JSON.stringify({ orderId: orderMomo.id, fromOrder: true })
    ).toString("base64"),
  }

  r = await req("/api/payments/momo/ipn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...ipnBase, signature: "bad_sig" }),
  })
  assert.equal(r.status, 400)
  assert.equal(r.json.code, "INVALID_SIGNATURE")

  r = await req("/api/payments/momo/ipn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...ipnBase, signature: signCallback(ipnBase) }),
  })
  assert.equal(r.status, 200)
  assert.equal(r.json.data.orderStatus, "PAID")

  const dbOrder2 = await prisma.order.findUnique({ where: { id: orderMomo.id } })
  assert.equal(dbOrder2.status, "PAID")
  assert.equal(dbOrder2.paymentMethod, "MOMO")

  // 5. MoMo verify (redirectUrl)
  const verifyFailPayload = {
    ...ipnBase,
    resultCode: 1006,
    message: "User cancelled",
    extraData: Buffer.from(
      JSON.stringify({ orderId: "AOSHOP_CART_1", fromOrder: false })
    ).toString("base64"),
  }
  const qsBad = new URLSearchParams({ ...verifyFailPayload, signature: "bad" })
  r = await req(`/api/payments/momo/verify?${qsBad}`)
  assert.equal(r.status, 400)
  assert.equal(r.json.code, "INVALID_SIGNATURE")

  const qsCancel = new URLSearchParams({
    ...verifyFailPayload,
    signature: signCallback(verifyFailPayload),
  })
  r = await req(`/api/payments/momo/verify?${qsCancel}`)
  assert.equal(r.status, 400)
  assert.equal(r.json.code, "MOMO_VERIFY_FAILED")

  const verifyOkPayload = { ...verifyFailPayload, resultCode: 0, message: "Successful." }
  const qsOk = new URLSearchParams({
    ...verifyOkPayload,
    signature: signCallback(verifyOkPayload),
  })
  r = await req(`/api/payments/momo/verify?${qsOk}`)
  assert.equal(r.status, 200)
  assert.equal(r.json.data.paymentStatus, "SUCCESS")

  // Giỏ hàng phải được xóa sạch sau verify thành công từ giỏ
  r = await req("/api/cart")
  assert.equal(r.json.data.totalQuantity, 0)

  console.log("ALL VIETQR & MOMO PAYMENT API CHECKS PASSED")
} finally {
  if (tempOrderIds.length > 0) {
    await prisma.order.deleteMany({ where: { id: { in: tempOrderIds } } })
  }
  if (tempUser) {
    await prisma.user.delete({ where: { id: tempUser.id } }).catch(() => {})
  }
  await prisma.$disconnect()
}
