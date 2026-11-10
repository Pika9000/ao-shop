import { prisma } from "@/lib/prisma";
import {
  OrderStatus,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import { jwtVerify } from "jose";
import {
  CreateOrderInput,
} from "@/lib/validators/order.validator";

export class OrderError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = "OrderError";
  }
}

// xác thục người dùng qua JWT
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new OrderError("JWT_SECRET chưa được cấu hình hợp lệ.", 500);
  }

  return new TextEncoder().encode(secret);
}

// Xác minh JWT và lấy ID khách hàng.
export async function getUserIdFromToken(token?: string): Promise<string> {
  if (!token) {
    throw new OrderError("Bạn cần đăng nhập để thực hiện chức năng này.", 401);
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });

    if (typeof payload.sub !== "string" || !payload.sub) {
      throw new Error("Invalid subject");
    }

    return payload.sub;
  } catch {
    throw new OrderError("Phiên đăng nhập không hợp lệ hoặc đã hết hạn.", 401);
  }
}

// Chuẩn hóa thông tin địa chỉ khách nhập.
function normalizeShippingAddress(
  address: CreateOrderInput["shippingAddress"],
) {
  if (!address) {
    throw new OrderError("Vui lòng cung cấp địa chỉ giao hàng.");
  }

  const result = {
    recipient: address.recipient?.trim(),
    phone: address.phone?.trim(),
    province: address.province?.trim(),
    district: address.district?.trim(),
    ward: address.ward?.trim(),
    street: address.street?.trim(),
  };

  if (
    !result.recipient ||
    !result.phone ||
    !result.province ||
    !result.district ||
    !result.ward ||
    !result.street
  ) {
    throw new OrderError("Vui lòng nhập đầy đủ thông tin giao hàng.");
  }

  if (result.recipient.length > 100) {
    throw new OrderError("Tên người nhận quá dài.");
  }

  if (!/^[0-9+()\-\s]{9,20}$/.test(result.phone)) {
    throw new OrderError("Số điện thoại không hợp lệ.");
  }

  return result;
}

// Tạo đơn hàng.
export async function createOrder(userId: string, input: CreateOrderInput) {
  // Gộp các dòng sản phẩm có cùng variantId
  const quantities = new Map<string, number>();

  for (const item of input.items) {
    const variantId = item.variantId.trim();

    const totalQuantity = (quantities.get(variantId) ?? 0) + item.quantity;

    if (totalQuantity > 100) {
      throw new OrderError("Số lượng một biến thể không được vượt quá 100.");
    }

    quantities.set(variantId, totalQuantity);
  }

  // Thực hiện tạo đơn hàng trong transaction
  return await prisma.$transaction(
    async (tx) => {
      let addressId: string | null = null;

      let shipping: {
        recipient: string;
        phone: string;
        province: string;
        district: string;
        ward: string;
        street: string;
      };

      // Kiểm tra địa chỉ giao hàng
      if (input.addressId) {
        const address = await tx.address.findFirst({
          where: {
            id: input.addressId,
            userId,
          },
        });

        if (!address) {
          throw new OrderError("Không tìm thấy địa chỉ giao hàng.", 404);
        }

        addressId = address.id;

        shipping = {
          recipient: address.recipient,
          phone: address.phone,
          province: address.province,
          district: address.district,
          ward: address.ward,
          street: address.street,
        };
      } else {
        shipping = normalizeShippingAddress(input.shippingAddress);
      }

      // Lấy danh sách biến thể sản phẩm
      const variantIds = [...quantities.keys()];

      const variants = await tx.productVariant.findMany({
        where: {
          id: {
            in: variantIds,
          },
        },
        include: {
          product: true,
        },
      });

      if (variants.length !== variantIds.length) {
        throw new OrderError(
          "Một hoặc nhiều biến thể sản phẩm không tồn tại.",
          404,
        );
      }

      const variantMap = new Map(
        variants.map((variant) => [variant.id, variant]),
      );

      let subtotal = new Prisma.Decimal(0);

      const orderItems: Array<{
        variantId: string;
        quantity: number;
        priceAtTime: Prisma.Decimal;
        productName: string;
        variantInfo: string;
        imageUrl: string | null;
      }> = [];

      // Kiểm tra tồn kho và tính tiền
      for (const [variantId, quantity] of quantities) {
        const variant = variantMap.get(variantId);

        if (!variant) {
          throw new OrderError("Không tìm thấy biến thể sản phẩm.", 404);
        }

        if (variant.stockQuantity < quantity) {
          throw new OrderError(
            `Sản phẩm ${variant.product.name}, size ${variant.size}, màu ${variant.color} không đủ tồn kho.`,
            409,
          );
        }

        // Lấy giá từ database, không lấy giá từ client
        const price = variant.price ?? variant.product.price;

        if (price.lessThan(0)) {
          throw new OrderError("Giá sản phẩm không hợp lệ.", 500);
        }

        subtotal = subtotal.add(price.mul(quantity));

        orderItems.push({
          variantId,
          quantity,
          priceAtTime: price,
          productName: variant.product.name,
          variantInfo: `Size: ${variant.size}; Màu: ${variant.color}`,
          imageUrl: variant.product.imageUrl,
        });
      }

      // Tính tổng tiền đơn hàng
      const shippingFee = new Prisma.Decimal(0);
      const discountAmount = new Prisma.Decimal(0);

      const totalAmount = subtotal.add(shippingFee).sub(discountAmount);

      // Trừ số lượng tồn kho
      for (const item of orderItems) {
        const updated = await tx.productVariant.updateMany({
          where: {
            id: item.variantId,
            stockQuantity: {
              gte: item.quantity,
            },
          },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });

        if (updated.count !== 1) {
          throw new OrderError(
            `Biến thể ${item.variantInfo} vừa hết hàng hoặc không đủ số lượng.`,
            409,
          );
        }
      }

      // Tạo đơn hàng
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          shippingFee,
          discountAmount,
          status: OrderStatus.PENDING,
          paymentMethod: input.paymentMethod,

          addressId,
          recipientName: shipping.recipient,
          recipientPhone: shipping.phone,

          shippingAddress: [
            shipping.street,
            shipping.ward,
            shipping.district,
            shipping.province,
          ].join(", "),

          // Tạo các sản phẩm trong đơn hàng
          orderItems: {
            create: orderItems.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              priceAtTime: item.priceAtTime,
              productName: item.productName,
              variantInfo: item.variantInfo,
              imageUrl: item.imageUrl,
            })),
          },

          // Tạo thông tin thanh toán
          payments: {
            create: {
              amount: totalAmount,
              method: input.paymentMethod,
              status: PaymentStatus.PENDING,
            },
          },
        },

        include: {
          orderItems: true,
          payments: true,
        },
      });

      return order;
    },
    {
      maxWait: 5000,
      timeout: 10000,
    },
  );
}

