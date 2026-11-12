import { z } from "zod";

const nullableNumber = (schema: z.ZodNumber) =>
  z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? null : Number(val),
    schema.nullable().optional(),
  );

// Schema khi khách hàng áp dụng mã giảm giá ở giỏ hàng/ thanh toán
export const applyVoucherSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập mã giảm giá.")
    .transform((val) => val.toUpperCase()),

  orderTotal: z.coerce
    .number({ message: "Tổng tiền đơn hàng phải là số." })
    .min(0, "Tổng tiền đơn hàng không hợp lệ."),
});

// Schema khi admin tạo hoặc cập nhật mã giảm giá
export const upsertVoucherSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, "Mã voucher không được để trống.")
      .max(50, "Mã voucher không được quá 50 ký tự.")
      .transform((val) => val.toUpperCase()),

    description: z.string().trim().optional(),

    discountType: z.enum(["PERCENTAGE", "FIXED"], {
      message: "Loại giảm giá phải là PERCENTAGE hoặc FIXED.",
    }),

    discountValue: z.coerce
      .number({ message: "Giá trị giảm phải là số." })
      .positive("Giá trị giảm phải lớn hơn 0."),

    maxDiscountAmount: nullableNumber(
      z
        .number({ message: "Mức giảm tối đa phải là số." })
        .positive("Mức giảm tối đa phải lớn hơn 0."),
    ),

    minOrderValue: nullableNumber(
      z
        .number({ message: "Giá trị đơn tối thiểu phải là số." })
        .min(0, "Giá trị đơn hàng tối thiểu không được âm."),
    ),

    usageLimit: nullableNumber(
      z
        .number({ message: "Số lượt sử dụng phải là số." })
        .int("Số lượt sử dụng phải là số nguyên.")
        .min(1, "Số lượt sử dụng tối đa phải ít nhất là 1."),
    ),

    startDate: z.preprocess(
      (val) => (val ? new Date(val as string) : null),
      z.date().nullable().optional(),
    ),

    endDate: z.preprocess(
      (val) => (val ? new Date(val as string) : null),
      z.date().nullable().optional(),
    ),

    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      // Kiểm tra logic ngày tháng
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "Ngày bắt đầu không được lớn hơn ngày kết thúc.",
      path: ["startDate"],
    },
  )
  .refine(
    (data) => {
      // Nếu là giảm theo phần trăm thì giá trị không được vượt quá 100%
      if (data.discountType === "PERCENTAGE") {
        return data.discountValue <= 100;
      }
      return true;
    },
    {
      message: "Giá trị giảm theo phần trăm không được vượt quá 100%.",
      path: ["discountValue"],
    },
  );

export type ApplyVoucherInput = z.infer<typeof applyVoucherSchema>;
export type UpsertVoucherInput = z.infer<typeof upsertVoucherSchema>;
