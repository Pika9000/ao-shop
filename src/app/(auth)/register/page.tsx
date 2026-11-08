'use client';

import './style.css';
import { Quicksand } from 'next/font/google';
import React from 'react';
import Link from 'next/link';

const quicksand = Quicksand({
  weight: ['400', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-quicksand',
});

export default function RegisterPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  };

  return (
    <div className={`inner-container ${quicksand.className}`}>
      {/* Cột trái: Banner Lookbook */}
      <main className="inner">
        <div className="inner-banner">
          <img
            src="/images/anh-2.jpg"
            alt="Lumen Fashion Model"
            className="inner-image"
          />
          <div className="inner-content">
            <h2>
              JOIN THE<br />FASHION<br />MOVEMENT.
            </h2>
          </div>
        </div>

        {/* Cột phải: Form Đăng ký */}
        <div className="inner-form-register">
          {/* Logo thương hiệu */}
          <div className="inner-brand">
            <div className="inner-logo">
              <img src="/images/logo-2.png" alt="logo-web" className="inner-logo-web"/>
            </div>
          </div>

          <h1 className="inner-header-title">Tạo Tài Khoản</h1>
          <p className="inner-header-subtitle">
            Tham gia LUMEN để khám phá các bộ sưu tập<br/> thời trang độc quyền
          </p>

          {/* Form nhập liệu */}
          <form className="inner-form" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="inner-control">
              <label htmlFor="fullname" className="form-control-label">
                Họ và tên *
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                className="form-control__input"
                placeholder="Nhập họ và tên của bạn"
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label htmlFor="email" className="form-control__label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control__input"
                placeholder="Nhập email của bạn"
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label htmlFor="password" className="form-control__label">
                Mật khẩu *
              </label>
              <div className="input-password-wrapper">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control-password"
                  placeholder="Mật khẩu tối thiểu 8 kí tự"
                  required
                />
                <button
                  type="button"
                  className="input-password-wrapper"
                  aria-label="Toggle password visibility"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div><div className="form-control">
              <label htmlFor="password" className="form-control__label">
                Xác nhận mật khẩu *
              </label>
              <div className="input-password-wrapper">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control-password"
                  placeholder="Mật khẩu tối thiểu 8 kí tự"
                  required
                />
                <button
                  type="button"
                  className="input-password-wrapper"
                  aria-label="Toggle password visibility"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Nút hành động */}
            <button type="submit" className="btn-primary">
              Tạo tài khoản
            </button>

            <button type="button" className="btn-google">
              <img
                src="/images/icon-google.jpg"
                alt="Google Icon"
                className="btn-icon"
              />
              Đăng nhập với Google
            </button>

            <p className="inner-switch">
              Đã có tài khoản?{' '}
              <a href="/login" className="inner-switch-link">
                Đăng nhập
              </a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}