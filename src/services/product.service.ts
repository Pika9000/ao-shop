import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ProductListOptions } from "@/lib/validators/product.validator";

export class ProductError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = "ProductError";
  }
}

// các trường dữ liệu cần lấy
const productSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
  categoryId: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  variants: {
    select: {
      id: true,
      size: true,
      color: true,
      sku: true,
      stockQuantity: true,
      price: true,
    },
    orderBy: [{ size: "asc" as const }, { color: "asc" as const }],
  },
} satisfies Prisma.ProductSelect;

// 1. Lấy danh sách, tìm kiếm, lọc và phân trang
export async function getProducts(options: Partial<ProductListOptions> = {}) {
  const {
    page = 1,
    limit = 10,
    search,
    categoryId,
    size,
    color,
    minPrice,
    maxPrice,
    sortBy = "newest",
    inStock,
  } = options;

  // tạo điều kiện lọc giá
  const priceFilter: Prisma.DecimalFilter = {};

  if (minPrice !== undefined) {
    priceFilter.gte = new Prisma.Decimal(minPrice);
  }

  if (maxPrice !== undefined) {
    priceFilter.lte = new Prisma.Decimal(maxPrice);
  }

  // tạo điều kiện lọc size, color, còn hàng, tránh trường hợp hết hàng vẫn hiển thị
  const variantFilter: Prisma.ProductVariantWhereInput = {
    ...(size ? { size } : {}),
    ...(color ? { color } : {}),
    ...(inStock ? { stockQuantity: { gt: 0 } } : {}),
  };

  const where: Prisma.ProductWhereInput = {
    ...(search
      ? {
          name: {
            contains: search,
          },
        }
      : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {}),
    ...(Object.keys(variantFilter).length > 0
      ? {
          variants: {
            some: variantFilter,
          },
        }
      : {}),
  };

  let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];

  switch (sortBy) {
    case "price_asc":
      orderBy = [{ price: "asc" }, { id: "asc" }];
      break;

    case "price_desc":
      orderBy = [{ price: "desc" }, { id: "asc" }];
      break;

    case "newest":
    default:
      orderBy = [{ createdAt: "desc" }, { id: "asc" }];
      break;
  }

  const skip = (page - 1) * limit;

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      select: productSelect,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}

// 2. Lấy chi tiết sản phẩm theo ID
export async function getProductById(id: string) {
  // tìm sản phẩm theo id
  const product = await prisma.product.findUnique({
    where: { id },
    select: productSelect,
  });

  if (!product) {
    throw new ProductError("Không tìm thấy sản phẩm.", 404);
  }

  const totalStock = product.variants.reduce(
    (total, variant) => total + variant.stockQuantity,
    0,
  );

  return {
    ...product,
    totalStock,
    inStock: totalStock > 0,
  };
}
