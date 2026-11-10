import { NextRequest, NextResponse } from "next/server";
import { getProducts, ProductError } from "@/services/product.service";
import { ZodError } from "zod";
import { productQuerySchema } from "@/lib/validators/product.validator";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    const validatedQuery = productQuerySchema.parse({
      page: params.get("page") ?? undefined,
      limit: params.get("limit") ?? undefined,
      search: params.get("search") ?? undefined,
      categoryId: params.get("categoryId") ?? undefined,
      minPrice: params.get("minPrice") ?? undefined,
      maxPrice: params.get("maxPrice") ?? undefined,
      sortBy: params.get("sortBy") ?? undefined,
      inStock: params.get("inStock") ?? undefined,
    });

    const result = await getProducts(validatedQuery);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Tham số tìm kiếm sản phẩm không hợp lệ.",
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
            : "Lỗi máy chủ khi lấy danh sách sản phẩm.",
      },
      { status },
    );
  }
}
