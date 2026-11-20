// app/layout.tsx
<<<<<<< HEAD
import React from "react";
import { Roboto, Playfair_Display } from "next/font/google";
import "./style-auth.css"; // File CSS toàn cục[cite: 2]

// 1. Khai báo Font Roboto (cho toàn trang)
const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-roboto", // Đặt tên biến CSS
  display: "swap",
=======
import React from 'react';
import { Roboto, Playfair_Display } from 'next/font/google';
import './style-auth.css'; // File CSS toàn cục[cite: 2]

// 1. Khai báo Font Roboto (cho toàn trang)
const roboto = Roboto({
  subsets: ['latin', 'vietnamese'],
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-roboto', // Đặt tên biến CSS
  display: 'swap',
>>>>>>> 42f8b71c5f43dfe6b315bf884d21f14968387e5c
});

// 2. Khai báo Font Playfair Display (cho Tiêu đề/Heading)
const playfair = Playfair_Display({
<<<<<<< HEAD
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair", // Đặt tên biến CSS
  display: "swap",
});

export const metadata = {
  title: "Lumen - Đăng nhập",
  description: "Trang đăng nhập hệ thống Lumen",
=======
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair', // Đặt tên biến CSS
  display: 'swap',
});

export const metadata = {
  title: 'Lumen - Đăng nhập',
  description: 'Trang đăng nhập hệ thống Lumen',
>>>>>>> 42f8b71c5f43dfe6b315bf884d21f14968387e5c
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
  return <div className="auth-container">{children}</div>;
}
=======
  return (
    <html lang="vi" className={`${roboto.variable} ${playfair.variable}`} suppressHydrationWarning>
  <body>{children}</body>
    </html>
  );
}
>>>>>>> 42f8b71c5f43dfe6b315bf884d21f14968387e5c
