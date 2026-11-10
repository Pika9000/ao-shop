import { NextRequest, NextResponse } from "next/server";
import { AuthError, resetPassword } from "@/services/auth.service";
import { ZodError } from "zod";
import { resetPasswordSchema } from "@/lib/validators/auth.validator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = resetPasswordSchema.parse(body);

    const result = await resetPassword({
      email: validatedData.email,
      code: validatedData.code,
      newPassword: validatedData.newPassword,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Dữ liệu đặt lại mật khẩu không hợp lệ.",
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
            : "Không thể đặt lại mật khẩu.",
      },
      { status },
    );
  }
}
