import { z } from "zod";

const optionalNumber = z.preprocess((value) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "string" && value.trim() === "") {
    return value;
  }

  return typeof value === "string" ? Number(value) : value;
}, z.number().finite().optional());

export const productQuerySchema = z
  .object({
    page: z.preprocess(
      (value) =>
        value === undefined
          ? 1
          : typeof value === "string" && value.trim() !== ""
            ? Number(value)
            : value,
      z.number().int().min(1).default(1),
    ),

    limit: z.preprocess(
      (value) =>
        value === undefined
          ? 12
          : typeof value === "string" && value.trim() !== ""
            ? Number(value)
            : value,
      z.number().int().min(1).max(100).default(12),
    ),

    search: z.string().trim().max(100).optional(),

    categoryId: z.string().trim().min(1).optional(),

    size: z.string().trim().min(1).optional(),

    color: z.string().trim().min(1).optional(),

    minPrice: optionalNumber.pipe(z.number().finite().min(0).optional()),

    maxPrice: optionalNumber.pipe(z.number().finite().min(0).optional()),

    sortBy: z.enum(["newest", "price_asc", "price_desc"]).default("newest"),

    inStock: z.preprocess((value) => {
      if (value === "true") return true;
      if (value === "false") return false;
      return value;
    }, z.boolean().optional()),
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message: "Giá thấp nhất không được lớn hơn giá cao nhất.",
      path: ["minPrice"],
    },
  );

export const productIdSchema = z.object({
  id: z.string().trim().min(1, "ID sản phẩm không hợp lệ."),
});

export type ProductListOptions = z.infer<typeof productQuerySchema>;
