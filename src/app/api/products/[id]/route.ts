import { NextRequest, NextResponse } from "next/server";
import { getProductById, ProductError } from "@/services/product.service";
import { ZodError } from "zod";
import { productIdSchema } from "@/lib/validators/product.validator";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// _request: public
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;

    const validatedParams = productIdSchema.parse({
      id: params.id,
    });

    const product = await getProductById(validatedParams.id);

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "ID sản phẩm không hợp lệ.",
          errors: error.issues,
        },
        { status: 400 },
      );
    }

    const status = error instanceof ProductError ? error.statusCode : 500;

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof ProductError
            ? error.message
            : "Lỗi máy chủ khi lấy chi tiết sản phẩm.",
      },
      { status },
    );
  }
}
