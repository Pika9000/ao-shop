import { NextRequest, NextResponse } from "next/server";
import {
  AddressError,
  deleteAddress,
  updateAddress,
} from "@/services/address.service";
import { getUserIdFromToken, OrderError } from "@/services/order.service";
import { upsertAddressSchema } from "@/lib/validators/address.validator";
import { ZodError } from "zod";

// PUT: sửa địa chỉ / đặt mặc định
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const userId = await getUserIdFromToken(token);

    const { id } = await params;
    const body = await request.json();
    const validatedData = upsertAddressSchema.parse(body);

    const updated = await updateAddress(userId, id, validatedData);
    return NextResponse.json({
      success: true,
      message: "Cập nhật địa chỉ thành công.",
      data: updated,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Thông tin địa chỉ không hợp lệ.",
          errors: error.issues,
        },
        { status: 400 },
      );
    }
    const status =
      error instanceof OrderError || error instanceof AddressError
        ? error.statusCode
        : 500;
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof OrderError || error instanceof AddressError
            ? error.message
            : "Lỗi máy chủ khi cập nhật địa chỉ.",
      },
      { status },
    );
  }
}

// DELETE: Xóa
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const userId = await getUserIdFromToken(token);

    const { id } = await params;
    const result = await deleteAddress(userId, id);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const status =
      error instanceof OrderError || error instanceof AddressError
        ? error.statusCode
        : 500;
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof OrderError || error instanceof AddressError
            ? error.message
            : "Lỗi máy chủ khi xóa địa chỉ.",
      },
      { status },
    );
  }
}
