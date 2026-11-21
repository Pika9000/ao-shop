import { NextRequest, NextResponse } from "next/server";
import {
  AddressError,
  createAddress,
  getMyAddresses,
} from "@/services/address.service";
import { getUserIdFromToken, OrderError } from "@/services/order.service";
import { upsertAddressSchema } from "@/lib/validators/address.validator";
import { ZodError } from "zod";

// GET: Lấy danh sách
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const userId = await getUserIdFromToken(token);

    const addresses = await getMyAddresses(userId);
    return NextResponse.json({ success: true, data: addresses });
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
            : "Lỗi máy chủ khi lấy sổ địa chỉ.",
      },
      { status },
    );
  }
}

// POST: tạo mới
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    const userId = await getUserIdFromToken(token);

    const body = await request.json();
    const validatedData = upsertAddressSchema.parse(body);

    const newAddress = await createAddress(userId, validatedData);
    return NextResponse.json(
      {
        success: true,
        message: "Thêm địa chỉ thành công.",
        data: newAddress,
      },
      { status: 201 },
    );
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
            : "Lỗi máy chủ khi thêm địa chỉ.",
      },
      { status },
    );
  }
}
