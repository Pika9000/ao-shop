// xác thực tài khoản
// Zod là một thư viện kiểm tra tính hợp lệ (schema validation)

import { z } from "zod";

// định dạng email
export const emailSchema = z
  .string()
  .trim()
  .email("Email không hợp lệ.")
  .max(254, "Email quá dài.")
  .transform((email) => email.toLowerCase());

// định dạng password
const passwordSchema = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
  .max(128, "Mật khẩu không được vượt quá 128 ký tự.");

const otpSchema = z.string().regex(/^\d{6}$/, "OTP phải gồm đúng 6 chữ số.");

// Đăng ký tài khoản
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên phải có ít nhất 2 ký tự.")
    .max(100, "Tên không được vượt quá 100 ký tự."),
  email: emailSchema,
  password: passwordSchema,
});

// Đăng nhập bằng email hoặc tên đăng nhập
export const loginSchema = z.object({
  loginIdentifier: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email hoặc tên đăng nhập.")
    .max(254, "Thông tin đăng nhập quá dài."),

  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu.")
    .max(128, "Mật khẩu quá dài."),
});

// Gửi OTP
export const sendOtpSchema = z.object({
  email: emailSchema,
});

// Xác minh OTP
export const verifyOtpSchema = z.object({
  email: emailSchema,
  code: otpSchema,
});

// Quên mật khẩu
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Đặt lại mật khẩu
export const resetPasswordSchema = z.object({
  email: emailSchema,
  code: otpSchema,
  newPassword: passwordSchema,
});

// Xuất kiểu TypeScript từ schema
export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export type SendOtpInput = z.infer<typeof sendOtpSchema>;

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
