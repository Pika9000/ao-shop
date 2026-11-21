import { NextRequest, NextResponse } from "next/server";
import { addToCart, CartError, getMyCart } from "@/services/cart.service";
import { getUserIdFromToken, OrderError } from "@/services/order.service";
import { addToCartSchema } from "@/lib/validators/cart.validator";
import { ZodError } from "zod";

// GET: Xem giỏ hàng hiện tại
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const userId = await getUserIdFromToken(token);

    const cart = await getMyCart(userId);

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    const status =
      error instanceof OrderError || error instanceof CartError
        ? error.statusCode
        : 500;

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof OrderError || error instanceof CartError
            ? error.message
            : "Lỗi máy chủ khi lấy giỏ hàng.",
      },
      { status },
    );
  }
}

// POST: Thêm sản phẩm vào giỏ hàng
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const userId = await getUserIdFromToken(token);

    const body = await request.json();
    const validatedData = addToCartSchema.parse(body);

    const updatedCart = await addToCart(userId, validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Đã thêm sản phẩm vào giỏ hàng.",
        data: updatedCart,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu thêm vào giỏ không hợp lệ.",
          errors: error.issues,
        },
        { status: 400 },
      );
    }

    const status =
      error instanceof OrderError || error instanceof CartError
        ? error.statusCode
        : 500;

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof OrderError || error instanceof CartError
            ? error.message
            : "Lỗi máy chủ khi thêm vào giỏ hàng.",
      },
      { status },
    );
  }
}
