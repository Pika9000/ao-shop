import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { upsertVoucherSchema } from "@/lib/validators/voucher.validator";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET: Lấy chi tiết 1 voucher theo ID (dùng khi mở form sửa ở trang Admin)
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const voucher = await prisma.voucher.findUnique({
      where: { id },
    });

    if (!voucher) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy mã giảm giá.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: voucher,
    });
  } catch (error) {
    console.error("Lỗi lấy chi tiết voucher:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi máy chủ khi lấy thông tin mã giảm giá.",
      },
      { status: 500 },
    );
  }
}

// PATCH: Cập nhật thông tin voucher theo ID
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Validate dữ liệu đầu vào
    const validatedData = upsertVoucherSchema.parse(body);

    const updatedVoucher = await prisma.voucher.update({
      where: { id },
      data: {
        code: validatedData.code,
        description: validatedData.description,
        discountType: validatedData.discountType,
        discountValue: new Prisma.Decimal(validatedData.discountValue),
        maxDiscountAmount:
          validatedData.maxDiscountAmount !== null &&
          validatedData.maxDiscountAmount !== undefined
            ? new Prisma.Decimal(validatedData.maxDiscountAmount)
            : null,
        minOrderValue:
          validatedData.minOrderValue !== null &&
          validatedData.minOrderValue !== undefined
            ? new Prisma.Decimal(validatedData.minOrderValue)
            : null,
        usageLimit: validatedData.usageLimit ?? null,
        startDate: validatedData.startDate ?? null,
        endDate: validatedData.endDate ?? null,
        isActive: validatedData.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật mã giảm giá thành công!",
      data: updatedVoucher,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu cập nhật voucher không hợp lệ.",
          errors: error.issues,
        },
        { status: 400 },
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Lỗi không tìm thấy ID cần sửa
      if (error.code === "P2025") {
        return NextResponse.json(
          {
            success: false,
            message: "Không tìm thấy mã giảm giá cần cập nhật.",
          },
          { status: 404 },
        );
      }

      // Lỗi đổi sang mã code trùng với một voucher khác đã tồn tại
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            message: "Mã giảm giá này đã tồn tại trong hệ thống.",
          },
          { status: 400 },
        );
      }
    }

    console.error("Lỗi cập nhật voucher:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi máy chủ khi cập nhật mã giảm giá.",
      },
      { status: 500 },
    );
  }
}

// DELETE: Xóa voucher theo ID
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    await prisma.voucher.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa mã giảm giá thành công!",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Lỗi không tìm thấy ID cần xóa
      if (error.code === "P2025") {
        return NextResponse.json(
          {
            success: false,
            message: "Không tìm thấy mã giảm giá cần xóa.",
          },
          { status: 404 },
        );
      }

      // Lỗi vướng khóa ngoại (voucher đã từng được dùng trong các đơn hàng cũ)
      if (error.code === "P2003") {
        return NextResponse.json(
          {
            success: false,
            message:
              "Không thể xóa mã giảm giá này vì đã có đơn hàng sử dụng. Hãy tắt kích hoạt (isActive = false) thay vì xóa.",
          },
          { status: 400 },
        );
      }
    }

    console.error("Lỗi xóa voucher:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi máy chủ khi xóa mã giảm giá.",
      },
      { status: 500 },
    );
  }
}
