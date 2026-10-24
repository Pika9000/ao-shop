import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import prisma from "../../../../lib/prisma"

async function checkAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get("admin_session")?.value === "authenticated"
}

export async function GET() {
  if (!(await checkAdmin())) {
    return Response.json(
      { success: false, error: "Chưa đăng nhập quyền Admin" },
      { status: 401 }
    )
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    })
    return Response.json({ success: true, data: products })
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || "Lỗi lấy danh sách sản phẩm" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  if (!(await checkAdmin())) {
    return Response.json(
      { success: false, error: "Chưa đăng nhập quyền Admin" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const name = body.name?.trim()
    const price = Number(body.price)
    const stockQuantity = Number(body.stockQuantity ?? 0)

    if (!name || Number.isNaN(price) || price < 0) {
      return Response.json(
        { success: false, error: "Tên sản phẩm và giá hợp lệ là bắt buộc" },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: body.description?.trim() || null,
        price,
        imageUrl: body.imageUrl?.trim() || null,
        stockQuantity: Number.isNaN(stockQuantity) ? 0 : stockQuantity,
      },
    })

    revalidatePath("/")
    return Response.json(
      { success: true, message: "Thêm sản phẩm thành công", data: product },
      { status: 201 }
    )
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || "Lỗi khi thêm sản phẩm" },
      { status: 500 }
    )
  }
}
