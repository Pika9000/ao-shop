import { NextRequest, NextResponse } from "next/server";
import {
  CartError,
  removeCartItem,
  updateCartItemQuantity,
} from "@/services/cart.service";
import { getUserIdFromToken, OrderError } from "@/services/order.service";
import { updateCartItemSchema } from "@/lib/validators/cart.validator";
import { ZodError } from "zod";

// PATCH: Cập nhật số lượng sản phẩm trong giỏ
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const userId = await getUserIdFromToken(token);

    const { itemId } = await params;
    const body = await request.json();
    const { quantity } = updateCartItemSchema.parse(body);

    const updatedCart = await updateCartItemQuantity(userId, itemId, quantity);

    return NextResponse.json({
      success: true,
      message: "Cập nhật số lượng thành công.",
      data: updatedCart,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Số lượng cập nhật không hợp lệ.",
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
            : "Lỗi máy chủ khi cập nhật giỏ hàng.",
      },
      { status },
    );
  }
}

// DELETE: Xóa 1 sản phẩm khỏi giỏ hàng
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const userId = await getUserIdFromToken(token);

    const { itemId } = await params;
    const updatedCart = await removeCartItem(userId, itemId);

    return NextResponse.json({
      success: true,
      message: "Đã xóa sản phẩm khỏi giỏ hàng.",
      data: updatedCart,
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
            : "Lỗi máy chủ khi xóa sản phẩm khỏi giỏ.",
      },
      { status },
    );
  }
}
