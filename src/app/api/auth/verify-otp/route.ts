import { NextRequest, NextResponse } from "next/server";
import { AuthError, verifyOtp } from "@/services/auth.service";
import { ZodError } from "zod";
import { verifyOtpSchema } from "@/lib/validators/auth.validator";

// xác nhận OTP khi reset password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = verifyOtpSchema.parse(body);

    const result = await verifyOtp(validatedData);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Dữ liệu xác minh OTP không hợp lệ.",
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
            : "Không thể xác minh OTP.",
      },
      { status },
    );
  }
}
