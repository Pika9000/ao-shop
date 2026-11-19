import assert from "node:assert/strict"
import { PrismaClient } from "@prisma/client"

const BASE = "http://localhost:3000"
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

const prisma = new PrismaClient()
try {
  const product = await prisma.product.findFirst()
  assert.ok(product, "Cần ít nhất 1 sản phẩm trong DB để test")

  // 1. Giỏ hàng ban đầu rỗng
  let r = await req("/api/cart")
  assert.equal(r.status, 200)
  assert.deepEqual(r.json.data, { items: [], totalQuantity: 0, totalAmount: 0 })

  // 2. Validate đầu vào sai và sản phẩm không tồn tại
  r = await req("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: product.id, quantity: 0 }),
  })
  assert.equal(r.status, 400)

  r = await req("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: "khong-ton-tai", quantity: 1 }),
  })
  assert.equal(r.status, 404)

  // 3. Thêm 1 cái, cộng dồn thêm 2 cái, kiểm tra vượt tồn kho
  r = await req("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: product.id, quantity: 1 }),
  })
  assert.equal(r.status, 201)
  assert.equal(r.json.data.totalQuantity, 1)

  r = await req("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: product.id, quantity: 2 }),
  })
  assert.equal(r.status, 201)
  assert.equal(r.json.data.items[0].quantity, 3)

  r = await req("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: product.id, quantity: product.stockQuantity + 1 }),
  })
  assert.equal(r.status, 400)
  assert.equal(r.json.code, "OUT_OF_STOCK")

  // 4. Cập nhật số lượng về 2 và test vượt tồn kho
  r = await req(`/api/cart/items/${product.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity: 2 }),
  })
  assert.equal(r.status, 200)
  assert.equal(r.json.data.items[0].subtotal, Number(product.price) * 2)

  r = await req(`/api/cart/items/${product.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity: product.stockQuantity + 5 }),
  })
  assert.equal(r.status, 400)

  // 5. Xóa từng món và xóa lại lần 2 -> 404
  r = await req(`/api/cart/items/${product.id}`, { method: "DELETE" })
  assert.equal(r.status, 200)
  assert.equal(r.json.data.items.length, 0)

  r = await req(`/api/cart/items/${product.id}`, { method: "DELETE" })
  assert.equal(r.status, 404)

  // 6. Thêm lại rồi xóa toàn bộ giỏ hàng
  await req("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: product.id, quantity: 1 }),
  })
  r = await req("/api/cart", { method: "DELETE" })
  assert.equal(r.status, 200)
  assert.equal(r.json.data.totalQuantity, 0)

  // 7. Trang UI /cart render HTTP 200
  r = await req("/cart")
  assert.equal(r.status, 200)
  assert.match(r.text, /Giỏ hàng|Đang tải giỏ hàng/)

  console.log("ALL CART API & UI CHECKS PASSED")
} finally {
  await prisma.$disconnect()
}
