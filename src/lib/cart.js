import { cookies } from "next/headers"
import prisma from "./prisma"

// shortcut: stores cart items in httpOnly cookie because ao_db has not migrated Cart/CartItem tables or user auth yet, upgrade to prisma.cart/cartItem once schema.prisma and user auth are merged
export const CART_COOKIE = "ao_cart"

export async function readCartCookie() {
  const cookieStore = await cookies()
  const raw = cookieStore.get(CART_COOKIE)?.value
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item) =>
        item &&
        typeof item.productId === "string" &&
        item.productId.trim() !== "" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    )
  } catch {
    return []
  }
}

export async function writeCartCookie(rawItems) {
  const cookieStore = await cookies()
  if (!rawItems || rawItems.length === 0) {
    cookieStore.delete(CART_COOKIE)
    return
  }

  cookieStore.set(CART_COOKIE, JSON.stringify(rawItems), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function buildCartData(rawItems) {
  if (!rawItems || rawItems.length === 0) {
    return { items: [], totalQuantity: 0, totalAmount: 0 }
  }

  const ids = rawItems.map((item) => item.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
  })
  const productMap = new Map(products.map((p) => [p.id, p]))

  const items = []
  let totalQuantity = 0
  let totalAmount = 0

  for (const raw of rawItems) {
    const p = productMap.get(raw.productId)
    if (!p) continue
    const price = Number(p.price)
    const subtotal = price * raw.quantity
    items.push({
      id: p.id,
      productId: p.id,
      productName: p.name,
      price,
      stockQuantity: p.stockQuantity,
      quantity: raw.quantity,
      subtotal,
      imageUrl: p.imageUrl,
    })
    totalQuantity += raw.quantity
    totalAmount += subtotal
  }

  return { items, totalQuantity, totalAmount }
}
