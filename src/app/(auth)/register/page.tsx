"use client";

import { Quicksand } from "next/font/google";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./style.css";

const quicksand = Quicksand({
  weight: ["400", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-quicksand",
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // kiểm tra nhanh mật khẩu nhập lại ở frontend trước khi gửi lên sever
    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth.register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Đăng kí tài khoản thành công!");

        // chuyển hướng sang trang đăng nhập
        router.push("/login");
      } else {
        if (data.errors && data.errors.length > 0) {
          setErrorMessage(data.errors[0].message);
        } else {
          setErrorMessage(data.message || "Đăng kí thất bại.");
        }
      }
    } catch (error) {
      console.error("Lỗi kết nối API: ", error);
      setErrorMessage("Không thể kết nối đến hệ thống máy chủ.");
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

        {/* CỘT PHẢI: Khung Form Đăng kí */}
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
              Bạn đã có tài khoản?{" "}
              <Link href="/login" className="inner-header-link">
                đăng nhập
              </Link>
            </p>
          </header>

          {/* Hiển thị lỗi nếu Đăng ký thất bại */}
          {errorMessage && (
            <div
              className="auth-error-alert"
              style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Form nhập liệu chính */}
          <form
            className="inner-form"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            {/* Field: Email / Username */}
            <div className="form-group">
              <label htmlFor="name" className="form-group-label">
                Họ và tên *
              </label>
              <div className="form-group-input-wrapper">
                <img
                  src="/images/user.svg"
                  alt="User Icon"
                  className="form-group-icon"
                />
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-group-input"
                  placeholder="Nhập họ và tên của bạn"
                  autoComplete="off"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-group-label">
                Email *
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
                  autoComplete="new-password"
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
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-group-label">
                Xác nhận mật khẩu *
              </label>
              <div className="form-group-input-wrapper">
                <img
                  src="/images/lock.png"
                  alt="Lock Icon"
                  className="form-group-icon"
                />
                <input
                  type="confirmPassword"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-group-input"
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Nút Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>

            {/* Đăng nhập Social */}
            <div className="form-social">
              <button type="button" className="btn btn-google">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="btn-icon"
                />
                Đăng kí nhanh với Google
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
