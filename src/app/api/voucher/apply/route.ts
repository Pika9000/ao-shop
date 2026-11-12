import { NextRequest, NextResponse } from "next/server";
import { applyVoucher, VoucherError } from "@/services/voucher.service";
import { applyVoucherSchema } from "@/lib/validators/voucher.validator";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    // đọc dữu liệu JSON từ request body gửi lên
    const body = await request.json();

    // validate dữ liệu đầu vào
    const validatedData = applyVoucherSchema.parse(body);

    // gọi service để kiểm tra mã và tính toán số tiền giảm giá
    const result = await applyVoucher(
      validatedData.code,
      validatedData.orderTotal,
    );

    // trả về kết quả thành công
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    // xử lý lỗi khi validate dữ liệu đầu vào (Zod Error)
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu mã giảm giá không hợp lệ.",
          errors: error.issues,
        },
        { status: 400 },
      );
    }

    // xử lý lỗi từ tầng service
    const status = error instanceof VoucherError ? error.statusCode : 500;

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof VoucherError
            ? error.message
            : "Lỗi máy chủ khi áp dụng mã giảm giá.",
      },
      { status },
    );
  }
}
