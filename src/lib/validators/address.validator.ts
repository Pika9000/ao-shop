import { z } from "zod";

export const upsertAddressSchema = z.object({
  recipient: z.string().trim().min(2, "Tên người nhận quá ngắn.").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+()\s-]{9,20}$/, "Số điện thoại không hợp lệ."),
  province: z.string().trim().min(1, "Vui lòng chọn Tỉnh/Thành phố.").max(100),
  district: z.string().trim().min(1, "Vui lòng chọn Quận/Huyện.").max(100),
  ward: z.string().trim().min(1, "Vui lòng chọn Phường/Xã.").max(100),
  street: z.string().trim().min(1, "Vui lòng nhập địa chỉ chi tiết.").max(255),
  isDefault: z.boolean().optional().default(false),
});

export type UpsertAddressInput = z.infer<typeof upsertAddressSchema>;
