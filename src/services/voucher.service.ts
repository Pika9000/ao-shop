import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class VoucherError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = "VoucherError";
  }
}

// kiểm tra và tính toán số tiền giảm từ mã voucher cho 1 đơn hàng
export async function applyVoucher(code: string, orderTotal: number) {
  const normalizeCode = code.trim().toUpperCase();
  const now = new Date();

  // tìm voucher trong database
  const voucher = await prisma.voucher.findUnique({
    where: {
      code: normalizeCode,
    },
  });

  if (!voucher) {
    throw new VoucherError("Mã giảm giá không tồn tại.", 404);
  }

  // kiểm tra trạng thái kích hoạt
  if (!voucher.isActive) {
    throw new VoucherError("Mã giảm giá này không hoạt động.", 400);
  }

  // kiểm tra thời hạn hiệu lực
  if (voucher.startDate && now < voucher.startDate) {
    throw new VoucherError("Mã giảm giá này chưa đến thời gian sử dụng.", 400);
  }

  if (voucher.endDate && now > voucher.endDate) {
    throw new VoucherError("Mã giảm giá này đã hết hạn sử dụng.", 400);
  }

  // kiểm tra giới hạn số lần sử dụng
  if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
    throw new VoucherError("Mã giảm giá đã hết lượt sử dụng.", 400);
  }

  // kiểm tra giá trị đơn hàng tối thiểu
  const minOrderValue = voucher.minOrderValue
    ? Number(voucher.minOrderValue)
    : 0;
  if (orderTotal < minOrderValue) {
    throw new VoucherError(
      `Đơn hàng cần đạt tối thiểu ${minOrderValue.toLocaleString("vi-VN")}đ để sử dụng mã này.`,
      400,
    );
  }

  // tính toán số tiền được giảm
  const discountValue = Number(voucher.discountValue);
  let discountAmount = 0;

  if (voucher.discountType === "FIXED") {
    discountAmount = discountValue;
  } else if (voucher.discountType === "PERCENTAGE") {
    discountAmount = (orderTotal * discountValue) / 100;

    // nếu có giới hạn mức tối đa (maxDiscountAmount)
    if (voucher.maxDiscountAmount !== null) {
      const maxDiscount = Number(voucher.maxDiscountAmount);
      if (discountAmount > maxDiscount) {
        discountAmount = maxDiscount;
      }
    }
  }

  // đảm bảo số tiền giảm không vượt quá số tiền đơn hàng
  if (discountAmount > orderTotal) {
    discountAmount = orderTotal;
  }

  // làm tròn đến 2 chữ số thập phân
  discountAmount = Math.round(discountAmount * 100) / 100;

  return {
    voucherId: voucher.id,
    code: voucher.code,
    discountType: voucher.discountType,
    discountValue: discountValue,
    discountAmount: discountAmount,
    finalTotal: orderTotal - discountAmount,
    message: "Áp dụng mã giảm thành công!",
  };
}