// Lịch sử đơn hàng của một khách hàng.
export async function getMyOrders(userId: string, page = 1, limit = 10) {
  // Điều kiện lấy đơn hàng của người dùng hiện tại
  const where: Prisma.OrderWhereInput = {
    userId,
  };

  // Lấy danh sách đơn hàng và tổng số đơn
  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,

      // Sắp xếp đơn hàng mới nhất trước
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],

      // Phân trang
      skip: (page - 1) * limit,
      take: limit,

      select: {
        id: true,
        totalAmount: true,
        shippingFee: true,
        discountAmount: true,
        status: true,
        paymentMethod: true,
        recipientName: true,
        createdAt: true,
        updatedAt: true,

        orderItems: {
          select: {
            id: true,
            quantity: true,
            priceAtTime: true,
            productName: true,
            variantInfo: true,
            imageUrl: true,
          },
        },
      },
    }),

    // Đếm tổng số đơn hàng của người dùng
    prisma.order.count({
      where,
    }),
  ]);

  // Tính tổng số trang
  const totalPages = Math.ceil(total / limit);

  // Trả kết quả
  return {
    data: orders,

    pagination: {
      page,
      limit,
      total,
      totalPages,

      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

// Chi tiết đơn hàng, bắt buộc đúng chủ sở hữu.
export async function getMyOrderById(userId: string, orderId: string) {
  // Tìm đơn hàng thuộc về người dùng hiện tại
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },

    include: {
      // Thông tin các sản phẩm trong đơn hàng
      orderItems: true,

      // Thông tin thanh toán
      payments: {
        select: {
          id: true,
          amount: true,
          method: true,
          status: true,
          transactionId: true,
          paidAt: true,
          createdAt: true,
        },
      },

      // Địa chỉ giao hàng đã lưu (nếu có)
      address: true,
    },
  });

  // Kiểm tra đơn hàng có tồn tại không
  if (!order) {
    throw new OrderError("Không tìm thấy đơn hàng.", 404);
  }

  // Trả về chi tiết đơn hàng
  return order;
}
