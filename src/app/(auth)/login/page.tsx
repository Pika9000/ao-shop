"use client";

import { Quicksand } from "next/font/google";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./style.css";

const quicksand = Quicksand({
  weight: ["400", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-quicksand",
});

export default function LoginPage() {
  const router = useRouter(); // biến chuyển hướng
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // bật loading
    setErrorMessage(""); // xóa lỗi cũ nếu có

    // thu thập dữ liệu từ form
    const formData = new FormData(e.currentTarget);
    const loginIdentifier = formData.get("loginIdentifier");
    const password = formData.get("password");

    try {
      // gửi request POST đến route yêu cầu tạo mới đăng nhập
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loginIdentifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // xử lý khi đăng nhập thành công
        alert(data.message || "Đăng nhập thành công!");

        localStorage.setItem("user", JSON.stringify(data.user));

        // điều hướng về trang chủ
        router.push("/");
        router.refresh(); // làm mới ứng dụng để nhận phiên đăng nhập mới
      } else {
        // xử lý khi backend báo lỗi
        if (data.errors && data.errors.length > 0) {
          // nếu lỗi chi tiết
          setErrorMessage(data.errors[0].message);
        } else {
          // lỗi chung
          setErrorMessage(data.message || "Đăng nhập thất bại.");
        }
      }
    } catch (error) {
      console.error("Lỗi kết nối API: ", error);
      setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`inner-page ${quicksand.className}`}>
      {/* Container chính */}
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

        {/* CỘT PHẢI: Khung Form Đăng nhập */}
        <div className="inner-form-container">
          {/* Logo LUMEN góc trên Form */}
          <div className="inner-brand">
            <Link href="/" className="inner-brand-link">
              <img
                src="/images/logo-5.png"
                className="inner-brand-logo-icon"
                alt="Lumen Logo"
              />
            </Link>
          </div>

          {/* Header tiêu đề */}
          <header className="inner-header">
            <h1 className="inner-header-title">Chào Mừng Trở Lại!</h1>
            <p className="inner-header-subtitle">
              Bạn chưa có tài khoản?{" "}
              <Link href="/register" className="inner-header-link">
                đăng ký
              </Link>
            </p>
          </header>

          {/* Hiển thị lỗi trực quan nếu có */}
          {errorMessage && (
            <div
              className="auth-error-alert"
              style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Form nhập liệu chính */}
          <form className="inner-form" onSubmit={handleSubmit}>
            {/* Field: Email / Username */}
            <div className="form-group">
              <label htmlFor="loginIdentifier" className="form-group-label">
                Email đăng nhập *
              </label>
              <div className="form-group-input-wrapper">
                <img
                  src="/images/envelope.png"
                  alt="Email Icon"
                  className="form-group-icon"
                />
                <input
                  type="text"
                  id="loginIdentifier"
                  name="loginIdentifier"
                  className="form-group-input"
                  placeholder="Email hoặc tên đăng nhập"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Field: Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-group-label">
                Mật khẩu *
              </label>
              <div className="form-group-input-wrapper">
                <img
                  src="/images/lock.png"
                  alt="Lock Icon"
                  className="form-group-icon"
                />
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-group-input"
                  placeholder="Nhập mật khẩu"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Quên mật khẩu */}
            <div className="form-options">
              <Link href="/forgot-password" className="form-options-forgot">
                Quên mật khẩu?
              </Link>
            </div>

            {/* Nút Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            {/* Đăng nhập Social */}
            <div className="form-social">
              <button type="button" className="btn btn-google">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="btn-icon"
                />
                Đăng nhập với Google
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
