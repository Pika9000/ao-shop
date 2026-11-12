import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { upsertVoucherSchema } from "@/lib/validators/voucher.validator";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

// GET: Lấy danh sách các mã giảm giá cho trang Admin
export async function GET(_request: NextRequest) {
  try {
    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: vouchers,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách voucher: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách voucher.",
      },
      { status: 500 },
    );
  }
}

// POST: tạo mới 1 voucher
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate dữ liệu đầu vào bằng upsertVoucherSchema
    const validatedData = upsertVoucherSchema.parse(body);

    // kiểm tra voucher đã tồn tại chưa
    const existingVoucher = await prisma.voucher.findUnique({
      where: { code: validatedData.code },
    });

    if (existingVoucher) {
      return NextResponse.json(
        {
          success: false,
          message: `Mã giảm giá "${validatedData.code}" đã tồn tại trong hệ thống.`,
        },
        { status: 400 },
      );
    }

    // tạo mới voucher trong database
    const newVoucher = await prisma.voucher.create({
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

    return NextResponse.json(
      {
        success: true,
        message: "Tạo mã giảm giá thành công!",
        data: newVoucher,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu tạo voucher không hợp lệ.",
          errors: error.issues,
        },
        { status: 400 },
      );
    }

    // Bắt lỗi trùng lặp unique từ Prisma (nếu có)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            message: "Mã giảm giá này đã tồn tại.",
          },
          { status: 400 },
        );
      }
    }

    console.error("Lỗi tạo voucher:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi máy chủ khi tạo mã giảm giá.",
      },
      { status: 500 },
    );
  }
}
