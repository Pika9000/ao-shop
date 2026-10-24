import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import prisma from "../../../../../lib/prisma"

async function checkAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get("admin_session")?.value === "authenticated"
}

export async function PUT(request, ctx) {
  if (!(await checkAdmin())) {
    return Response.json(
      { success: false, error: "Chưa đăng nhập quyền Admin" },
      { status: 401 }
    )
  }

  try {
    const { id } = await ctx.params
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

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: body.description?.trim() || null,
        price,
        imageUrl: body.imageUrl?.trim() || null,
        stockQuantity: Number.isNaN(stockQuantity) ? 0 : stockQuantity,
      },
    })

    revalidatePath("/")
    return Response.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: product,
    })
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || "Không thể cập nhật sản phẩm" },
      { status: 500 }
    )
  }
}

export async function DELETE(_request, ctx) {
  if (!(await checkAdmin())) {
    return Response.json(
      { success: false, error: "Chưa đăng nhập quyền Admin" },
      { status: 401 }
    )
  }

  try {
    const { id } = await ctx.params
    await prisma.product.delete({ where: { id } })
    revalidatePath("/")
    return Response.json({
      success: true,
      message: "Đã xóa sản phẩm thành công",
    })
  } catch (err) {
    return Response.json(
      {
        success: false,
        error: "Không thể xóa sản phẩm (có thể đã phát sinh đơn hàng)",
      },
      { status: 400 }
    )
  }
}
