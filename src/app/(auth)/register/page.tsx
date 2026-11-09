'use client';

import { Quicksand } from 'next/font/google';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './style.css';

const quicksand = Quicksand({
  weight: ['400', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-quicksand',
});

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handling Login logic
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
            <h2>JOIN THE<br />FASHION<br />MOVEMENT.</h2>
          </div>
        </div>

        {/* CỘT PHẢI: Khung Form Đăng nhập */}
        <div className="inner-form-container">
          
          {/* Logo LUMEN góc trên Form */}
          <div className="inner-brand">
            <Link href="/" className="inner-brand-link">
              <img src="/images/logo-5.png" className="inner-brand-logo-icon" alt="Lumen Logo" />
            </Link>
          </div>

          {/* Header tiêu đề */}
          <header className="inner-header">
            <h1 className="inner-header-title">Chào Mừng Trở Lại!</h1>
            <p className="inner-header-subtitle">
              Bạn đã có tài khoản?{' '}
              <Link href="/login" className="inner-header-link">
                đăng nhập
              </Link>
            </p>
          </header>

          {/* Form nhập liệu chính */}
          <form className="inner-form" onSubmit={handleSubmit}>
            
            {/* Field: Email / Username */}
            <div className="form-group">
              <label htmlFor="username" className="form-group-label">
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
                  id="username"
                  name="username"
                  className="form-group-input"
                  placeholder="Nhập họ và tên của bạn"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username" className="form-group-label">
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
                  id="eamil"
                  name="email"
                  className="form-group-input"
                  placeholder="Nhập email của bạn"
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
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username" className="form-group-label">
                Xác nhận mật khẩu *
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
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div>
            </div>

            {/* Nút Submit */}
            <button type="submit" className="btn btn-primary">
              Đăng ký
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