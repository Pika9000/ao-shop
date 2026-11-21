import { NextRequest, NextResponse } from "next/server";
import {
  cancelOrder,
  getUserIdFromToken,
  OrderError,
} from "@/services/order.service";
import { orderIdSchema } from "@/lib/validators/order.validator";
import { ZodError } from "zod";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Next.js 15 dùng Promise cho params
) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const userId = await getUserIdFromToken(token);

    const resolvedParams = await params;
    const { id } = orderIdSchema.parse(resolvedParams);

    const result = await cancelOrder(userId, id);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, message: "ID đơn hàng không hợp lệ." },
        { status: 400 },
      );
    }

    const status = error instanceof OrderError ? error.statusCode : 500;
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof OrderError
            ? error.message
            : "Lỗi máy chủ khi hủy đơn hàng.",
      },
      { status },
    );
  }
}
