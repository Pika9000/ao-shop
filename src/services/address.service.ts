import { prisma } from "@/lib/prisma";
import { UpsertAddressInput } from "@/lib/validators/address.validator";

export class AddressError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = "AddressError";
  }
}

// Lấy danh sách địa chỉ của user (Mặc định đưa lên đầu)
export async function getMyAddresses(userId: string) {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

// Thêm địa chỉ mới
export async function createAddress(userId: string, input: UpsertAddressInput) {
  return await prisma.$transaction(async (tx) => {
    const count = await tx.address.count({ where: { userId } });

    // Nếu đây là địa chỉ đầu tiên -> Bắt buộc là mặc định
    const shouldBeDefault = count === 0 ? true : Boolean(input.isDefault);

    // Nếu đặt làm mặc định -> Tắt mặc định của các địa chỉ cũ
    if (shouldBeDefault && count > 0) {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return await tx.address.create({
      data: {
        userId,
        recipient: input.recipient,
        phone: input.phone,
        province: input.province,
        district: input.district,
        ward: input.ward,
        street: input.street,
        isDefault: shouldBeDefault,
      },
    });
  });
}

// Cập nhật địa chỉ
export async function updateAddress(
  userId: string,
  addressId: string,
  input: UpsertAddressInput,
) {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw new AddressError("Không tìm thấy địa chỉ.", 404);
    }

    if (input.isDefault) {
      await tx.address.updateMany({
        where: { userId, id: { not: addressId }, isDefault: true },
        data: { isDefault: false },
      });
    }

    return await tx.address.update({
      where: { id: addressId },
      data: {
        recipient: input.recipient,
        phone: input.phone,
        province: input.province,
        district: input.district,
        ward: input.ward,
        street: input.street,
        // Không cho phép tự ý tắt mặc định nếu đang là địa chỉ mặc định duy nhất
        isDefault: existing.isDefault ? true : Boolean(input.isDefault),
      },
    });
  });
}

// Xóa địa chỉ
export async function deleteAddress(userId: string, addressId: string) {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw new AddressError("Không tìm thấy địa chỉ.", 404);
    }

    await tx.address.delete({
      where: { id: addressId },
    });

    // Nếu vừa xóa địa chỉ mặc định -> Chọn địa chỉ mới nhất còn lại làm mặc định thay thế
    if (existing.isDefault) {
      const nextAddress = await tx.address.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      if (nextAddress) {
        await tx.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return { message: "Đã xóa địa chỉ thành công." };
  });
}
