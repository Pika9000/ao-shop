import { NextRequest, NextResponse } from "next/server";
import { AuthError, loginUser } from "@/services/auth.service";
import { loginSchema } from "@/lib/validators/auth.validator";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // kiểm tra đầu vào
    const validatedData = loginSchema.parse(body);

    const result = await loginUser({
      loginIdentifier: validatedData.loginIdentifier, // email hoặc tên đăng nhập
      password: validatedData.password,
    });

    const response = NextResponse.json({
      message: result.message,
      user: result.user,
    });

    response.cookies.set("auth_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    // lỗi dữ liệu đầu vào
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Dữ liệu đầu vào không hợp lệ.",
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
            : "Lỗi máy chủ khi đăng nhập.",
      },
      { status },
    );
  }
}
