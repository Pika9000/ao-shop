import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { createHash, randomInt } from "node:crypto";
import { createAuthToken } from "@/lib/jwt";
import {
  RegisterInput,
  LoginInput,
  SendOtpInput,
  VerifyOtpInput,
  ResetPasswordInput,
} from "@/lib/validators/auth.validator";
import { z } from "zod";

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// xác thực | đặt lại mk
type OtpPurpose = "verify" | "reset";

// chuỗi mã hóa
function hashOtp(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

function getOtpIdentifier(email: string, purpose: OtpPurpose): string {
  return `${purpose}:${email}`;
}

// tạo otp ngẫu nhiên
function generateOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

function getMailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new AuthError("Chưa cấu hình SMTP trong file .env.", 500);
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 465),
    secure: Number(SMTP_PORT || 465) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

async function sendEmail(
  email: string,
  subject: string,
  code: string,
): Promise<void> {
  const mailer = getMailer();

  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject,
    text:
      `Mã OTP của bạn là: ${code}\n` +
      "Mã có hiệu lực trong 5 phút. " +
      "Không chia sẻ mã này với người khác.",
  });
}

// Hàm phụ chung dùng để kiểm tra và lấy OTP
async function verifyAndGetOtpRecord(
  email: string,
  purpose: OtpPurpose,
  code: string,
) {
  if (!/^[0-9]{6}$/.test(code ?? "")) {
    throw new AuthError("OTP phải gồm 6 chữ số.");
  }

  const identifier = getOtpIdentifier(email, purpose);

  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier,
      expires: { gt: new Date() },
    },
  });

  if (!record || record.token !== hashOtp(code)) {
    throw new AuthError("OTP không đúng hoặc đã hết hạn.", 400);
  }

  return { identifier, record };
}

// 1. ĐĂNG KÝ
export async function registerUser(data: RegisterInput) {
  const { name, email, password } = data;

  // Kiểm tra email đã tồn tại
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AuthError("Email đã được sử dụng.", 409);
  }

  // Mã hóa mật khẩu
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
      },
    });

    return {
      message: "Đăng ký thành công. Hãy xác minh email.",
      user,
    };
  } catch (error) {
    // Xử lý trường hợp hai request cùng đăng ký một email.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new AuthError("Email đã được sử dụng.", 409);
    }

    throw error;
  }
}

// 2. ĐĂNG NHẬP (Hỗ trợ bằng Email hoặc Tên đăng nhập)
export async function loginUser(data: LoginInput) {
  const { loginIdentifier, password } = data;

  // kiểm tra người dùng nhập email hay tên đăng nhập
  const isEmail = z.string().email().safeParse(loginIdentifier).success;
  const cleanIdentifier = loginIdentifier.trim().toLowerCase();

  // Tìm kiếm user trong database: khớp email HOẶC khớp name
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        ...(isEmail ? [{ email: cleanIdentifier }] : []), // tìm theo email
        { name: loginIdentifier }, // Tìm theo tên đăng nhập
      ],
    },
  });

  if (
    !user ||
    !user.passwordHash ||
    !(await bcrypt.compare(password, user.passwordHash))
  ) {
    throw new AuthError(
      "Email/Tên đăng nhập hoặc mật khẩu không chính xác.",
      401,
    );
  }

  if (!user.emailVerified) {
    throw new AuthError("Vui lòng xác minh email trước khi đăng nhập.", 403);
  }

  const token = await createAuthToken({
    userId: user.id,
    email: user.email,
  });

  return {
    message: "Đăng nhập thành công.",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

// 3. GỬI OTP XÁC MINH EMAIL (verify)
// 6. GỬI OTP ĐẶT LẠI MẬT KHẨU (reset)
export async function sendOtp(data: SendOtpInput, purpose: OtpPurpose) {
  const { email } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Không tiết lộ email có tài khoản khi quên mật khẩu.
  if (!user && purpose === "reset") {
    return {
      message: "Nếu email tồn tại, hướng dẫn sẽ được gửi đến email đó.",
    };
  }

  if (!user) {
    throw new AuthError("Không tìm thấy tài khoản.", 404);
  }

  if (purpose === "verify" && user.emailVerified) {
    throw new AuthError("Email đã được xác minh.");
  }

  const identifier = getOtpIdentifier(email, purpose);
  const code = generateOtp();
  const expires = new Date(Date.now() + 5 * 60 * 1000);

  // xử lý database trước, tránh tồn tại nhiều OTP cùng lúc
  await prisma.$transaction([
    prisma.verificationToken.deleteMany({
      where: { identifier },
    }),
    prisma.verificationToken.create({
      data: {
        identifier,
        token: hashOtp(code),
        expires,
      },
    }),
  ]);

  // Gửi email
  try {
    await sendEmail(
      email,
      purpose === "verify"
        ? "Xác minh tài khoản Ao Shop"
        : "Đặt lại mật khẩu Ao Shop",
      code,
    );
  } catch (emailError) {
    // Log lỗi hệ thống gửi mail ở đây để kiểm tra sau (ví dụ: console.error hoặc Winston)
    console.error("Lỗi gửi email OTP:", emailError);
    throw new AuthError(
      "Không thể gửi email OTP lúc này. Vui lòng thử lại sau.",
      500,
    );
  }

  return {
    message: "OTP đã được gửi đến email của bạn.",
  };
}

// 4. xác minh otp đăng kí tài khoản
export async function verifyOtp(data: VerifyOtpInput) {
  const { email, code: otpCode } = data;

  const { identifier } = await verifyAndGetOtpRecord(email, "verify", otpCode);

  // Xác minh email và xóa OTP trong cùng transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.deleteMany({
      where: { identifier },
    }),
  ]);

  return {
    message: "Xác minh email thành công.",
  };
}

// 5. QUÊN MẬT KHẨU
export async function forgotPassword(email: string) {
  return sendOtp({ email }, "reset");
}

// xác minh otp đặt lại mật khẩu
export async function verifyResetOtp(data: VerifyOtpInput) {
  const { email, code: otpCode } = data;

  await verifyAndGetOtpRecord(email, "reset", otpCode);

  return {
    message: "Mã OTP chính xác. Vui lòng tiến hành nhập mật khẩu mới.",
  };
}

// 7. ĐẶT LẠI MẬT KHẨU
export async function resetPassword(data: ResetPasswordInput) {
  const { email, code, newPassword } = data;

  // Kiểm tra giới hạn của bcrypt (tối đa 72 bytes)
  if (Buffer.byteLength(newPassword, "utf8") > 72) {
    throw new AuthError("Mật khẩu mới không được vượt quá 72 bytes.");
  }

  const { identifier } = await verifyAndGetOtpRecord(
    email,
    "reset",
    code,
  );

  const passwordHash = await bcrypt.hash(newPassword, 12);

  // Dùng transaction để cập nhật mật khẩu và xóa OTP.
  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { 
        passwordHash,
        emailVerified: new Date() // Tiện ích: Kích hoạt luôn email vì họ đã vào mail lấy được OTP chính chủ
      },
    }),
    prisma.verificationToken.deleteMany({
      where: { identifier },
    }),
  ]);

  return {
    message: "Đặt lại mật khẩu thành công.",
  };
}
