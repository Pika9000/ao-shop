import { z } from "zod";

// Phương thức thanh toán
const paymentMethodSchema = z.enum(["COD", "VIETQR", "PAYPAL"]);

// Sản phẩm trong đơn hàng
const orderItemSchema = z.object({
  variantId: z.string().trim().min(1, "ID biến thể không hợp lệ."),
  quantity: z
    .number()
    .int("Số lượng phải là số nguyên.")
    .min(1, "Số lượng tối thiểu là 1.")
    .max(100, "Số lượng tối đa là 100."),
});

// Địa chỉ giao hàng
const shippingAddressSchema = z.object({
  recipient: z.string().trim().min(2, "Tên người nhận quá ngắn.").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+()\s-]{9,20}$/, "Số điện thoại không hợp lệ."),
  province: z.string().trim().min(1, "Vui lòng chọn Tỉnh/Thành phố.").max(100),
  district: z.string().trim().min(1, "Vui lòng chọn Quận/Huyện.").max(100),
  ward: z.string().trim().min(1, "Vui lòng chọn Phường/Xã.").max(100),
  street: z.string().trim().min(1, "Vui lòng nhập địa chỉ chi tiết.").max(255),
});

// Tạo đơn hàng
export const createOrderSchema = z
  .object({
    addressId: z.string().trim().min(1).optional(),
    shippingAddress: shippingAddressSchema.optional(),
    paymentMethod: paymentMethodSchema,
    items: z
      .array(orderItemSchema)
      .min(1, "Đơn hàng phải có sản phẩm.")
      .max(50, "Tối đa 50 dòng sản phẩm."),
  })
  .refine((data) => Boolean(data.addressId) !== Boolean(data.shippingAddress), {
    message:
      "Chọn một địa chỉ đã lưu hoặc nhập địa chỉ mới (chỉ chọn một trong hai).",
    path: ["addressId"],
  });

// Lấy danh sách đơn hàng
export const orderListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// Lấy chi tiết đơn hàng
export const orderIdSchema = z.object({
  id: z.string().trim().min(1, "ID đơn hàng không hợp lệ."),
});

// TypeScript types
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderListQuery = z.infer<typeof orderListQuerySchema>;
