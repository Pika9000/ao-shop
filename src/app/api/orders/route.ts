import { NextRequest, NextResponse } from "next/server";
import {
  createOrder,
  getMyOrders,
  getUserIdFromToken,
  OrderError,
} from "@/services/order.service";
import { ZodError } from "zod";
import {
  createOrderSchema,
  orderListQuerySchema,
} from "@/lib/validators/order.validator";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const userId = await getUserIdFromToken(token);

    const body = await request.json();

    const validatedData = createOrderSchema.parse(body);

    const order = await createOrder(userId, validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Tạo đơn hàng thành công.",
        data: order,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu đơn hàng không hợp lệ.",
          errors: error.issues,
        },
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu JSON không hợp lệ.",
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
            : "Lỗi máy chủ khi tạo đơn hàng.",
      },
      { status },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const userId = await getUserIdFromToken(token);

    const params = request.nextUrl.searchParams;

    const validatedQuery = orderListQuerySchema.parse({
      page: params.get("page") ?? undefined,
      limit: params.get("limit") ?? undefined,
    });

    const result = await getMyOrders(
      userId,
      validatedQuery.page,
      validatedQuery.limit,
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Tham số phân trang không hợp lệ.",
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
            : "Lỗi máy chủ khi lấy lịch sử đơn hàng.",
      },
      { status },
    );
  }
}
