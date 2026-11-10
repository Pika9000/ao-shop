import { NextRequest, NextResponse } from "next/server";
import {
  getMyOrderById,
  getUserIdFromToken,
  OrderError,
} from "@/services/order.service";
import { ZodError } from "zod";
import { orderIdSchema } from "@/lib/validators/order.validator";

// xem chi tiết đơn hàng
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const userId = await getUserIdFromToken(token);

    const params = await context.params;

    const validatedParams = orderIdSchema.parse({
      id: params.id,
    });

    const order = await getMyOrderById(userId, validatedParams.id);

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "ID đơn hàng không hợp lệ.",
          errors: error.issues,
        },
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
            : "Lỗi máy chủ khi lấy chi tiết đơn hàng.",
      },
      { status },
    );
  }
}
