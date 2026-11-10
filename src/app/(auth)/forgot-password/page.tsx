"use client";

import { Quicksand } from "next/font/google";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./style.css";
import { text } from "stream/consumers";

const quicksand = Quicksand({
  weight: ["400", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-quicksand",
});

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Các state quản lý dữ liệu form
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Trạng thái giao diện
  const [isOtpSent, setIsOtpSent] = useState(false); // Cờ đánh dấu đã gửi OTP hay chưa
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Gọi API gửi mã OTP về email
  const handleSendOtp = async (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    if (!email) {
      setMessage({
        text: "Vui lòng nhập email trước khi lấy mã OTP.",
        type: "error",
      });
      return;
    }
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok || data.ok) {
        setMessage({
          text: data.message || "Mã OTP đã được gửi về Email thành công!",
          type: "success",
        });
        setIsOtpSent(true); // Đã gửi thành công -> Mở khóa các ô nhập OTP và Mật khẩu mới
      } else {
        setMessage({
          text: data.message || "Email không tồn tại hoặc lỗi gửi mail.",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Lỗi kết nối máy chủ.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Gửi toàn bộ (Email + OTP + Mật khẩu mới) lên API xử lý đổi mật khẩu
  const handleSubmitResetPassword = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    // Kiểm tra nhanh xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      setMessage({
        text: "Mật khẩu xác nhận không trùng khớp.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok || data.ok) {
        alert(data.message || "Đặt lại mật khẩu thành công!");
        router.push("/login"); // Đổi mật khẩu xong chuyển về trang đăng nhập
      } else {
        setMessage({
          text: data.message || "Mã OTP không hợp lệ hoặc đã hết hạn.",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Lỗi hệ thống xác thực.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`inner-page ${quicksand.className}`}>
      <main className="inner">
        {/* CỘT TRÁI: Hình ảnh Banner thời trang */}
        <div className="inner-banner">
          <img
            src="/images/anh-2.jpg"
            alt="Lumen Fashion Model"
            className="inner-image"
          />
          <div className="inner-overlay-text">
            <h2>
              JOIN THE
              <br />
              FASHION
              <br />
              MOVEMENT.
            </h2>
          </div>
        </div>

        {/* CỘT PHẢI: Khung Form Quên / Đặt lại mật khẩu */}
        <div className="inner-form-container">
          <div className="inner-brand">
            <Link href="/" className="inner-brand-link">
              <img
                src="/images/logo-5.png"
                className="inner-brand-logo-icon"
                alt="Lumen Logo"
              />
            </Link>
          </div>

          <header className="inner-header">
            <h1 className="inner-header-title">Quên Mật Khẩu?</h1>
            <p className="inner-header-subtitle">
              Bạn đã nhớ lại mật khẩu?{" "}
              <Link href="/login" className="inner-header-link">
                Đăng nhập
              </Link>
            </p>
          </header>

          {/* Hiển thị thông báo trạng thái */}
          {message.text && (
            <div
              style={{
                color: message.type === "success" ? "green" : "red",
                marginBottom: "15px",
                fontSize: "14px",
              }}
            >
              {message.type === "success" ? "✅" : "⚠️"} {message.text}
            </div>
          )}

          {/* Form chính: Khi chưa gửi OTP thì submit gọi bước reset, nhưng có nút riêng gửi mã */}
          <form className="inner-form" onSubmit={handleSubmitResetPassword}>
            {/* Field 1: Email và Nút Gửi OTP */}
            <div className="form-group">
              <label htmlFor="email" className="form-group-label">
                Email đăng nhập *
              </label>
              <div className="form-group-input-wrapper">
                <img
                  src="/images/envelope.png"
                  alt="Email Icon"
                  className="form-group-icon"
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-group-input"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isOtpSent} // Khóa ô email khi đã gửi OTP thành công
                  required
                />

                {/* Nút yêu cầu gửi mã OTP */}
                {!isOtpSent && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    style={{
                      whiteSpace: "nowrap",
                      padding: "0 15px",
                      fontSize: "13px",
                      height: "100%",
                    }}
                  >
                    {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
                  </button>
                )}
              </div>
            </div>

            {/* Gửi lại mã nếu chưa nhận được */}
            {isOtpSent && (
              <div className="form-options" style={{ marginBottom: "15px" }}>
                <span style={{ fontSize: "13px", color: "#666" }}>
                  Không nhận được mã?{" "}
                </span>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  style={{
                    background: "none",
                    border: "none",
                    color: "blue",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Gửi lại mã!
                </button>
              </div>
            )}

            {/* Field 2: Nhập mã OTP (Chỉ hiện / sáng lên khi đã gửi OTP thành công) */}
            {isOtpSent && (
              <>
                <div className="form-group">
                  <label htmlFor="otp" className="form-group-label">
                    Nhập mã OTP *
                  </label>
                  <div className="form-group-input-wrapper">
                    <img
                      src="/images/shield-check.png"
                      alt="OTP Icon"
                      className="form-group-icon"
                    />
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      className="form-group-input"
                      placeholder="Nhập 6 số OTP từ email"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Field 3: Mật khẩu mới */}
                <div className="form-group">
                  <label htmlFor="newPassword" className="form-group-label">
                    Mật khẩu mới *
                  </label>
                  <div className="form-group-input-wrapper">
                    <img
                      src="/images/lock.png"
                      alt="Lock Icon"
                      className="form-group-icon"
                    />
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="form-group-input"
                      placeholder="Nhập mật khẩu mới"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Field 4: Xác nhận mật khẩu mới */}
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-group-label">
                    Xác nhận mật khẩu mới *
                  </label>
                  <div className="form-group-input-wrapper">
                    <img
                      src="/images/lock.png"
                      alt="Lock Icon"
                      className="form-group-icon"
                    />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-group-input"
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Nút Submit cuối cùng: Xác thực OTP và Đổi mật khẩu */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu mới"}
                </button>
              </>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
