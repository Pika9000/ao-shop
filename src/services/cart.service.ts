import { prisma } from "@/lib/prisma";
import { AddToCartInput } from "@/lib/validators/cart.validator";

export class CartError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = "CartError";
  }
}

// lấy chi tiết giỏ hàng của User (tự động tạo giỏ hàng nếu chưa có)
export async function getMyCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        orderBy: { createdAt: "desc" },
        include: {
          variant: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  imageUrl: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    imageUrl: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // Tính toán tổng tiền tạm tính và format lại dữ liệu cho Frontend dễ dùng
  let subtotal = 0;
  let totalItems = 0;

  const formattedItems = cart.items.map((item) => {
    const unitPrice = Number(item.variant.price ?? item.variant.product.price);
    const lineTotal = unitPrice * item.quantity;

    subtotal += lineTotal;
    totalItems += item.quantity;

    return {
      id: item.id,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
      stockQuantity: item.variant.stockQuantity,
      isOutOfStock: item.variant.stockQuantity < item.quantity,
      product: {
        id: item.variant.product.id,
        name: item.variant.product.name,
        slug: item.variant.product.slug,
        imageUrl: item.variant.product.imageUrl,
      },
      variant: {
        size: item.variant.size,
        color: item.variant.color,
      },
    };
  });

  return {
    id: cart.id,
    items: formattedItems,
    totalItems,
    subtotal,
  };
}

// Thêm biến thể sản phẩm vào giỏ (Cộng dồn số lượng nếu đã tồn tại)
export async function addToCart(userId: string, input: AddToCartInput) {
  const { variantId, quantity } = input;

  // Kiểm tra biến thể và tồn kho
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  });

  if (!variant) {
    throw new CartError("Biến thể sản phẩm không tồn tại.", 404);
  }

  if (variant.stockQuantity <= 0) {
    throw new CartError("Sản phẩm này hiện đã hết hàng.", 400);
  }

  // Tìm hoặc tạo giỏ hàng cho user
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  // Kiểm tra xem sản phẩm đã có trong giỏ chưa
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      variantId,
    },
  });

  const newQuantity = (existingItem?.quantity ?? 0) + quantity;

  if (newQuantity > variant.stockQuantity) {
    throw new CartError(
      `Chỉ còn ${variant.stockQuantity} sản phẩm trong kho (trong giỏ đã có ${existingItem?.quantity ?? 0}).`,
      400,
    );
  }

  if (newQuantity > 100) {
    throw new CartError("Số lượng tối đa cho một sản phẩm là 100.", 400);
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity,
      },
    });
  }

  return await getMyCart(userId);
}

// Cập nhật số lượng của 1 dòng trong giỏ (Tăng / Giảm)
export async function updateCartItemQuantity(
  userId: string,
  itemId: string,
  quantity: number,
) {
  // Đảm bảo item này thuộc đúng giỏ hàng của userId đang gọi
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId },
    },
    include: {
      variant: true,
    },
  });

  if (!cartItem) {
    throw new CartError("Không tìm thấy sản phẩm trong giỏ hàng.", 404);
  }

  // Nếu số lượng = 0 thì xóa luôn khỏi giỏ hàng
  if (quantity === 0) {
    await prisma.cartItem.delete({
      where: { id: itemId },
    });
    return await getMyCart(userId);
  }

  // Kiểm tra tồn kho
  if (quantity > cartItem.variant.stockQuantity) {
    throw new CartError(
      `Số lượng vượt quá tồn kho (chỉ còn ${cartItem.variant.stockQuantity} sản phẩm).`,
      400,
    );
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return await getMyCart(userId);
}

// Xóa 1 sản phẩm khỏi giỏ hàng
export async function removeCartItem(userId: string, itemId: string) {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId },
    },
  });

  if (!cartItem) {
    throw new CartError("Không tìm thấy sản phẩm trong giỏ hàng.", 404);
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return await getMyCart(userId);
}
