import { z } from "zod";

// thêm sản phẩm vào giỏ hàng
export const addToCartSchema = z.object({
  variantId: z.string().trim().min(1, "ID biến thể sản phẩm không hợp lệ"),
  quantity: z
    .number()
    .int("Số lượng phải là số nguyên.")
    .min(1, "Số lượng tối thiểu là 1.")
    .max(100, "Số lượng tối đa là 100."),
});

// cập nhật số lượng trong giỏ hàng (PATCH)
export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int("Số lượng phải là số nguyên.")
    .min(0, "Số lượng không được âm.")
    .max(100, "Số lượng tối đa là 100."),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
