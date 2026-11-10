import { NextRequest, NextResponse } from "next/server";
import { AuthError, forgotPassword } from "@/services/auth.service";
import { forgotPasswordSchema } from "@/lib/validators/auth.validator";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = forgotPasswordSchema.parse(body);

    const result = await forgotPassword(validatedData.email);

    return NextResponse.json(result);
  } catch (error) {
    // bắt lỗi dữ liệu đầu vào
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Dữ liệu không hợp lệ",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          message: "Dữ liệu gửi lên không phải JSON hợp lệ.",
        },
        { status: 400 },
      );
    }

    const status = error instanceof AuthError ? error.statusCode : 500;

    return NextResponse.json(
      {
        message:
          error instanceof AuthError
            ? error.message
            : "Không thể xử lý yêu cầu.",
      },
      { status },
    );
  }
}
