import { NextRequest, NextResponse } from "next/server";
import { AuthError, registerUser } from "@/services/auth.service";
import { ZodError } from "zod";
import { registerSchema } from "@/lib/validators/auth.validator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // kiểm tra dữ liệu đầu vào
    const validatedData = registerSchema.parse(body);

    const result = await registerUser({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    // bắt lỗi đầu vào
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Dữ liệu đăng ký không hợp lệ.",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    // Lỗi JSON không hợp lệ
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
            : "Lỗi máy chủ khi đăng ký.",
      },
      { status },
    );
  }
}
